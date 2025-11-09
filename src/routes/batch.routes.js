import { Router } from "express";

import BatchController from "../controller/batchController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

const router = Router();

const batchController = new BatchController();

/**
 * @swagger
 * tags:
 *   name: Batches
 *   description: Operações relacionadas a lotes
 */

/**
 * @swagger
 * /batches:
 *   get:
 *     summary: Lista todos os lotes
 *     tags: [Batches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: supplierId
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID do fornecedor para filtrar lotes
 *       - in: query
 *         name: minValidity
 *         required: false
 *         schema:
 *          type: number
 *         description: Data de validade mínima para filtrar lotes
 *       - in: query
 *         name: maxValidity
 *         required: false
 *         schema:
 *          type: number
 *         description: Data de validade máxima para filtrar lotes
 *     responses:
 *       200:
 *         description: Lista de lotes
 *       401:
 *         description: Não autorizado
 */
router.get("/", ensureAuthenticated, batchController.listBatch);

/**
 * @swagger
 * components:
 *   schemas:
 *     BatchProductInput:
 *       type: object
 *       required:
 *         - id
 *         - quantidade
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único do produto
 *           example: 101
 *         quantidade:
 *           type: integer
 *           description: Quantidade disponível do produto
 *           example: 20
 *
 *     Batch:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         price:
 *           type: number
 *           format: float
 *           example: 199.99
 *         quantity:
 *           type: integer
 *           example: 50
 *         validity:
 *           type: string
 *           format: date-time
 *           example: 2025-12-31T23:59:59Z
 *         supplierId:
 *           type: integer
 *           example: 12
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BatchProductInput'
 */

/**
 * @swagger
 * /batches:
 *   post:
 *     summary: Criação de um novo lote
 *     description: Cria um novo lote no sistema. Requer autenticação via Bearer Token.
 *     tags: [Batches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - price
 *               - quantity
 *               - validity
 *               - supplierId
 *               - products
 *             properties:
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 199.99
 *               quantity:
 *                 type: integer
 *                 example: 50
 *               validity:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-12-31T23:59:59Z
 *               supplierId:
 *                 type: integer
 *                 example: 12
 *               products:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BatchProductInput'
 *     responses:
 *       201:
 *         description: Lote criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Batch'
 *       400:
 *         description: Requisição inválida (parâmetros incorretos ou faltando)
 *       401:
 *         description: Não autorizado (token inválido ou ausente)
 */
router.post("/", ensureAuthenticated, batchController.createBatch);

/**
 * @swagger
 * /batches/{id}:
 *   get:
 *     summary: Retorna um lote pelo ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Batches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do lote
 *     responses:
 *       200:
 *         description: Lote encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Lote não encontrado
 */
router.get("/:id", ensureAuthenticated, batchController.listBatchById);

/**
 * @swagger
 * /batches:
 *   put:
 *     summary: Atualiza um lote existente
 *     tags: [Batches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               preco:
 *                 type: number
 *                 example: 30.0
 *               quantidade:
 *                 type: integer
 *                 example: 200
 *               validade:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-01-01T00:00:00Z"
 *               fornecedorId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Lote atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Lote não encontrado
 */
router.put("/", ensureAuthenticated, batchController.updateBatch);

/**
 * @swagger
 * /batches/{id}:
 *   delete:
 *     summary: Remove um lote pelo ID
 *     tags: [Batches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do lote a ser removido
 *     responses:
 *       200:
 *         description: Lote removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Lote não encontrado
 */
router.delete("/:id", ensureAuthenticated, batchController.removeBatch);

export default router;
