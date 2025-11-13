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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *       - in: query
 *         name: matricula
 *         schema:
 *           type: string
 *       - in: query
 *         name: disciplina
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de professores
 *       204:
 *         description: Nenhum professor encontrado
 */

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
 *                 format: date
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Professor atualizado
 *       400:
 *         description: Erro ao atualizar
 */

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
 *     responses:
 *       200:
 *         description: Professor deletado
 *       400:
 *         description: Erro ao deletar
 */

export {};