// src/repositories/postRepository.ts
import { PostModel } from "../models/postModel";
import { Types } from "mongoose";
import { IPostInput } from "../types/post";

export const findAllPosts = async (
  filters: any = {},
  pagination: { page: number; limit: number }
) => {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  const posts = await PostModel.find(filters).skip(skip).limit(limit).lean();

  return posts;
};

export const findPostById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  return await PostModel.findById(id).lean();
};

export const createPost = async (data: IPostInput) => {
  // retorna o Document criado
  const post = await PostModel.create(data);
  return post.toObject();
};

export const deleteOnePost = async (id: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(id)) return false;
  const result = await PostModel.findByIdAndDelete(id);
  return result != null;
};

export const updatePost = async (id: string, data: Partial<IPostInput>) => {
  if (!Types.ObjectId.isValid(id)) return null;
  // { new: true } faz retornar o documento já atualizado
  return await PostModel.findByIdAndUpdate(id, data, { new: true }).lean();
};
