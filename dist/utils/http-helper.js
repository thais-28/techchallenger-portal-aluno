"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/http-helper.ts
var http_helper_exports = {};
__export(http_helper_exports, {
  badRequest: () => badRequest,
  created: () => created,
  noContent: () => noContent,
  ok: () => ok
});
module.exports = __toCommonJS(http_helper_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  badRequest,
  created,
  noContent,
  ok
});
