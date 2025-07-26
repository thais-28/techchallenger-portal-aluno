import {Request, Response} from 'express';
import * as Service from '../services/posts-service';
import { ContentModel } from '../models/content-model';

export const getPosts = async (req: Request, res: Response) => {
  const httpResponse = await Service.getPostService();
  

  res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const getPostById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const httpResponse = await Service.getPostByIdService(id); // Assuming you want to use the same service for getting a player by ID
  res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const createPost = async (req: Request, res: Response) => {
  const bodyData = req.body;
  const httpResponse = await Service.createPostService(bodyData);

  if (httpResponse) {
    res.status(httpResponse.statusCode).json(httpResponse.body);
  } else {
    return res.status(400).json({ message: 'Invalid player data' });
  }
  
};

export const deletePost = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const httpResponse = await Service.deletePostService(id);
 
  res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const updatePost = async (req: Request, res: Response) =>{
  const id = parseInt(req.params.id);
  const bodyData: ContentModel = req.body;

  const httpResponse = await Service.updatePostService(id, bodyData);

  res.status(httpResponse.statusCode).json(httpResponse.body);

}