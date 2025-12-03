// src/tests/unit/authMiddleware.test.ts
import { Request, Response, NextFunction } from "express";
import {
  authMiddleware,
  teacherOnly,
  AuthRequest,
} from "../../middlewares/auth";
import * as jwt from "../../utils/jwt";

jest.mock("../../utils/jwt");

describe("Auth Middleware", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();

    req = {
      headers: {},
    };

    res = {
      status: statusMock,
      json: jsonMock,
    };

    next = jest.fn();
  });

  describe("authMiddleware", () => {
    it("deve retornar 401 se não houver header authorization", () => {
      authMiddleware(req as AuthRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Token não fornecido",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("deve retornar 401 se header authorization estiver vazio", () => {
      req.headers = { authorization: "" };

      authMiddleware(req as AuthRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Token não fornecido",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("deve retornar 401 para token inválido", () => {
      req.headers = { authorization: "Bearer token-invalido" };
      (jwt.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      authMiddleware(req as AuthRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Token inválido" });
      expect(next).not.toHaveBeenCalled();
    });

    it("deve retornar 401 para token expirado", () => {
      req.headers = { authorization: "Bearer expired-token" };
      (jwt.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error("Token expired");
      });

      authMiddleware(req as AuthRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Token inválido" });
      expect(next).not.toHaveBeenCalled();
    });

    it("deve adicionar user ao request e chamar next() para token válido de professor", () => {
      const mockPayload = {
        id: "teacher123",
        email: "prof@test.com",
        role: "teacher" as const,
      };

      req.headers = { authorization: "Bearer valid-token" };
      (jwt.verifyToken as jest.Mock).mockReturnValue(mockPayload);

      authMiddleware(req as AuthRequest, res as Response, next);

      expect(req.user).toEqual(mockPayload);
      expect(jwt.verifyToken).toHaveBeenCalledWith("valid-token");
      expect(next).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it("deve adicionar user ao request e chamar next() para token válido de aluno", () => {
      const mockPayload = {
        id: "student123",
        email: "aluno@test.com",
        role: "student" as const,
      };

      req.headers = { authorization: "Bearer student-token" };
      (jwt.verifyToken as jest.Mock).mockReturnValue(mockPayload);

      authMiddleware(req as AuthRequest, res as Response, next);

      expect(req.user).toEqual(mockPayload);
      expect(req.user?.role).toBe("student");
      expect(next).toHaveBeenCalled();
    });

    it("deve funcionar com Bearer maiúsculo ou minúsculo", () => {
      const mockPayload = {
        id: "123",
        email: "test@test.com",
        role: "teacher" as const,
      };

      req.headers = { authorization: "bearer lowercase-token" };
      (jwt.verifyToken as jest.Mock).mockReturnValue(mockPayload);

      authMiddleware(req as AuthRequest, res as Response, next);

      expect(jwt.verifyToken).toHaveBeenCalledWith("lowercase-token");
      expect(next).toHaveBeenCalled();
    });
  });

  describe("teacherOnly", () => {
    it("deve retornar 403 se o usuário não for professor (aluno)", () => {
      req.user = {
        id: "student123",
        email: "aluno@test.com",
        role: "student",
      };

      teacherOnly(req as AuthRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Acesso negado: apenas professores",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("deve retornar 403 se user não existir no request", () => {
      req.user = undefined;

      teacherOnly(req as AuthRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Acesso negado: apenas professores",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("deve chamar next() se o usuário for professor", () => {
      req.user = {
        id: "teacher123",
        email: "prof@test.com",
        role: "teacher",
      };

      teacherOnly(req as AuthRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });

    it("deve permitir apenas role exatamente igual a 'teacher'", () => {
      req.user = {
        id: "123",
        email: "test@test.com",
        role: "Teacher" as any, // Caso diferente
      };

      teacherOnly(req as AuthRequest, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("Integração authMiddleware + teacherOnly", () => {
    it("deve funcionar em cadeia: autenticação e verificação de role", () => {
      const mockPayload = {
        id: "teacher123",
        email: "prof@test.com",
        role: "teacher" as const,
      };

      req.headers = { authorization: "Bearer valid-token" };
      (jwt.verifyToken as jest.Mock).mockReturnValue(mockPayload);

      // Primeiro middleware: autenticação
      authMiddleware(req as AuthRequest, res as Response, next);
      expect(next).toHaveBeenCalledTimes(1);

      // Segundo middleware: verificação de role
      teacherOnly(req as AuthRequest, res as Response, next);
      expect(next).toHaveBeenCalledTimes(2);
    });
  });
});
