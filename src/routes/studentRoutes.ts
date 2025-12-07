import { Router } from "express";
import * as StudentController from "../controllers/studentController";
import { authMiddleware, teacherOnly } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Lista todos os alunos
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade por página
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email
 *       - in: query
 *         name: matricula
 *         schema:
 *           type: string
 *         description: Filtrar por matrícula
 *       - in: query
 *         name: turma
 *         schema:
 *           type: string
 *         description: Filtrar por turma
 *     responses:
 *       200:
 *         description: Lista de alunos
 *       204:
 *         description: Nenhum aluno encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado - apenas professores
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, teacherOnly, StudentController.getStudent);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Cria um novo aluno
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cpf
 *               - nascimento
 *               - telefone
 *               - turma
 *               - email
 *               - matricula
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               cpf:
 *                 type: string
 *               nascimento:
 *                 type: string
 *               telefone:
 *                 type: string
 *               turma:
 *                 type: string
 *               email:
 *                 type: string
 *               matricula:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado - apenas professores
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, teacherOnly, StudentController.createStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um aluno
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               cpf:
 *                 type: string
 *               nascimento:
 *                 type: string
 *               telefone:
 *                 type: string
 *               turma:
 *                 type: string
 *               email:
 *                 type: string
 *               matricula:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Aluno atualizado
 *       400:
 *         description: Erro ao atualizar
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado - apenas professores
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:id",
  authMiddleware,
  teacherOnly,
  StudentController.updateStudent
);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Deleta um aluno
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno deletado
 *       400:
 *         description: Aluno não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado - apenas professores
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  authMiddleware,
  teacherOnly,
  StudentController.deleteStudent
);

export default router;
