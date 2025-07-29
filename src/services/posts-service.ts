import { ContentModel } from "../models/content-model";
import * as PostRepository from "../repositories/posts-repository";
import * as HttpResponse from "../utils/http-helper";
import { IPostInput } from "../types/post";

export const getPostService = async () => {
  const posts = await PostRepository.findAllPosts();

  if (posts.length > 0) {
    return HttpResponse.ok(posts);
  }

  return HttpResponse.noContent();
};

export const getPostByIdService = async (id: string) => {
  const post = await PostRepository.findPostById(id);

  if (post) {
    return HttpResponse.ok(post);
  }

  return HttpResponse.noContent();
};

export const createPostService = async (postData: IPostInput) => {
  if (!postData || Object.keys(postData).length === 0) {
    return HttpResponse.badRequest({ message: "Dados obrigatórios ausentes" });
  }

  const createdPost = await PostRepository.createPost(postData);
  return HttpResponse.created(createdPost);
};

export const deletePostService = async (id: string) => {
  const deleted = await PostRepository.deleteOnePost(id);

  if (deleted) {
    return HttpResponse.ok({ message: "Deletado com sucesso" });
  }

  return HttpResponse.badRequest({
    message: "Post não encontrado ou ID inválido",
  });
};

export const updatePostService = async (
  id: string,
  content: Partial<IPostInput>
) => {
  if (!content || Object.keys(content).length === 0) {
    return HttpResponse.badRequest({
      message: "Nenhum dado enviado para atualização",
    });
  }

  const updatedPost = await PostRepository.updatePost(id, content);

  if (!updatedPost) {
    return HttpResponse.badRequest({
      message: "Post não encontrado ou ID inválido",
    });
  }

  return HttpResponse.ok(updatedPost);
};
