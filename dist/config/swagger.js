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

// src/config/swagger.ts
var swagger_exports = {};
__export(swagger_exports, {
  swaggerOptions: () => swaggerOptions,
  swaggerSpec: () => swaggerSpec
});
module.exports = __toCommonJS(swagger_exports);
var import_swagger_jsdoc = __toESM(require("swagger-jsdoc"));

// src/config/env.ts
var import_config = require("dotenv/config");
var import_zod = __toESM(require("zod"));
var envSchema = import_zod.default.object({
  PORT: import_zod.default.coerce.number().default(3e3),
  MONGO_USER: import_zod.default.string(),
  MONGO_PASSWORD: import_zod.default.string(),
  MONGO_PORT: import_zod.default.coerce.number().default(27017),
  DATABASE: import_zod.default.string().default("mongodb"),
  MONGO_HOST: import_zod.default.string().default("localhost")
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/config/swagger.ts
var swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Posts",
      version: "1.0.0",
      description: "Documenta\xE7\xE3o gerada automaticamente com Swagger JSDoc"
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`
      }
    ]
  },
  apis: ["./src/routes/*.ts"]
  // arquivos onde estão os JSDoc das rotas
};
var swaggerSpec = (0, import_swagger_jsdoc.default)(swaggerOptions);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  swaggerOptions,
  swaggerSpec
});
