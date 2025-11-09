import { Router } from "express";

import CategoriesController from "../controller/categoryController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

const router = Router();

const categoriesController = new CategoriesController();

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Lista todas as categorias
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Retorna a lista de categorias
 */
router.get("/", ensureAuthenticated, categoriesController.listCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Retorna uma categoria pelo ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoria não encontrada
 */
router.get("/:id", ensureAuthenticated, categoriesController.listCategoryById);

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Cria uma nova categoria
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Eletrônicos
 *               description:
 *                 type: string
 *                 example: Produtos de tecnologia
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post("/", ensureAuthenticated, categoriesController.createCategory);

/**
 * @openapi
 * /categories:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Eletrônicos e Acessórios
 *               description:
 *                 type: string
 *                 example: Produtos de tecnologia e acessórios
 *     responses:
 *       204:
 *         description: Categoria atualizada com sucesso
 *       400:
 *         description: Erro ao atualizar categoria
 */
router.put("/", ensureAuthenticated, categoriesController.updateCategory);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     summary: Remove uma categoria
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria a ser removida
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso
 *       400:
 *         description: Erro ao remover categoria
 */
router.delete("/:id", ensureAuthenticated, categoriesController.removeCategory);

export default router;
