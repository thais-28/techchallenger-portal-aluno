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

// src/models/postModel.ts
var postModel_exports = {};
__export(postModel_exports, {
  PostModel: () => PostModel
});
module.exports = __toCommonJS(postModel_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PostModel
});
