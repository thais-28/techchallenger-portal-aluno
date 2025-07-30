import express, { Request, Response, json } from "express";
import route from "./routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from "cors";

function createApp() {
  const app = express();

  app.use(express.json());
  app.use("/api", route);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(cors());

  return app;
}

export default createApp;
