// src/tests/unit/teacherService.test.ts
import * as TeacherService from "../../services/teacherService";
import * as TeacherRepository from "../../repositories/teacherRepository";
import bcrypt from "bcrypt";

jest.mock("../../repositories/teacherRepository");
jest.mock("bcrypt");

describe("TeacherService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTeacherService", () => {
    it("deve retornar 200 e a lista de professores quando existirem", async () => {
      const mockTeachers = [
        {
          _id: "1",
          nome: "Professor João",
          email: "joao@prof.com",
          cpf: "12345678900",
          disciplina: "Matemática",
        },
        {
          _id: "2",
          nome: "Professora Maria",
          email: "maria@prof.com",
          cpf: "98765432100",
          disciplina: "Física",
        },
      ];

      (TeacherRepository.findAllTeachers as jest.Mock).mockResolvedValue(
        mockTeachers
      );

      const result = await TeacherService.getTeacherService(
        {},
        { page: 1, limit: 10 }
      );

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockTeachers);
      expect(TeacherRepository.findAllTeachers).toHaveBeenCalledWith(
        {},
        { page: 1, limit: 10 }
      );
    });

    it("deve retornar 204 quando não houver professores", async () => {
      (TeacherRepository.findAllTeachers as jest.Mock).mockResolvedValue([]);

      const result = await TeacherService.getTeacherService(
        {},
        { page: 1, limit: 10 }
      );

      expect(result.statusCode).toBe(204);
      expect(result.body).toBeNull();
    });
  });

  describe("createTeacherService", () => {
    it("deve retornar 400 se teacherData for vazio", async () => {
      const result = await TeacherService.createTeacherService({} as any);

      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({ message: "Dados obrigatórios ausentes" });
    });

    it("deve criar professor com sucesso e fazer hash da senha", async () => {
      const mockTeacherData = {
        nome: "Professor João",
        cpf: "12345678900",
        nascimento: "1980-05-15",
        telefone: "11999999999",
        disciplina: "Matemática",
        email: "joao@prof.com",
        matricula: "PROF001",
        senha: "senha123",
      };

      const hashedPassword = "hashed_senha123";
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const mockCreatedTeacher = {
        ...mockTeacherData,
        _id: "teacher123",
        senha: hashedPassword,
      };

      (TeacherRepository.createTeacher as jest.Mock).mockResolvedValue(
        mockCreatedTeacher
      );

      const result = await TeacherService.createTeacherService(mockTeacherData);

      expect(result.statusCode).toBe(201);
      expect(result.body).toEqual(mockCreatedTeacher);
      expect(bcrypt.hash).toHaveBeenCalledWith("senha123", 10);
      expect(TeacherRepository.createTeacher).toHaveBeenCalledWith({
        ...mockTeacherData,
        senha: hashedPassword,
      });
    });
  });

  describe("deleteTeacherService", () => {
    it("deve retornar 200 quando professor for deletado com sucesso", async () => {
      (TeacherRepository.deleteOneTeacher as jest.Mock).mockResolvedValue(true);

      const result = await TeacherService.deleteTeacherService("validId123");

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual({ message: "Deletado com sucesso" });
    });

    it("deve retornar 400 quando professor não for encontrado", async () => {
      (TeacherRepository.deleteOneTeacher as jest.Mock).mockResolvedValue(
        false
      );

      const result = await TeacherService.deleteTeacherService("invalidId");

      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({
        message: "Teacher não encontrado ou ID inválido",
      });
    });
  });

  describe("updateTeacherService", () => {
    it("deve retornar 400 quando não houver dados para atualizar", async () => {
      const result = await TeacherService.updateTeacherService("id123", {});

      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({
        message: "Nenhum dado enviado para atualização",
      });
    });

    it("deve atualizar professor com sucesso", async () => {
      const updateData = { nome: "Professor João Atualizado" };
      const mockUpdatedTeacher = {
        _id: "teacher123",
        nome: "Professor João Atualizado",
        email: "joao@prof.com",
      };

      (TeacherRepository.updateTeacher as jest.Mock).mockResolvedValue(
        mockUpdatedTeacher
      );

      const result = await TeacherService.updateTeacherService(
        "teacher123",
        updateData
      );

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(mockUpdatedTeacher);
      expect(TeacherRepository.updateTeacher).toHaveBeenCalledWith(
        "teacher123",
        updateData
      );
    });

    it("deve retornar 400 quando professor não for encontrado", async () => {
      (TeacherRepository.updateTeacher as jest.Mock).mockResolvedValue(null);

      const result = await TeacherService.updateTeacherService("invalidId", {
        nome: "Teste",
      });

      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({
        message: "Teacher não encontrado ou ID inválido",
      });
    });
  });
});
