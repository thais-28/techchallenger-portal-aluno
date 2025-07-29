import { Router } from "express";
import * as PostController from "./controllers/post-controller";

const router = Router();

router.get("/posts", PostController.getPosts);
router.get("/posts/:id", PostController.getPostById);
router.post("/posts", PostController.createPost);
router.delete("/posts/:id", PostController.deletePost);
router.patch("/posts/:id", PostController.updatePost);

export default router;
