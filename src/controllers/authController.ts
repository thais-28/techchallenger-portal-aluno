import { Request, Response } from "express";
import { loginSchema } from "../validations/authValidator";
import * as AuthService from "../services/authService";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login de professor ou aluno
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: professor@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [teacher, student]
 *       400:
 *         description: Credenciais inválidas
 */
export const login = async (req: Request, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: parseResult.error.flatten().fieldErrors,
    });
  }

  const { email, senha } = parseResult.data;
  const response = await AuthService.loginService(email, senha);

  return res.status(response.statusCode).json(response.body);
};
