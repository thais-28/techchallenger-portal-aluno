// src/tests/unit/teacherController.test.ts
import { Request, Response } from "express";
import * as TeacherService from "../../services/teacherService";

// Mock do service
jest.mock("../../services/teacherService");

// Mock do validator - deve ser definido antes de importar o controller
const mockInputSafeParse = jest.fn();
const mockUpdateSafeParse = jest.fn();
jest.mock("../../validations/teacherValidator", () => ({
  teacherInputSchema: {
    safeParse: mockInputSafeParse,
  },
  teacherUpdateSchema: {
    safeParse: mockUpdateSafeParse,
  },
}));

// Importar após os mocks
import * as TeacherController from "../../controllers/teacherController";

describe("TeacherController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();

    req = {
      query: {},
      params: {},
      body: {},
    };

    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe("getTeacher", () => {
    it("deve retornar professores com status 200", async () => {
      const mockResponse = {
        statusCode: 200,
        body: [{ nome: "Professor João" }],
      };

      (TeacherService.getTeacherService as jest.Mock).mockResolvedValue(
        mockResponse
      );

      req.query = { page: "1", limit: "10" };

      await TeacherController.getTeacher(req as Request, res as Response);

      expect(TeacherService.getTeacherService).toHaveBeenCalledWith(
        {},
        { page: 1, limit: 10 }
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockResponse.body);
    });

    it("deve aplicar filtros quando fornecidos", async () => {
      const mockResponse = {
        statusCode: 200,
        body: [{ nome: "Professor João", disciplina: "Matemática" }],
      };

      (TeacherService.getTeacherService as jest.Mock).mockResolvedValue(
        mockResponse
      );

      req.query = { page: "1", limit: "10", disciplina: "Matemática" };

      await TeacherController.getTeacher(req as Request, res as Response);

      expect(TeacherService.getTeacherService).toHaveBeenCalledWith(
        { disciplina: "Matemática" },
        { page: 1, limit: 10 }
      );
    });
  });

  describe("createTeacher", () => {
    it("deve retornar 400 para dados inválidos", async () => {
      mockInputSafeParse.mockReturnValue({
        success: false,
        error: {
          flatten: () => ({
            fieldErrors: { nome: ["Nome obrigatório"] },
          }),
        },
      });

      await TeacherController.createTeacher(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Dados inválidos",
        errors: { nome: ["Nome obrigatório"] },
      });
    });

    it("deve criar professor com sucesso", async () => {
      const mockTeacher = {
        nome: "Professor João",
        email: "joao@prof.com",
        cpf: "12345678900",
      };

      mockInputSafeParse.mockReturnValue({
        success: true,
        data: mockTeacher,
      });

      const mockResponse = {
        statusCode: 201,
        body: { _id: "123", ...mockTeacher },
      };

      (TeacherService.createTeacherService as jest.Mock).mockResolvedValue(
        mockResponse
      );

      req.body = mockTeacher;

      await TeacherController.createTeacher(req as Request, res as Response);

      expect(TeacherService.createTeacherService).toHaveBeenCalledWith(
        mockTeacher
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockResponse.body);
    });
  });

  describe("deleteTeacher", () => {
    it("deve deletar professor com sucesso", async () => {
      const mockResponse = {
        statusCode: 200,
        body: { message: "Deletado com sucesso" },
      };

      (TeacherService.deleteTeacherService as jest.Mock).mockResolvedValue(
        mockResponse
      );

      req.params = { id: "teacher123" };

      await TeacherController.deleteTeacher(req as Request, res as Response);

      expect(TeacherService.deleteTeacherService).toHaveBeenCalledWith(
        "teacher123"
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockResponse.body);
    });
  });

  describe("updateTeacher", () => {
    it("deve retornar 400 para dados inválidos", async () => {
      mockUpdateSafeParse.mockReturnValue({
        success: false,
        error: {
          flatten: () => ({
            fieldErrors: { email: ["Email inválido"] },
          }),
        },
      });

      req.params = { id: "teacher123" };

      await TeacherController.updateTeacher(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it("deve atualizar professor com sucesso", async () => {
      const updateData = { nome: "Professor Atualizado" };

      mockUpdateSafeParse.mockReturnValue({
        success: true,
        data: updateData,
      });

      const mockResponse = {
        statusCode: 200,
        body: { _id: "teacher123", ...updateData },
      };

      (TeacherService.updateTeacherService as jest.Mock).mockResolvedValue(
        mockResponse
      );

      req.params = { id: "teacher123" };
      req.body = updateData;

      await TeacherController.updateTeacher(req as Request, res as Response);

      expect(TeacherService.updateTeacherService).toHaveBeenCalledWith(
        "teacher123",
        updateData
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockResponse.body);
    });
  });
});
