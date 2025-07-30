// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Posts",
      version: "1.0.0",
      description: "Documentação gerada automaticamente com Swagger JSDoc",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // arquivos onde estão os JSDoc das rotas
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
