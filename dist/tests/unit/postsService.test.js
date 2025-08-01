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

// src/tests/unit/postsService.test.ts
jest.mock("../../../src/repositories/postsRepository");
describe("postsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("getPostService", () => {
    it("deve retornar 200 e a lista de posts quando existirem", async () => {
      const fakePosts = [
        { id: "1", title: "A", content: "C", author: "Au", subject: "S" }
      ];
      findAllPosts.mockResolvedValue(fakePosts);
      const response = await getPostService(
        { tag: "news" },
        { page: 2, limit: 5 }
      );
      expect(findAllPosts).toHaveBeenCalledWith(
        { tag: "news" },
        { page: 2, limit: 5 }
      );
      expect(response).toEqual({
        statusCode: 200,
        body: fakePosts
      });
    });
    it("deve retornar 204 quando n\xE3o houver posts", async () => {
      findAllPosts.mockResolvedValue([]);
      const response = await getPostService({}, { page: 1, limit: 10 });
      expect(response).toEqual({
        statusCode: 204,
        body: null
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
        subject: "S"
      };
      findPostById.mockResolvedValue(fakePost);
      const response = await getPostByIdService("1");
      expect(findPostById).toHaveBeenCalledWith("1");
      expect(response).toEqual({
        statusCode: 200,
        body: fakePost
      });
    });
    it("deve retornar 204 quando n\xE3o encontrar o post", async () => {
      findPostById.mockResolvedValue(null);
      const response = await getPostByIdService("invalid-id");
      expect(response).toEqual({
        statusCode: 204,
        body: null
      });
    });
  });
  describe("createPostService", () => {
    it("deve retornar 400 se postData for vazio", async () => {
      const response = await createPostService({});
      expect(response).toEqual({
        statusCode: 400,
        body: { message: "Dados obrigat\xF3rios ausentes" }
      });
    });
    it("deve criar um post e retornar 201", async () => {
      const input = {
        title: "T\xEDtulo",
        content: "Conte\xFAdo",
        author: "Autor",
        subject: "Assunto"
      };
      const created2 = { id: "new-id", ...input };
      createPost.mockResolvedValue(created2);
      const response = await createPostService(input);
      expect(createPost).toHaveBeenCalledWith(input);
      expect(response).toEqual({
        statusCode: 201,
        body: created2
      });
    });
  });
  describe("deletePostService", () => {
    it("deve retornar 200 se deletar com sucesso", async () => {
      deleteOnePost.mockResolvedValue(true);
      const response = await deletePostService("1");
      expect(deleteOnePost).toHaveBeenCalledWith("1");
      expect(response).toEqual({
        statusCode: 200,
        body: { message: "Deletado com sucesso" }
      });
    });
    it("deve retornar 400 se n\xE3o encontrar o post para deletar", async () => {
      deleteOnePost.mockResolvedValue(false);
      const response = await deletePostService("invalid-id");
      expect(response).toEqual({
        statusCode: 400,
        body: { message: "Post n\xE3o encontrado ou ID inv\xE1lido" }
      });
    });
  });
  describe("updatePostService", () => {
    it("deve retornar 400 se o conte\xFAdo for vazio", async () => {
      const response = await updatePostService("1", {});
      expect(response).toEqual({
        statusCode: 400,
        body: { message: "Nenhum dado enviado para atualiza\xE7\xE3o" }
      });
    });
    it("deve retornar 400 se n\xE3o encontrar o post para atualizar", async () => {
      const data = { title: "Novo T\xEDtulo" };
      updatePost.mockResolvedValue(null);
      const response = await updatePostService("1", data);
      expect(updatePost).toHaveBeenCalledWith("1", data);
      expect(response).toEqual({
        statusCode: 400,
        body: { message: "Post n\xE3o encontrado ou ID inv\xE1lido" }
      });
    });
    it("deve retornar 200 se atualizar com sucesso", async () => {
      const data = { title: "Novo T\xEDtulo" };
      const updated = { id: "1", ...data };
      updatePost.mockResolvedValue(updated);
      const response = await updatePostService("1", data);
      expect(updatePost).toHaveBeenCalledWith("1", data);
      expect(response).toEqual({
        statusCode: 200,
        body: updated
      });
    });
  });
});
