import { Router } from "express";
import UserController from "../controller/usersController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";
import { authorizeAccess, ACCESS_LEVELS } from "../middlewares/authorize.js";

const router = Router();
const usersController = new UserController();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", ensureAuthenticated, usersController.listUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
router.get(
  "/:id",
  ensureAuthenticated,
  authorizeAccess([ACCESS_LEVELS.ADMIN]),
  usersController.listUserById
);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Erro de validação
 */
router.post(
  "/",

  usersController.createUser
);

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Atualiza um usuário existente
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/User'
 *             required:
 *               - id
 *     responses:
 *       204:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar usuário
 */
router.put("/", ensureAuthenticated, usersController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser removido
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       400:
 *         description: Erro ao remover usuário
 */
router.delete("/:id", ensureAuthenticated, usersController.removeUser);

export default router;
