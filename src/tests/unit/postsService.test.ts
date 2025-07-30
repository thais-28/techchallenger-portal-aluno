// src/tests/unit/postsService.test.ts
import * as PostRepository from "../../../src/repositories/postsRepository";
import * as Service from "../../../src/services/postsService";
import { IPostInput } from "../../../src/types/post";

// Mock de todos os métodos do repositório
jest.mock("../../../src/repositories/postsRepository");

describe("postsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPostService", () => {
    it("deve retornar 200 e a lista de posts quando existirem", async () => {
      const fakePosts = [
        { id: "1", title: "A", content: "C", author: "Au", subject: "S" },
      ];
      (PostRepository.findAllPosts as jest.Mock).mockResolvedValue(fakePosts);

      const response = await Service.getPostService(
        { tag: "news" },
        { page: 2, limit: 5 }
      );

      expect(PostRepository.findAllPosts).toHaveBeenCalledWith(
        { tag: "news" },
        { page: 2, limit: 5 }
      );
      expect(response).toEqual({
        statusCode: 200,
        body: fakePosts,
      });
    });

    it("deve retornar 204 quando não houver posts", async () => {
      (PostRepository.findAllPosts as jest.Mock).mockResolvedValue([]);

      const response = await Service.getPostService({}, { page: 1, limit: 10 });

      expect(response).toEqual({
        statusCode: 204,
        body: null,
      });
    });
  });

  describe("getPostByIdService", () => {
    it("deve retornar 200 e o post quando encontrado", async () => {
      const fakePost = {
        id: "1",
        title: "A",
        content: "C",
        author: "Au",
        subject: "S",
      };
      (PostRepository.findPostById as jest.Mock).mockResolvedValue(fakePost);

      const response = await Service.getPostByIdService("1");

      expect(PostRepository.findPostById).toHaveBeenCalledWith("1");
      expect(response).toEqual({
        statusCode: 200,
        body: fakePost,
      });
    });

    it("deve retornar 204 quando não encontrar o post", async () => {
      (PostRepository.findPostById as jest.Mock).mockResolvedValue(null);

      const response = await Service.getPostByIdService("invalid-id");

      expect(response).toEqual({
        statusCode: 204,
        body: null,
      });
    });
  });

  describe("createPostService", () => {
    it("deve retornar 400 se postData for vazio", async () => {
      const response = await Service.createPostService({} as IPostInput);

      expect(response).toEqual({
        statusCode: 400,
        body: { message: "Dados obrigatórios ausentes" },
      });
    });

    it("deve criar um post e retornar 201", async () => {
      const input: IPostInput = {
        title: "Título",
        content: "Conteúdo",
        author: "Autor",
        subject: "Assunto",
      };
      const created = { id: "new-id", ...input };
      (PostRepository.createPost as jest.Mock).mockResolvedValue(created);

      const response = await Service.createPostService(input);

      expect(PostRepository.createPost).toHaveBeenCalledWith(input);
      expect(response).toEqual({
        statusCode: 201,
        body: created,
      });
    });
  });

  describe("deletePostService", () => {
    it("deve retornar 200 se deletar com sucesso", async () => {
      (PostRepository.deleteOnePost as jest.Mock).mockResolvedValue(true);

      const response = await Service.deletePostService("1");

      expect(PostRepository.deleteOnePost).toHaveBeenCalledWith("1");
      expect(response).toEqual({
        statusCode: 200,
        body: { message: "Deletado com sucesso" },
      });
    });

    it("deve retornar 400 se não encontrar o post para deletar", async () => {
      (PostRepository.deleteOnePost as jest.Mock).mockResolvedValue(false);

      const response = await Service.deletePostService("invalid-id");

      expect(response).toEqual({
        statusCode: 400,
        body: { message: "Post não encontrado ou ID inválido" },
      });
    });
  });

  describe("updatePostService", () => {
    it("deve retornar 400 se o conteúdo for vazio", async () => {
      const response = await Service.updatePostService("1", {} as any);

      expect(response).toEqual({
        statusCode: 400,
        body: { message: "Nenhum dado enviado para atualização" },
      });
    });

    it("deve retornar 400 se não encontrar o post para atualizar", async () => {
      const data = { title: "Novo Título" } as Partial<IPostInput>;
      (PostRepository.updatePost as jest.Mock).mockResolvedValue(null);

      const response = await Service.updatePostService("1", data);

      expect(PostRepository.updatePost).toHaveBeenCalledWith("1", data);
      expect(response).toEqual({
        statusCode: 400,
        body: { message: "Post não encontrado ou ID inválido" },
      });
    });

    it("deve retornar 200 se atualizar com sucesso", async () => {
      const data = { title: "Novo Título" } as Partial<IPostInput>;
      const updated = { id: "1", ...data };
      (PostRepository.updatePost as jest.Mock).mockResolvedValue(updated);

      const response = await Service.updatePostService("1", data);

      expect(PostRepository.updatePost).toHaveBeenCalledWith("1", data);
      expect(response).toEqual({
        statusCode: 200,
        body: updated,
      });
    });
  });
});
