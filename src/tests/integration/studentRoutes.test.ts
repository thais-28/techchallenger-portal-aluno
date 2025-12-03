// src/tests/integration/studentRoutes.test.ts
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createMongoMemoryServer } from "../helpers/mongoMemorySetup";
import createApp from "../../app";
import { TeacherModel } from "../../models/teacherModel";
import { StudentModel } from "../../models/studentModel";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";

describe("Students API Integration", () => {
  let mongod: MongoMemoryServer;
  let app: ReturnType<typeof createApp>;
  let teacherToken: string;
  let studentToken: string;

  beforeAll(async () => {
    mongod = await createMongoMemoryServer();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    app = createApp();

    // Criar professor para autenticação
    const hashedPassword = await bcrypt.hash("senha123", 10);
    const teacher = await TeacherModel.create({
      nome: "Professor Admin",
      cpf: "12345678900",
      nascimento: "1980-05-15",
      telefone: "11999999999",
      disciplina: "Matemática",
      email: "admin@professor.com",
      matricula: "PROFADM",
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

    teacherToken = generateToken({
      id: teacher._id.toString(),
      email: teacher.email,
      role: "teacher",
    });

    studentToken = generateToken({
      id: student._id.toString(),
      email: student.email,
      role: "student",
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    // Limpar alunos mas manter o de teste
    const testStudent = await StudentModel.findOne({ email: "aluno@test.com" });
    if (testStudent) {
      await StudentModel.deleteMany({ _id: { $ne: testStudent._id } });
    }
  });

  describe("GET /api/students", () => {
    it("deve retornar 401 sem token", async () => {
      const res = await request(app).get("/api/students");
      expect(res.status).toBe(401);
    });

    it("deve retornar 403 com token de aluno", async () => {
      const res = await request(app)
        .get("/api/students")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });

    it("deve retornar 200 e lista de alunos com token de professor", async () => {
      const res = await request(app)
        .get("/api/students")
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("deve aplicar paginação corretamente", async () => {
      await StudentModel.create([
        {
          nome: "Aluno 1",
          cpf: "11111111111",
          nascimento: "2005-01-01",
          telefone: "11111111111",
          turma: "1A",
          email: "aluno1@test.com",
          matricula: "ALU101",
          senha: "senha",
        },
        {
          nome: "Aluno 2",
          cpf: "22222222222",
          nascimento: "2006-02-02",
          telefone: "22222222222",
          turma: "2B",
          email: "aluno2@test.com",
          matricula: "ALU102",
          senha: "senha",
        },
      ]);

      const res = await request(app)
        .get("/api/students?page=1&limit=2")
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBeLessThanOrEqual(2);
    });
  });

  describe("POST /api/students", () => {
    it("deve retornar 401 sem token", async () => {
      const res = await request(app).post("/api/students").send({});
      expect(res.status).toBe(401);
    });

    it("deve retornar 403 com token de aluno", async () => {
      const newStudent = {
        nome: "Novo Aluno",
        cpf: "55555555555",
        nascimento: "2006-09-10",
        telefone: "11555555555",
        turma: "2C",
        email: "novo@aluno.com",
        matricula: "ALU555",
        senha: "senha123",
      };

      const res = await request(app)
        .post("/api/students")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(newStudent);

      expect(res.status).toBe(403);
    });

    it("deve criar aluno com sucesso com token de professor", async () => {
      const newStudent = {
        nome: "Novo Aluno",
        cpf: "55555555555",
        nascimento: "2006-09-10",
        telefone: "11555555555",
        turma: "2C",
        email: "novo@aluno.com",
        matricula: "ALU555",
        senha: "senha123",
      };

      const res = await request(app)
        .post("/api/students")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(newStudent);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.nome).toBe(newStudent.nome);
      expect(res.body.email).toBe(newStudent.email);
    });

    it("deve retornar 400 para dados inválidos", async () => {
      const res = await request(app)
        .post("/api/students")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({ nome: "Incompleto" });

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/students/:id", () => {
    let studentId: string;

    beforeEach(async () => {
      const aluno = await StudentModel.create({
        nome: "Aluno para Atualizar",
        cpf: "33333333333",
        nascimento: "2006-04-10",
        telefone: "33333333333",
        turma: "3D",
        email: "atualizar@aluno.com",
        matricula: "ALUUP",
        senha: "senha",
      });
      studentId = aluno._id.toString();
    });

    it("deve retornar 403 com token de aluno", async () => {
      const res = await request(app)
        .put(`/api/students/${studentId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ nome: "Tentativa" });

      expect(res.status).toBe(403);
    });

    it("deve atualizar aluno com sucesso com token de professor", async () => {
      const updateData = {
        nome: "Aluno Atualizado",
        cpf: "33333333333",
        nascimento: "2006-04-10",
        telefone: "33333333333",
        turma: "3E",
        email: "atualizar@aluno.com",
        matricula: "ALUUP",
        senha: "senha",
      };

      const res = await request(app)
        .put(`/api/students/${studentId}`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.turma).toBe("3E");
    });

    it("deve retornar 401 sem token", async () => {
      const res = await request(app)
        .put(`/api/students/${studentId}`)
        .send({ nome: "Teste" });

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/students/:id", () => {
    let studentId: string;

    beforeEach(async () => {
      const aluno = await StudentModel.create({
        nome: "Aluno para Deletar",
        cpf: "44444444444",
        nascimento: "2007-05-15",
        telefone: "44444444444",
        turma: "4F",
        email: "deletar@aluno.com",
        matricula: "ALUDEL",
        senha: "senha",
      });
      studentId = aluno._id.toString();
    });

    it("deve retornar 403 com token de aluno", async () => {
      const res = await request(app)
        .delete(`/api/students/${studentId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });

    it("deve deletar aluno com sucesso com token de professor", async () => {
      const res = await request(app)
        .delete(`/api/students/${studentId}`)
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");

      const found = await StudentModel.findById(studentId);
      expect(found).toBeNull();
    });

    it("deve retornar 401 sem token", async () => {
      const res = await request(app).delete(`/api/students/${studentId}`);

      expect(res.status).toBe(401);
    });

    it("deve retornar 400 para ID inválido", async () => {
      const res = await request(app)
        .delete("/api/students/id-invalido")
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(400);
    });
  });
});
