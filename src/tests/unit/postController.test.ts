// tests/unit/controllers/postController.test.ts
import { Request, Response } from "express";
import * as Service from "../../../src/services/postsService";
import { postInputSchema } from "../../../src/validations/postValidation";
import * as Controller from "../../../src/controllers/postController";

// Mock dos serviços e do schema de validação
jest.mock("../../../src/services/postsService");
jest.mock("../../../src/validations/postValidation", () => ({
  postInputSchema: { safeParse: jest.fn() },
}));

describe("PostController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendStatusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    sendStatusMock = jest.fn();

    res = {
      status: statusMock,
      json: jsonMock,
      sendStatus: sendStatusMock,
    };
    req = {
      query: {},
      params: {},
      body: {},
    };
  });

  describe("getPosts", () => {
    it("deve aplicar filtros e paginação e retornar os posts", async () => {
      const fakeResponse = { statusCode: 200, body: [{ id: "1", title: "A" }] };
      (Service.getPostService as jest.Mock).mockResolvedValue(fakeResponse);

      req.query = { page: "2", limit: "5", author: "John", subject: "News" };

      await Controller.getPosts(req as Request, res as Response);

      expect(Service.getPostService).toHaveBeenCalledWith(
        { author: "John", subject: "News" },
        { page: 2, limit: 5 }
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(fakeResponse.body);
    });

    it("deve usar valores padrão quando não há query params", async () => {
      const fakeResponse = { statusCode: 204, body: null };
      (Service.getPostService as jest.Mock).mockResolvedValue(fakeResponse);

      // req.query já vazio por default
      await Controller.getPosts(req as Request, res as Response);

      expect(Service.getPostService).toHaveBeenCalledWith(
        {},
        { page: 1, limit: 10 }
      );
      expect(sendStatusMock).toHaveBeenCalledWith(204);
    });
  });

  describe("getPostById", () => {
    it("deve chamar service e retornar o post quando existir", async () => {
      const fakePost = { id: "abc", title: "X" };
      (Service.getPostByIdService as jest.Mock).mockResolvedValue({
        statusCode: 200,
        body: fakePost,
      });

      req.params = { id: "abc" };
      await Controller.getPostById(req as Request, res as Response);

      expect(Service.getPostByIdService).toHaveBeenCalledWith("abc");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(fakePost);
    });

    it("deve retornar 204 quando o post não for encontrado", async () => {
      (Service.getPostByIdService as jest.Mock).mockResolvedValue({
        statusCode: 204,
        body: null,
      });

      req.params = { id: "naoexiste" };
      await Controller.getPostById(req as Request, res as Response);

      expect(Service.getPostByIdService).toHaveBeenCalledWith("naoexiste");
      expect(sendStatusMock).toHaveBeenCalledWith(204);
    });
  });

  describe("createPost", () => {
    it("deve chamar service e retornar 201 quando criar com sucesso", async () => {
      const validData = { title: "T", content: "C", author: "A", subject: "S" };
      (postInputSchema.safeParse as jest.Mock).mockReturnValueOnce({
        success: true,
        data: validData,
      });

      const createdResponse = {
        statusCode: 201,
        body: { id: "new", ...validData },
      };
      (Service.createPostService as jest.Mock).mockResolvedValue(
        createdResponse
      );

      req.body = validData;
      await Controller.createPost(req as Request, res as Response);

      expect(Service.createPostService).toHaveBeenCalledWith(validData);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(createdResponse.body);
    });
  });

  describe("deletePost", () => {
    it("deve chamar service e retornar o status e body corretos", async () => {
      const delRes = {
        statusCode: 200,
        body: { message: "Deletado com sucesso" },
      };
      (Service.deletePostService as jest.Mock).mockResolvedValue(delRes);

      req.params = { id: "123" };
      await Controller.deletePost(req as Request, res as Response);

      expect(Service.deletePostService).toHaveBeenCalledWith("123");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(delRes.body);
    });
  });

  describe("updatePost", () => {
    it("deve chamar service e retornar o status e body corretos", async () => {
      const updateRes = { statusCode: 200, body: { id: "123", title: "Upd" } };
      (Service.updatePostService as jest.Mock).mockResolvedValue(updateRes);

      const bodyData = { title: "Upd" };
      req.params = { id: "123" };
      req.body = bodyData as any;
      await Controller.updatePost(req as Request, res as Response);

      expect(Service.updatePostService).toHaveBeenCalledWith("123", bodyData);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updateRes.body);
    });
  });
});
