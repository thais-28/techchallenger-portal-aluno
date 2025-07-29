import mongoose, { mongo } from "mongoose";
import { env } from "./env";
import { PostModel } from "../models/post";

async function initDB() {
  const uri = `mongodb://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.DATABASE}?authSource=admin`;

  mongoose
    .connect(uri)
    .then(async () => {
      console.log("MongoDB conectado.");

      // Garante que a coleção exista
      await PostModel.init();
      console.log("Coleção 'posts' pronta para uso!.");
    })
    .catch((err) => {
      console.error("Erro ao conectar ao MongoDB:", err);
    });

  return mongoose.connection;
}

export default initDB;
