"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/models/postModel.ts
var import_mongoose = __toESM(require("mongoose"));
var PostSchema = new import_mongoose.default.Schema(
  {
    id: { type: import_mongoose.default.Schema.Types.ObjectId },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    subject: { type: String, default: Date.now }
  },
  { versionKey: false }
);
var PostModel = import_mongoose.default.model("posts", PostSchema);

// src/repositories/postsRepository.ts
var import_mongoose2 = require("mongoose");
var findAllPosts = async (filters = {}, pagination) => {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;
  const posts = await PostModel.find(filters).skip(skip).limit(limit).lean();
  return posts;
};
var findPostById = async (id) => {
  if (!import_mongoose2.Types.ObjectId.isValid(id)) return null;
  return await PostModel.findById(id).lean();
};
var createPost = async (data) => {
  const post = await PostModel.create(data);
  return post.toObject();
};
var deleteOnePost = async (id) => {
  if (!import_mongoose2.Types.ObjectId.isValid(id)) return false;
  const result = await PostModel.findByIdAndDelete(id);
  return result != null;
};
var updatePost = async (id, data) => {
  if (!import_mongoose2.Types.ObjectId.isValid(id)) return null;
  return await PostModel.findByIdAndUpdate(id, data, { new: true }).lean();
};

// src/utils/http-helper.ts
var ok = async (data) => {
  return {
    statusCode: 200,
    body: data
  };
};
var noContent = async () => {
  return {
    statusCode: 204,
    body: null
  };
};
var badRequest = async (error) => {
  return {
    statusCode: 400,
    body: error
  };
};
var created = async (createdPost) => {
  return {
    statusCode: 201,
    body: createdPost ?? "Successfully created"
  };
};

// src/services/postsService.ts
var getPostService = async (filters, pagination) => {
  const posts = await findAllPosts(filters, pagination);
  if (posts.length > 0) {
    return ok(posts);
  }
  return noContent();
};
var getPostByIdService = async (id) => {
  const post = await findPostById(id);
  if (post) {
    return ok(post);
  }
  return noContent();
};
var createPostService = async (postData) => {
  if (!postData || Object.keys(postData).length === 0) {
    return badRequest({ message: "Dados obrigat\xF3rios ausentes" });
  }
  const createdPost = await createPost(postData);
  return created(createdPost);
};
var deletePostService = async (id) => {
  const deleted = await deleteOnePost(id);
  if (deleted) {
    return ok({ message: "Deletado com sucesso" });
  }
  return badRequest({
    message: "Post n\xE3o encontrado ou ID inv\xE1lido"
  });
};
var updatePostService = async (id, content) => {
  if (!content || Object.keys(content).length === 0) {
    return badRequest({
      message: "Nenhum dado enviado para atualiza\xE7\xE3o"
    });
  }
  const updatedPost = await updatePost(id, content);
  if (!updatedPost) {
    return badRequest({
      message: "Post n\xE3o encontrado ou ID inv\xE1lido"
    });
  }
  return ok(updatedPost);
};

// src/validations/postValidation.ts
var import_zod = require("zod");
var postInputSchema = import_zod.z.object({
  title: import_zod.z.string().min(1, "T\xEDtulo \xE9 obrigat\xF3rio"),
  content: import_zod.z.string().min(1, "Conte\xFAdo \xE9 obrigat\xF3rio"),
  author: import_zod.z.string().min(1, "Autor \xE9 obrigat\xF3rio"),
  subject: import_zod.z.string().min(1, "Assunto \xE9 obrigat\xF3rio")
});

// src/controllers/postController.ts
var getPosts = async (req, res) => {
  const { page = "1", limit = "10", author, subject } = req.query;
  const filters = {
    ...author && { author },
    ...subject && { subject }
  };
  const pagination = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10)
  };
  const httpResponse = await getPostService(filters, pagination);
  if (httpResponse.statusCode === 204) {
    return res.sendStatus(204);
  }
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};
var getPostById = async (req, res) => {
  const id = req.params.id;
  const httpResponse = await getPostByIdService(id);
  if (httpResponse.statusCode === 204) {
    return res.sendStatus(204);
  }
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};
var createPost2 = async (req, res) => {
  const parseResult = postInputSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Dados inv\xE1lidos",
      errors: parseResult.error.flatten().fieldErrors
    });
  }
  const postData = parseResult.data;
  const createdResponse = await createPostService(postData);
  return res.status(createdResponse.statusCode).json(createdResponse.body);
};
var deletePost = async (req, res) => {
  const id = req.params.id;
  const httpResponse = await deletePostService(id);
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};
var updatePost2 = async (req, res) => {
  const id = req.params.id;
  const bodyData = req.body;
  const httpResponse = await updatePostService(id, bodyData);
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};

