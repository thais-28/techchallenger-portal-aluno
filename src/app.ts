import express, { Request, Response } from "express";
import route from "./routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from "cors";

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());
  
  // Rota raiz para teste
  app.get("/", (req: Request, res: Response) => {
    res.json({ 
      message: "API funcionando!", 
      routes: ["/api/posts", "/api/teachers"],
      swagger: "/api-docs"
    });
  });
  
  // Registrar rotas da API
  app.use("/api", route);
  
  // Registrar Swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Rota 404 para endpoints não encontrados
  app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Rota não encontrada" });
  });

  return app;
}

export default createApp;