import { Request, Response } from "express";
import * as Service from "../services/postsService";
import { ContentModel } from "../models/content-model";
import { postInputSchema } from "../validations/postValidation";

export const getPosts = async (req: Request, res: Response) => {
  const { page = "1", limit = "10", author, subject } = req.query;

  const filters = {
    ...(author && { author }),
    ...(subject && { subject }),
  };

  const pagination = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
  };

  const httpResponse = await Service.getPostService(filters, pagination);
  if (httpResponse.statusCode === 204) {
    return res.sendStatus(204);
  }
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const getPostById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const httpResponse = await Service.getPostByIdService(id);
  if (httpResponse.statusCode === 204) {
    return res.sendStatus(204);
  }
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const createPost = async (req: Request, res: Response) => {
  const parseResult = postInputSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  const postData = parseResult.data;
  const createdResponse = await Service.createPostService(postData);
  // Desempacota body para retornar apenas o objeto criado
  return res.status(createdResponse.statusCode).json(createdResponse.body);
};

export const deletePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const httpResponse = await Service.deletePostService(id);
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const updatePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const bodyData: ContentModel = req.body;
  const httpResponse = await Service.updatePostService(id, bodyData);
  return res.status(httpResponse.statusCode).json(httpResponse.body);
};
