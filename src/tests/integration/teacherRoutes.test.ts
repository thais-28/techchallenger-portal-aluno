// src/tests/integration/teacherRoutes.test.ts
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createMongoMemoryServer } from "../helpers/mongoMemorySetup";
import createApp from "../../app";
import { TeacherModel } from "../../models/teacherModel";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";

describe("Teachers API Integration", () => {
  let mongod: MongoMemoryServer;
  let app: ReturnType<typeof createApp>;
  let teacherToken: string;
  let teacherId: string;

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

    teacherId = teacher._id.toString();
    teacherToken = generateToken({
      id: teacherId,
      email: teacher.email,
      role: "teacher",
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    // Limpar professores mas manter o admin
    await TeacherModel.deleteMany({ _id: { $ne: teacherId } });
  });

  describe("GET /api/teachers", () => {
    it("deve retornar 401 sem token", async () => {
      const res = await request(app).get("/api/teachers");
      expect(res.status).toBe(401);
    });

    it("deve retornar 200 e lista de professores com token válido", async () => {
      const res = await request(app)
        .get("/api/teachers")
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it("deve aplicar paginação corretamente", async () => {
      await TeacherModel.create([
        {
          nome: "Prof 1",
          cpf: "11111111111",
          nascimento: "1980-01-01",
          telefone: "11111111111",
          disciplina: "Física",
          email: "prof1@test.com",
          matricula: "PROF001",
          senha: "senha",
        },
        {
          nome: "Prof 2",
          cpf: "22222222222",
          nascimento: "1981-02-02",
          telefone: "22222222222",
          disciplina: "Química",
          email: "prof2@test.com",
          matricula: "PROF002",
          senha: "senha",
        },
      ]);

      const res = await request(app)
        .get("/api/teachers?page=1&limit=2")
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBeLessThanOrEqual(2);
    });
  });

  describe("POST /api/teachers", () => {
    it("deve retornar 401 sem token", async () => {
      const res = await request(app).post("/api/teachers").send({});
      expect(res.status).toBe(401);
    });

    it("deve criar professor com sucesso", async () => {
      const newTeacher = {
        nome: "Novo Professor",
        cpf: "98765432100",
        nascimento: "1985-03-20",
        telefone: "11888888888",
        disciplina: "História",
        email: "novo@professor.com",
        matricula: "PROF999",
        senha: "senha123",
      };

      const res = await request(app)
        .post("/api/teachers")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(newTeacher);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.nome).toBe(newTeacher.nome);
      expect(res.body.email).toBe(newTeacher.email);
    });

    it("deve retornar 400 para dados inválidos", async () => {
      const res = await request(app)
        .post("/api/teachers")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({ nome: "Incompleto" });

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/teachers/:id", () => {
    let professorId: string;

    beforeEach(async () => {
      const prof = await TeacherModel.create({
        nome: "Professor para Atualizar",
        cpf: "33333333333",
        nascimento: "1982-04-10",
        telefone: "33333333333",
        disciplina: "Geografia",
        email: "atualizar@prof.com",
        matricula: "PROFUP",
        senha: "senha",
      });
      professorId = prof._id.toString();
    });

    it("deve atualizar professor com sucesso", async () => {
      const updateData = {
        nome: "Professor Atualizado",
        cpf: "33333333333",
        nascimento: "1982-04-10",
        telefone: "33333333333",
        disciplina: "Geografia Atualizada",
        email: "atualizar@prof.com",
        matricula: "PROFUP",
        senha: "senha",
      };

      const res = await request(app)
        .put(`/api/teachers/${professorId}`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.disciplina).toBe("Geografia Atualizada");
    });

    it("deve retornar 401 sem token", async () => {
      const res = await request(app)
        .put(`/api/teachers/${professorId}`)
        .send({ nome: "Teste" });

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/teachers/:id", () => {
    let professorId: string;

    beforeEach(async () => {
      const prof = await TeacherModel.create({
        nome: "Professor para Deletar",
        cpf: "44444444444",
        nascimento: "1983-05-15",
        telefone: "44444444444",
        disciplina: "Biologia",
        email: "deletar@prof.com",
        matricula: "PROFDEL",
        senha: "senha",
      });
      professorId = prof._id.toString();
    });

    it("deve deletar professor com sucesso", async () => {
      const res = await request(app)
        .delete(`/api/teachers/${professorId}`)
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");

      const found = await TeacherModel.findById(professorId);
      expect(found).toBeNull();
    });

    it("deve retornar 401 sem token", async () => {
      const res = await request(app).delete(`/api/teachers/${professorId}`);

      expect(res.status).toBe(401);
    });

    it("deve retornar 400 para ID inválido", async () => {
      const res = await request(app)
        .delete("/api/teachers/id-invalido")
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(400);
    });
  });
});
