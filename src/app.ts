import express, { Request, Response, json } from "express";
import route from "./routes/routes";
import cors from "cors";

function createApp() {
  const app = express();

  app.use(express.json());

  app.use("/api", route);

  app.use(cors());

  return app;
}

export default createApp;
