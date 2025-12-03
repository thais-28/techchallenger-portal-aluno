// src/tests/integration/postsRoutes.test.ts
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createMongoMemoryServer } from "../helpers/mongoMemorySetup";
import createApp from "../../app";
import { PostModel } from "../../models/postModel";

describe("Posts API Integration", () => {
  let mongod: MongoMemoryServer;
  let app: ReturnType<typeof createApp>;

  beforeAll(async () => {
    // Inicializa o Mongo em memória
    mongod = await createMongoMemoryServer();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    app = createApp();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    // Limpando qualquer dado entre testes
    await PostModel.deleteMany({});
  });

  describe("GET /api/posts", () => {
    it("deve retornar 204 quando não houver posts", async () => {
      const res = await request(app).get("/api/posts");
      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });
  });

  describe("POST /api/posts", () => {
    const validPayload = {
      title: "Título Teste",
      content: "Conteúdo Teste",
      author: "Autor Teste",
      subject: "Assunto Teste",
    };

    it("deve retornar 400 para payload inválido", async () => {
      const res = await request(app)
        .post("/api/posts")
        .send({ title: "Só título" }); // faltando content, author...
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Dados inválidos");
      expect(res.body).toHaveProperty("errors");
    });

    it("deve criar um post e retornar 201 + objeto criado", async () => {
      const res = await request(app).post("/api/posts").send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(validPayload);
      expect(res.body).toHaveProperty("_id");
    });
  });

  describe("GET /api/posts (após criar)", () => {
    it("deve retornar 200 e lista de posts", async () => {
      // insere um via mongoose diretamente
      await PostModel.create({
        title: "A",
        content: "C",
        author: "X",
        subject: "S",
      });

      const res = await request(app).get("/api/posts");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(1);
    });
  });

  describe("GET /api/posts/:id", () => {
    it("deve retornar 200 e o post correto", async () => {
      const doc = await PostModel.create({
        title: "Doc",
        content: "C",
        author: "Y",
        subject: "Z",
      });

      const res = await request(app).get(`/api/posts/${doc._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        _id: doc._id.toString(),
        title: "Doc",
        content: "C",
        author: "Y",
        subject: "Z",
      });
    });

    it("deve retornar 204 para id válido mas não existente", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/posts/${fakeId}`);
      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });

    it("deve retornar 204 para id inválido", async () => {
      const res = await request(app).get("/api/posts/123-invalido");
      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });
  });

  describe("PATCH /api/posts/:id", () => {
    it("deve retornar 400 se body vazio", async () => {
      const doc = await PostModel.create({
        title: "T",
        content: "C",
        author: "A",
        subject: "S",
      });

      const res = await request(app).patch(`/api/posts/${doc._id}`).send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Nenhum dado enviado para atualização"
      );
    });

    it("deve retornar 400 para id inválido", async () => {
      const res = await request(app)
        .patch("/api/posts/invalid-id")
        .send({ title: "Novo" });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Post não encontrado ou ID inválido"
      );
    });

    it("deve atualizar e retornar 200 + objeto atualizado", async () => {
      const doc = await PostModel.create({
        title: "Antes",
        content: "C",
        author: "A",
        subject: "S",
      });

      const res = await request(app)
        .patch(`/api/posts/${doc._id}`)
        .send({ title: "Depois" });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        _id: doc._id.toString(),
        title: "Depois",
      });
    });
  });

  describe("DELETE /api/posts/:id", () => {
    it("deve retornar 400 para id inválido", async () => {
      const res = await request(app).delete("/api/posts/invalid-id");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Post não encontrado ou ID inválido"
      );
    });

    it("deve deletar e retornar 200 + mensagem", async () => {
      const doc = await PostModel.create({
        title: "Para deletar",
        content: "C",
        author: "A",
        subject: "S",
      });

      const res = await request(app).delete(`/api/posts/${doc._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Deletado com sucesso" });

      // Confirma remoção
      const still = await PostModel.findById(doc._id);
      expect(still).toBeNull();
    });
  });
});