// src/tests/unit/postController.test.ts
jest.mock("../../../src/services/postsService");
jest.mock("../../../src/validations/postValidation", () => ({
  postInputSchema: { safeParse: jest.fn() }
}));
describe("PostController", () => {
  let req;
  let res;
  let statusMock;
  let jsonMock;
  let sendStatusMock;
  beforeEach(() => {
    jest.clearAllMocks();
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    sendStatusMock = jest.fn();
    res = {
      status: statusMock,
      json: jsonMock,
      sendStatus: sendStatusMock
    };
    req = {
      query: {},
      params: {},
      body: {}
    };
  });
  describe("getPosts", () => {
    it("deve aplicar filtros e pagina\xE7\xE3o e retornar os posts", async () => {
      const fakeResponse = { statusCode: 200, body: [{ id: "1", title: "A" }] };
      getPostService.mockResolvedValue(fakeResponse);
      req.query = { page: "2", limit: "5", author: "John", subject: "News" };
      await getPosts(req, res);
      expect(getPostService).toHaveBeenCalledWith(
        { author: "John", subject: "News" },
        { page: 2, limit: 5 }
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(fakeResponse.body);
    });
    it("deve usar valores padr\xE3o quando n\xE3o h\xE1 query params", async () => {
      const fakeResponse = { statusCode: 204, body: null };
      getPostService.mockResolvedValue(fakeResponse);
      await getPosts(req, res);
      expect(getPostService).toHaveBeenCalledWith(
        {},
        { page: 1, limit: 10 }
      );
      expect(sendStatusMock).toHaveBeenCalledWith(204);
    });
  });
  describe("getPostById", () => {
    it("deve chamar service e retornar o post quando existir", async () => {
      const fakePost = { id: "abc", title: "X" };
      getPostByIdService.mockResolvedValue({
        statusCode: 200,
        body: fakePost
      });
      req.params = { id: "abc" };
      await getPostById(req, res);
      expect(getPostByIdService).toHaveBeenCalledWith("abc");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(fakePost);
    });
    it("deve retornar 204 quando o post n\xE3o for encontrado", async () => {
      getPostByIdService.mockResolvedValue({
        statusCode: 204,
        body: null
      });
      req.params = { id: "naoexiste" };
      await getPostById(req, res);
      expect(getPostByIdService).toHaveBeenCalledWith("naoexiste");
      expect(sendStatusMock).toHaveBeenCalledWith(204);
    });
  });
  describe("createPost", () => {
    it("deve chamar service e retornar 201 quando criar com sucesso", async () => {
      const validData = { title: "T", content: "C", author: "A", subject: "S" };
      postInputSchema.safeParse.mockReturnValueOnce({
        success: true,
        data: validData
      });
      const createdResponse = {
        statusCode: 201,
        body: { id: "new", ...validData }
      };
      createPostService.mockResolvedValue(
        createdResponse
      );
      req.body = validData;
      await createPost2(req, res);
      expect(createPostService).toHaveBeenCalledWith(validData);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(createdResponse.body);
    });
  });
  describe("deletePost", () => {
    it("deve chamar service e retornar o status e body corretos", async () => {
      const delRes = {
        statusCode: 200,
        body: { message: "Deletado com sucesso" }
      };
      deletePostService.mockResolvedValue(delRes);
      req.params = { id: "123" };
      await deletePost(req, res);
      expect(deletePostService).toHaveBeenCalledWith("123");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(delRes.body);
    });
  });
  describe("updatePost", () => {
    it("deve chamar service e retornar o status e body corretos", async () => {
      const updateRes = { statusCode: 200, body: { id: "123", title: "Upd" } };
      updatePostService.mockResolvedValue(updateRes);
      const bodyData = { title: "Upd" };
      req.params = { id: "123" };
      req.body = bodyData;
      await updatePost2(req, res);
      expect(updatePostService).toHaveBeenCalledWith("123", bodyData);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updateRes.body);
    });
  });
});
