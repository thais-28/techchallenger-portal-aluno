import { PostModel } from "../models/post-model";
import { ContentModel } from "../models/content-model";
import * as PostRepository from "../repositories/posts-repository";
import * as HttpResponse from "../utils/http-helper";

export const getPostService = async () => {
  const data = await PostRepository.findAllPosts();
  let response = null;

  if(data && data.length > 0) {
    response = await HttpResponse.ok(data);

  }
  else {
    response = await HttpResponse.noContent();
  }

  return response;
};

export const getPostByIdService = async (id: number) => {
  const post = await PostRepository.findPostById(id);
  let response = null;

  if(post) {
    response = await HttpResponse.ok(post);
  } else {
    response = await HttpResponse.noContent();
  }

  return response;
};

export const createPostService = async (postData: PostModel) => {
  let response = null;

  if (Object.keys(postData).length > 0) {
    
    await PostRepository.createPost(postData);
    response = await HttpResponse.created();
    
  } else{
    response = await HttpResponse.badRequest();
  }

  return response;
};

export const deletePostService = async (id: number) => {
  
  let response = null;
  const isDeleted = await PostRepository.deleteOnePost(id);

  if (isDeleted){
    response = await HttpResponse.ok({message: "Deletado com sucesso"});
  } else {
    response = await HttpResponse.badRequest();
  }
  return response;
 
};

export const updatePostService = async (id: number, content: ContentModel) => {
  let response = null
  const data = await PostRepository.findAndModifyPost(id, content);

  if (Object.keys(data).length === 0){
     response = await HttpResponse.badRequest();
  } else {
    response = await HttpResponse.ok(data);
  } 
   
  return response;
}