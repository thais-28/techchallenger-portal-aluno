import { Router } from "express";
import * as TeacherController from "../controllers/teacherController";
import { authMiddleware, teacherOnly } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Lista todos os professores
 *     tags: [Teachers]
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
 *         name: disciplina
 *         schema:
 *           type: string
 *         description: Filtrar por disciplina
 *     responses:
 *       200:
 *         description: Lista de professores
 *       204:
 *         description: Nenhum professor encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado - apenas professores
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, teacherOnly, TeacherController.getTeacher);

/**
 * @swagger
 * /api/teachers:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Teachers]
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
 *               - disciplina
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
 *               disciplina:
 *                 type: string
 *               email:
 *                 type: string
 *               matricula:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Professor criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado - apenas professores
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, teacherOnly, TeacherController.createTeacher);

/**
 * @swagger
 * /api/teachers/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um professor
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
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
 *               disciplina:
 *                 type: string
 *               email:
 *                 type: string
 *               matricula:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Professor atualizado
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
  TeacherController.updateTeacher
);

/**
 * @swagger
 * /api/teachers/{id}:
 *   delete:
 *     summary: Deleta um professor
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Professor deletado
 *       400:
 *         description: Professor não encontrado
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
  TeacherController.deleteTeacher
);

export default router;
