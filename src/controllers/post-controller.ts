import { Request, Response } from "express";
import * as Service from "../services/posts-service";
import { ContentModel } from "../models/content-model";
import { postInputSchema } from "../validations/postValidation";

export const getPosts = async (req: Request, res: Response) => {
  const httpResponse = await Service.getPostService();

  res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const getPostById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const httpResponse = await Service.getPostByIdService(id);
  res.status(httpResponse.statusCode).json(httpResponse.body);
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
  const created = await Service.createPostService(postData);

  return res.status(201).json(created);
};

export const deletePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const httpResponse = await Service.deletePostService(id);

  res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const updatePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const bodyData: ContentModel = req.body;

  const httpResponse = await Service.updatePostService(id, bodyData);

  res.status(httpResponse.statusCode).json(httpResponse.body);
};
