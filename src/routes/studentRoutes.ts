import { Router } from "express";
import * as StudentController from "../controllers/studentController";

const router = Router();

router.get("/", StudentController.getStudent);
router.post("/", StudentController.createStudent);
router.put("/:id", StudentController.updateStudent);
router.delete("/:id", StudentController.deleteStudent);

export default router;