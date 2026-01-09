import express, { Request, Response } from "express";
import route from "./routes";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3333",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.json({
      message: "API funcionando!",
      routes: ["/api/posts", "/api/teachers", "/api/students", "/api/auth"],
      swagger: "/api-docs",
    });
  });

  app.use("/api", route);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Rota não encontrada" });
  });

  return app;
}

export default createApp;
