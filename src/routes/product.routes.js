import { Router } from "express";

import ProductController from "../controller/productController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

const router = Router();

const productController = new ProductController();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: integer
 *         description: Nome da categoria para filtrar produtos
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Retorna a lista de produtos
 */
router.get("/", ensureAuthenticated, productController.listProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retorna um produto pelo ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.get("/:id", ensureAuthenticated, productController.listProductById);

/**
 * @swagger
 * /products/supplier/{id}:
 *   get:
 *     summary: Retorna um produto pelo ID do fornecedor
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Produtos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.get(
  "/supplier/:supplierId",
  ensureAuthenticated,
  productController.listProductBySupplier
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - unitPrice
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Notebook
 *               description:
 *                 type: string
 *                 example: Notebook Dell i7
 *               unitPrice:
 *                 type: number
 *                 example: 4500.00
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post("/", ensureAuthenticated, productController.createProduct);

/**
 * @swagger
 * /products:
 *   put:
 *     summary: Atualiza um produto existente
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - unitPrice
 *               - categoryId
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Notebook Gamer
 *               description:
 *                 type: string
 *                 example: Notebook Dell i7 com placa de vídeo dedicada
 *               unitPrice:
 *                 type: number
 *                 example: 5500.00
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       204:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar produto
 */
router.put("/", ensureAuthenticated, productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser removido
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       400:
 *         description: Erro ao remover produto
 */
router.delete("/:id", ensureAuthenticated, productController.removeProduct);

export default router;
