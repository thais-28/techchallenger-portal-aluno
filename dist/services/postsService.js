"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/postsService.ts
var postsService_exports = {};
__export(postsService_exports, {
  createPostService: () => createPostService,
  deletePostService: () => deletePostService,
  getPostByIdService: () => getPostByIdService,
  getPostService: () => getPostService,
  updatePostService: () => updatePostService
});
module.exports = __toCommonJS(postsService_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createPostService,
  deletePostService,
  getPostByIdService,
  getPostService,
  updatePostService
});
