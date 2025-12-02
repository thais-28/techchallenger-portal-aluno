import { Router } from "express";
import * as StudentController from "../controllers/studentController";
import { authMiddleware, teacherOnly } from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, teacherOnly, StudentController.getStudent);
router.post("/", authMiddleware, teacherOnly, StudentController.createStudent);
router.put(
  "/:id",
  authMiddleware,
  teacherOnly,
  StudentController.updateStudent
);
router.delete(
  "/:id",
  authMiddleware,
  teacherOnly,
  StudentController.deleteStudent
);

export default router;
