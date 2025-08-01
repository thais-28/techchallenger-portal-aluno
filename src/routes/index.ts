import { Router } from "express";
import * as PostController from "../controllers/postController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único gerado pelo MongoDB
 *         title:
 *           type: string
 *           description: Título do post
 *         content:
 *           type: string
 *           description: Conteúdo do post
 *         author:
 *           type: string
 *           description: Nome do autor
 *         subject:
 *           type: string
 *           description: Assunto do post
 *       required:
 *         - title
 *         - content
 *         - author
 *         - subject
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Descrição do erro
 *         errors:
 *           type: object
 *           additionalProperties:
 *             type: array
 *             items:
 *               type: string
 *       example:
 *         message: Erro de validação
 *         errors:
 *           title:
 *             - "Título é obrigatório"
 *   parameters:
 *     postId:
 *       name: id
 *       in: path
 *       description: ID do post
 *       required: true
 *       schema:
 *         type: string
 *
 * tags:
 *   - name: Posts
 *     description: Endpoints para gerenciamento de posts
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Lista posts com filtros e paginação
 *     tags: [Posts]
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
 *         name: author
 *         schema:
 *           type: string
 *         description: Filtra por autor
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: Filtra por assunto
 *     responses:
 *       200:
 *         description: Lista de posts retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       204:
 *         description: Nenhum post encontrado
 */
router.get("/posts", PostController.getPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Retorna um post pelo ID
 *     tags: [Posts]
 *     parameters:
 *       - $ref: '#/components/parameters/postId'
 *     responses:
 *       200:
 *         description: Post encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       204:
 *         description: Post não encontrado
 */
router.get("/posts/:id", PostController.getPostById);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Cria um novo post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *               subject:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *               - author
 *               - subject
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Dados inválidos ou faltando campos obrigatórios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/posts", PostController.createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Deleta um post pelo ID
 *     tags: [Posts]
 *     parameters:
 *       - $ref: '#/components/parameters/postId'
 *     responses:
 *       200:
 *         description: Post deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deletado com sucesso
 *       400:
 *         description: ID inválido ou post não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/posts/:id", PostController.deletePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um post
 *     tags: [Posts]
 *     parameters:
 *       - $ref: '#/components/parameters/postId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Erro de validação ou post não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/posts/:id", PostController.updatePost);

export default router;
