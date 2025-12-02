import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Obter __dirname de forma compatível com ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      title: "API Tech Challenger - Posts, Professores e Alunos",
      version: "1.0.0",
      description:
        "API para gerenciamento de posts, professores e alunos com autenticação JWT",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Insira o token JWT no formato: Bearer {token}",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

console.log("🔍 APIs configuradas:", swaggerOptions.apis);

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
