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

// src/validations/postValidation.ts
var postValidation_exports = {};
__export(postValidation_exports, {
  postInputSchema: () => postInputSchema
});
module.exports = __toCommonJS(postValidation_exports);
var import_zod = require("zod");
var postInputSchema = import_zod.z.object({
  title: import_zod.z.string().min(1, "T\xEDtulo \xE9 obrigat\xF3rio"),
  content: import_zod.z.string().min(1, "Conte\xFAdo \xE9 obrigat\xF3rio"),
  author: import_zod.z.string().min(1, "Autor \xE9 obrigat\xF3rio"),
  subject: import_zod.z.string().min(1, "Assunto \xE9 obrigat\xF3rio")
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  postInputSchema
});
