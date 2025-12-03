// src/tests/unit/authService.test.ts
import bcrypt from "bcrypt";
import * as AuthService from "../../services/authService";
import { TeacherModel } from "../../models/teacherModel";
import { StudentModel } from "../../models/studentModel";
import { generateToken } from "../../utils/jwt";

jest.mock("../../models/teacherModel");
jest.mock("../../models/studentModel");
jest.mock("../../utils/jwt");
jest.mock("bcrypt");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loginService", () => {
    it("deve fazer login com sucesso como professor", async () => {
      const mockTeacher = {
        _id: "teacher123",
        nome: "Professor João",
        email: "joao@professor.com",
        senha: "hashedPassword",
      };

      (TeacherModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockTeacher),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue("fake-token-123");

      const result = await AuthService.loginService(
        "joao@professor.com",
        "senha123"
      );

      expect(result.statusCode).toBe(200);
      expect(result.body).toHaveProperty("token", "fake-token-123");
      expect(result.body.user).toMatchObject({
        id: "teacher123",
        email: "joao@professor.com",
        role: "teacher",
      });
      expect(TeacherModel.findOne).toHaveBeenCalledWith({
        email: "joao@professor.com",
      });
      expect(bcrypt.compare).toHaveBeenCalledWith("senha123", "hashedPassword");
      expect(generateToken).toHaveBeenCalledWith({
        id: "teacher123",
        email: "joao@professor.com",
        role: "teacher",
      });
    });

    it("deve fazer login com sucesso como aluno", async () => {
      const mockStudent = {
        _id: "student123",
        nome: "Maria Aluna",
        email: "maria@aluno.com",
        senha: "hashedPassword",
      };

      (TeacherModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });
      (StudentModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockStudent),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue("fake-student-token");

      const result = await AuthService.loginService(
        "maria@aluno.com",
        "senha123"
      );

      expect(result.statusCode).toBe(200);
      expect(result.body).toHaveProperty("token", "fake-student-token");
      expect(result.body.user.role).toBe("student");
      expect(result.body.user.email).toBe("maria@aluno.com");
      expect(TeacherModel.findOne).toHaveBeenCalledWith({
        email: "maria@aluno.com",
      });
      expect(StudentModel.findOne).toHaveBeenCalledWith({
        email: "maria@aluno.com",
      });
    });

    it("deve retornar 400 para credenciais inválidas - email não existe", async () => {
      (TeacherModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });
      (StudentModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      const result = await AuthService.loginService(
        "naoexiste@email.com",
        "senha123"
      );

      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({ message: "Credenciais inválidas" });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
    });

    it("deve retornar 400 para senha incorreta", async () => {
      const mockTeacher = {
        _id: "teacher123",
        nome: "Professor João",
        email: "joao@professor.com",
        senha: "hashedPassword",
      };

      (TeacherModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockTeacher),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await AuthService.loginService(
        "joao@professor.com",
        "senhaErrada"
      );

      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual({ message: "Credenciais inválidas" });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "senhaErrada",
        "hashedPassword"
      );
      expect(generateToken).not.toHaveBeenCalled();
    });

    it("deve priorizar professor sobre aluno quando email existe em ambos", async () => {
      const mockTeacher = {
        _id: "teacher123",
        nome: "Professor João",
        email: "duplicado@email.com",
        senha: "hashedPassword",
      };

      (TeacherModel.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockTeacher),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue("teacher-token");

      const result = await AuthService.loginService(
        "duplicado@email.com",
        "senha123"
      );

      expect(result.body.user.role).toBe("teacher");
      expect(StudentModel.findOne).not.toHaveBeenCalled();
    });
  });
});
