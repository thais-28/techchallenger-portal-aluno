import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";
import path from "path";
import fs from "fs";

// Detectar se estamos em ambiente de desenvolvimento ou produção
const isDevelopment = fs.existsSync(path.join(__dirname, "../routes"));
const routesPath = isDevelopment
  ? path.join(__dirname, "../routes")
  : path.join(__dirname, "./routes");

console.log("📂 Ambiente:", isDevelopment ? "Desenvolvimento" : "Produção");
console.log("📂 Diretório routes:", routesPath);

if (fs.existsSync(routesPath)) {
  console.log("✅ Diretório routes existe");
  console.log("📁 Arquivos encontrados:", fs.readdirSync(routesPath));
} else {
  console.log("❌ Diretório routes NÃO existe");
}

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Tech Challenger - Posts e Professores",
      version: "1.0.0",
      description: "API para gerenciamento de posts e professores",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Servidor de desenvolvimento",
      },
    ],
  },
  apis: isDevelopment
    ? [path.join(__dirname, "../routes/**/*.ts")]
    : [path.join(__dirname, "./routes/**/*.js")],
};

console.log("🔍 APIs configuradas:", swaggerOptions.apis);

export const swaggerSpec = swaggerJsdoc(swaggerOptions);