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

// src/config/mongodb.ts
var mongodb_exports = {};
__export(mongodb_exports, {
  default: () => mongodb_default
});
module.exports = __toCommonJS(mongodb_exports);
var import_mongoose2 = __toESM(require("mongoose"));

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

// src/config/mongodb.ts
async function initDB() {
  const uri = `mongodb://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.DATABASE}?authSource=admin`;
  import_mongoose2.default.connect(uri).then(async () => {
    console.log("MongoDB conectado.");
    await PostModel.init();
    console.log("Cole\xE7\xE3o 'posts' pronta para uso!.");
  }).catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });
  return import_mongoose2.default.connection;
}
var mongodb_default = initDB;
