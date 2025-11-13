import { Router } from "express";
import postRoutes from "./postRoutes";
import teacherRoutes from "./teacherRoutes";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: Gerenciamento de posts
 *   - name: Teachers
 *     description: Gerenciamento de professores
 * 
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *         - subject
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
 *         author:
 *           type: string
 *           description: Autor do post
 *         subject:
 *           type: string
 *           description: Assunto do post
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
 *           description: Nome completo
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
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
 *           example:
 *             nome: João Silva
 *             cpf: "12345678900"
 *             nascimento: "1985-05-15"
 *             telefone: "(11) 98765-4321"
 *             disciplina: Matemática
 *             email: joao.silva@escola.com
 *             matricula: "20231001"
 *             senha: senha123
 *     responses:
 *       201:
 *         description: Professor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: Dados inválidos ou campos obrigatórios faltando
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
 *         description: Professor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: Erro de validação ou professor não encontrado
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Professor deletado com sucesso
 *       400:
 *         description: Professor não encontrado ou ID inválido
 */

router.use("/posts", postRoutes);
router.use("/teachers", teacherRoutes);

export default router;