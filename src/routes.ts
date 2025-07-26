import { Router } from "express";
import * as PostController from "./controllers/post-controller";

const router = Router();

router.get("/posts", PostController.getPosts);
router.get("/posts/:id", PostController.getPostById); // Assuming you want to use the same controller for getting a player by ID
router.post("/posts", PostController.createPost);
router.delete("/posts/:id", PostController.deletePost);
router.patch("/posts/:id", PostController.updatePost);

export default router;