import { Request, Response } from "express";
import * as Service from "../services/teacherService";
import { teacherInputSchema } from "../validations/teacherValidator";
import { ITeacher } from "../types/teacher";


export const getTeacher = async (req: Request, res: Response) => {
  const { page = "1", limit = "10", nome, email, matricula, disciplina } = req.query;

  const filters = {
    ...(nome && { nome }),
    ...(email && { email }),
    ...(matricula && { matricula }),
    ...(disciplina && { disciplina }),
  };

  const pagination = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
  };

  const httpResponse = await Service.getTeacherService(filters, pagination);
  if (httpResponse.statusCode === 204) {
    return res.sendStatus(204);
  }
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};


export const createTeacher = async (req: Request, res: Response) => {
  const parseResult = teacherInputSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  const postData = parseResult.data;
  const createdResponse = await Service.createTeacherService(postData);
  // Desempacota body para retornar apenas o objeto criado
  return res.status(createdResponse.statusCode).json(createdResponse.body);
};

export const deleteTeacher = async (req: Request, res: Response) => {
  const id = req.params.id;
  const httpResponse = await Service.deleteTeacherService(id);
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const updateTeacher = async (req: Request, res: Response) => {
  const id = req.params.id;
  const bodyData: Partial<ITeacher> = req.body;
  const httpResponse = await Service.updateTeacherService(id, bodyData);
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};
