import { Router } from "express";
import postRoutes from "./postRoutes";
import teacherRoutes from "./teacherRoutes";
import studentRoutes from "./studentRoutes";
import authRoutes from "./authRoutes";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: ID do post
 *         title:
 *           type: string
 *           description: Título do post
 *         content:
 *           type: string
 *           description: Conteúdo do post
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Lista todos os posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *   post:
 *     summary: Cria um novo post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - nome
 *         - cpf
 *         - nascimento
 *         - telefone
 *         - disciplina
 *         - email
 *         - matricula
 *         - senha
 *       properties:
 *         id:
 *           type: string
 *           description: ID do professor
 *         nome:
 *           type: string
 *           description: Nome completo do professor
 *         cpf:
 *           type: string
 *           description: CPF do professor
 *         nascimento:
 *           type: string
 *           description: Data de nascimento
 *         telefone:
 *           type: string
 *           description: Telefone de contato
 *         disciplina:
 *           type: string
 *           description: Disciplina que leciona
 *         email:
 *           type: string
 *           description: Email do professor
 *         matricula:
 *           type: string
 *           description: Número de matrícula
 *         senha:
 *           type: string
 *           description: Senha de acesso
 */

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Lista todos os professores com filtros e paginação
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
 *         description: Quantidade de itens por página
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
 *         description: Lista de professores retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Teacher'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       204:
 *         description: Nenhum professor encontrado
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: Professor criado com sucesso
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /api/teachers/{id}:
 *   put:
 *     summary: Atualiza um professor existente
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
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Professor atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Professor não encontrado
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
 *         description: Professor deletado com sucesso
 *       404:
 *         description: Professor não encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - nome
 *         - cpf
 *         - nascimento
 *         - telefone
 *         - curso
 *         - email
 *         - matricula
 *         - senha
 *       properties:
 *         id:
 *           type: string
 *           description: ID do estudante
 *         nome:
 *           type: string
 *           description: Nome completo do estudante
 *         cpf:
 *           type: string
 *           description: CPF do estudante
 *         nascimento:
 *           type: string
 *           description: Data de nascimento
 *         telefone:
 *           type: string
 *           description: Telefone de contato
 *         curso:
 *           type: string
 *           description: Curso matriculado
 *         email:
 *           type: string
 *           description: Email do estudante
 *         matricula:
 *           type: string
 *           description: Número de matrícula
 *         senha:
 *           type: string
 *           description: Senha de acesso
 */

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Lista todos os estudantes com filtros e paginação
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
 *         description: Quantidade de itens por página
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
 *         name: curso
 *         schema:
 *           type: string
 *         description: Filtrar por curso
 *     responses:
 *       200:
 *         description: Lista de estudantes retornada com sucesso
 *       204:
 *         description: Nenhum estudante encontrado
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Estudante criado com sucesso
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Atualiza um estudante existente
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do estudante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Estudante atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Estudante não encontrado
 *   delete:
 *     summary: Deleta um estudante
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Estudante deletado com sucesso
 *       404:
 *         description: Estudante não encontrado
 */

router.use("/posts", postRoutes);
router.use("/teachers", teacherRoutes);
router.use("/students", studentRoutes);
router.use("/auth", authRoutes);

export default router;
