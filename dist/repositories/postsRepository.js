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

// src/repositories/postsRepository.ts
var postsRepository_exports = {};
__export(postsRepository_exports, {
  createPost: () => createPost,
  deleteOnePost: () => deleteOnePost,
  findAllPosts: () => findAllPosts,
  findPostById: () => findPostById,
  updatePost: () => updatePost
});
module.exports = __toCommonJS(postsRepository_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createPost,
  deleteOnePost,
  findAllPosts,
  findPostById,
  updatePost
});
