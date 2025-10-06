import express, { Request, Response, json } from "express";
import route from "./routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from "cors";

function createApp() {
  const app = express();

  // CORS deve vir antes das rotas
  app.use(
    cors({
      origin: "http://localhost:3000", // Permite requisições do frontend
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());
  app.use("/api", route);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return app;
}

export default createApp;
