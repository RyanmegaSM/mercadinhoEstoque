import { Router } from "express";

import StockMovementController from "../controller/stockMovementController.js";

const router = Router();

const stockMovementController = new StockMovementController();

/**
 * @swagger
 * tags:
 *   name: StockMovements
 *   description: Operações relacionadas às movimentações de estoque
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StockMovement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         data:
 *           type: string
 *           format: date-time
 *           example: "2025-08-23T10:00:00Z"
 *         tipo:
 *           type: string
 *           example: "entrada"
 *         quantidade:
 *           type: integer
 *           example: 100
 *         produtoId:
 *           type: integer
 *           example: 1
 *         usuarioId:
 *           type: integer
 *           example: 2
 */

/**
 * @swagger
 * /movement:
 *   get:
 *     summary: Lista todas as movimentações de estoque
 *     tags: [StockMovements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de movimentações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockMovement'
 *       401:
 *         description: Não autorizado
 */
router.get("/", stockMovementController.listStockMovement);

/**
 * @swagger
 * /movement/{id}:
 *   get:
 *     summary: Obtém uma movimentação de estoque pelo ID
 *     tags: [StockMovements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da movimentação
 *     responses:
 *       200:
 *         description: Movimentação encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockMovement'
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Movimentação não encontrada
 */
router.get("/:id", stockMovementController.listStockMovementById);

/**
 * @swagger
 * /movement:
 *   post:
 *     summary: Cria uma nova movimentação de estoque
 *     tags: [StockMovements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-23T10:00:00Z"
 *               type:
 *                 type: string
 *                 example: "saida"
 *               quantity:
 *                 type: integer
 *                 example: 50
 *               productId:
 *                 type: integer
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Movimentação criada com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 */
router.post("/", stockMovementController.createStockMovement);

/**
 * @swagger
 * /movement:
 *   put:
 *     summary: Atualiza uma movimentação existente
 *     tags: [StockMovements]
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
 *               data:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-23T10:00:00Z"
 *               tipo:
 *                 type: string
 *                 example: "entrada"
 *               quantidade:
 *                 type: integer
 *                 example: 150
 *               produtoId:
 *                 type: integer
 *                 example: 1
 *               usuarioId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Movimentação atualizada com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Movimentação não encontrada
 */
router.put("/", stockMovementController.updateStockMovement);

/**
 * @swagger
 * /movement/{id}:
 *   delete:
 *     summary: Remove uma movimentação pelo ID
 *     tags: [StockMovements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da movimentação
 *     responses:
 *       200:
 *         description: Movimentação removida com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Movimentação não encontrada
 */
router.delete("/:id", stockMovementController.removeStockMovement);

export default router;
