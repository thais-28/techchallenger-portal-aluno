import { Request, Response } from "express";
import * as Service from "../services/studentService";
import { studentInputSchema } from "../validations/studentValidator";
import { IStudent } from "../types/student";

export const getStudent = async (req: Request, res: Response) => {
  const { page = "1", limit = "10", nome, email, matricula, turma } = req.query;

  const filters = {
    ...(nome && { nome }),
    ...(email && { email }),
    ...(matricula && { matricula }),
    ...(turma && { turma }),
  };

  const pagination = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
  };

  const httpResponse = await Service.getStudentService(filters, pagination);
  if (httpResponse.statusCode === 204) {
    return res.sendStatus(204);
  }
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const createStudent = async (req: Request, res: Response) => {
  const parseResult = studentInputSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  const postData = parseResult.data;
  const createdResponse = await Service.createStudentService(postData);
  return res.status(createdResponse.statusCode).json(createdResponse.body);
};

export const deleteStudent = async (req: Request, res: Response) => {
  const id = req.params.id;
  const httpResponse = await Service.deleteStudentService(id);
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const updateStudent = async (req: Request, res: Response) => {
  const id = req.params.id;
  const bodyData: Partial<IStudent> = req.body;
  const httpResponse = await Service.updateStudentService(id, bodyData);
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};