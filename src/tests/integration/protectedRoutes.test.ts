// src/tests/integration/protectedRoutes.test.ts
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createMongoMemoryServer } from "../helpers/mongoMemorySetup";
import createApp from "../../app";
import { TeacherModel } from "../../models/teacherModel";
import { StudentModel } from "../../models/studentModel";
import { PostModel } from "../../models/postModel";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";

describe("Protected Routes", () => {
  let mongod: MongoMemoryServer;
  let app: ReturnType<typeof createApp>;
  let teacherToken: string;
  let studentToken: string;
  let teacherId: string;
  let studentId: string;

  beforeAll(async () => {
    mongod = await createMongoMemoryServer();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    app = createApp();

    // Criar professor e aluno para os testes
    const hashedPassword = await bcrypt.hash("senha123", 10);

    const teacher = await TeacherModel.create({
      nome: "Professor Teste",
      cpf: "12345678900",
      nascimento: "1980-05-15",
      telefone: "11999999999",
      disciplina: "Matemática",
      email: "prof@test.com",
      matricula: "PROF001",
      senha: hashedPassword,
    });

    const student = await StudentModel.create({
      nome: "Aluno Teste",
      cpf: "98765432100",
      nascimento: "2005-08-20",
      telefone: "11888888888",
      turma: "3A",
      email: "aluno@test.com",
      matricula: "ALU001",
      senha: hashedPassword,
    });

    teacherId = teacher._id.toString();
    studentId = student._id.toString();

    teacherToken = generateToken({
      id: teacherId,
      email: teacher.email,
      role: "teacher",
    });

    studentToken = generateToken({
      id: studentId,
      email: student.email,
      role: "student",
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    await PostModel.deleteMany({});
  });

  describe("POST /api/posts (criar post)", () => {
    const postData = {
      title: "Post Teste",
      content: "Conteúdo do post de teste",
      author: "Autor Teste",
      subject: "Matemática",
    };

    it("deve permitir professor criar post", async () => {
      const res = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(postData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.title).toBe(postData.title);
    });

    it("deve bloquear aluno de criar post (403)", async () => {
      const res = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(postData);

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        message: "Acesso negado: apenas professores",
      });
    });

    it("deve retornar 401 sem token", async () => {
      const res = await request(app).post("/api/posts").send(postData);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Token não fornecido");
    });

    it("deve retornar 401 com token inválido", async () => {
      const res = await request(app)
        .post("/api/posts")
        .set("Authorization", "Bearer token-invalido-123")
        .send(postData);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Token inválido");
    });
  });

  describe("PATCH /api/posts/:id (atualizar post)", () => {
    let postId: string;

    beforeEach(async () => {
      const post = await PostModel.create({
        title: "Post Original",
        content: "Conteúdo original",
        author: "Autor",
        subject: "Matemática",
      });
      postId = post._id.toString();
    });

    it("deve permitir professor atualizar post", async () => {
      const res = await request(app)
        .patch(`/api/posts/${postId}`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({ title: "Título Atualizado" });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Título Atualizado");
    });

    it("deve bloquear aluno de atualizar post", async () => {
      const res = await request(app)
        .patch(`/api/posts/${postId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ title: "Tentativa de Atualização" });

      expect(res.status).toBe(403);
    });

    it("deve retornar 401 sem token", async () => {
      const res = await request(app)
        .patch(`/api/posts/${postId}`)
        .send({ title: "Atualização" });

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/posts/:id (deletar post)", () => {
    let postId: string;

    beforeEach(async () => {
      const post = await PostModel.create({
        title: "Post para Deletar",
        content: "Conteúdo",
        author: "Autor",
        subject: "Matemática",
      });
      postId = post._id.toString();
    });

    it("deve permitir professor deletar post", async () => {
      const res = await request(app)
        .delete(`/api/posts/${postId}`)
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
    });

    it("deve bloquear aluno de deletar post", async () => {
      const res = await request(app)
        .delete(`/api/posts/${postId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });

    it("deve retornar 401 sem token", async () => {
      const res = await request(app).delete(`/api/posts/${postId}`);

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/posts (listar posts - rota pública)", () => {
    beforeEach(async () => {
      await PostModel.create({
        title: "Post Público",
        content: "Conteúdo público",
        author: "Autor",
        subject: "Matemática",
      });
    });

    it("deve permitir professor ver posts", async () => {
      const res = await request(app)
        .get("/api/posts")
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("deve permitir aluno ver posts", async () => {
      const res = await request(app)
        .get("/api/posts")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("deve permitir acesso público (sem token)", async () => {
      const res = await request(app).get("/api/posts");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/teachers (rotas de professores protegidas)", () => {
    it("deve permitir professor acessar lista de professores", async () => {
      const res = await request(app)
        .get("/api/teachers")
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
    });

    it("deve bloquear aluno de acessar lista de professores", async () => {
      const res = await request(app)
        .get("/api/teachers")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });

    it("deve retornar 401 sem token", async () => {
      const res = await request(app).get("/api/teachers");

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/students (rotas de alunos protegidas)", () => {
    it("deve permitir professor acessar lista de alunos", async () => {
      const res = await request(app)
        .get("/api/students")
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
    });

    it("deve bloquear aluno de acessar lista de alunos", async () => {
      const res = await request(app)
        .get("/api/students")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });

    it("deve retornar 401 sem token", async () => {
      const res = await request(app).get("/api/students");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/teachers (criar professor)", () => {
    const newTeacherData = {
      nome: "Novo Professor",
      cpf: "11122233344",
      nascimento: "1985-03-20",
      telefone: "11777777777",
      disciplina: "Física",
      email: "novo@professor.com",
      matricula: "PROF999",
      senha: "senha123",
    };

    it("deve permitir professor criar outro professor", async () => {
      const res = await request(app)
        .post("/api/teachers")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(newTeacherData);

      expect(res.status).toBe(201);
    });

    it("deve bloquear aluno de criar professor", async () => {
      const res = await request(app)
        .post("/api/teachers")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(newTeacherData);

      expect(res.status).toBe(403);
    });
  });

  describe("POST /api/students (criar aluno)", () => {
    const newStudentData = {
      nome: "Novo Aluno",
      cpf: "55566677788",
      nascimento: "2006-09-10",
      telefone: "11666666666",
      turma: "2B",
      email: "novo@aluno.com",
      matricula: "ALU999",
      senha: "senha123",
    };

    it("deve permitir professor criar aluno", async () => {
      const res = await request(app)
        .post("/api/students")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(newStudentData);

      expect(res.status).toBe(201);
    });

    it("deve bloquear aluno de criar outro aluno", async () => {
      const res = await request(app)
        .post("/api/students")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(newStudentData);

      expect(res.status).toBe(403);
    });
  });
});
