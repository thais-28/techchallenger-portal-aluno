import { Router } from "express";
import * as PostController from "../controllers/postController";
import { authMiddleware, teacherOnly } from "../middlewares/auth";

const router = Router();

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
 *       204:
 *         description: Nenhum post encontrado
 */
router.get("/", PostController.getPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Retorna um post pelo ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post encontrado
 *       204:
 *         description: Post não encontrado
 */
router.get("/:id", PostController.getPostById);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Cria um novo post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado - apenas professores
 */
router.post("/", authMiddleware, teacherOnly, PostController.createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post atualizado
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado - apenas professores
 */
router.patch("/:id", authMiddleware, teacherOnly, PostController.updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Deleta um post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deletado
 *       400:
 *         description: Post não encontrado
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado - apenas professores
 */
router.delete("/:id", authMiddleware, teacherOnly, PostController.deletePost);

export default router;
