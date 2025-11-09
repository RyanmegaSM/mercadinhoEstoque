import { Router } from "express";

import DashboardController from "../controller/dashboardController.js";

const router = Router();
const controller = new DashboardController();

/**
 * @openapi
 * /dashboard/total-products:
 *   get:
 *     summary: Total de produtos
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - dashboard
 *     responses:
 *       200:
 *         description: Retorna o número total de produtos
 */
router.get("/total-products/", controller.getTotalProducts);

/**
 * @openapi
 * /dashboard/total-amount:
 *   get:
 *     summary: Valor total dos produtos cadastrados
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - dashboard
 *     responses:
 *       200:
 *         description: Retorna o valor total dos produtos cadastrados
 */
router.get("/total-amount", controller.getBatchAmount);

/**
 * @openapi
 * /dashboard/expiring-batches:
 *   get:
 *     summary: Número de lotes perto do vencimento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Número de dias até o vencimento dos lotes
 *     tags:
 *       - dashboard
 *     responses:
 *       200:
 *         description: Retorna o número de lotes próximos ao vencimento
 */
router.get("/expiring-batches", controller.getExpiringBatches);

/**
 * @openapi
 * /dashboard/low-stock:
 *   get:
 *    summary: Lista de produtos em pouca quantidade
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - in: query
 *       name: threshold
 *       required: false
 *       schema:
 *         type: integer
 *       description: Número de mínimo de unidades
 *    tags:
 *     - dashboard
 *    responses:
 *     200:
 *       description: Retorna lista de produtos com baixo número em estoque
 */
router.get("/low-stock", controller.getLowStockProducts);

/**
 * @openapi
 * /dashboard/stock-summary:
 *   get:
 *     summary: Resumo dos produtos em estoque
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - dashboard
 *     responses:
 *       200:
 *         description: Retorna o número resumo dos produtos em estoque
 */
router.get("/stock-summary", controller.getStockSummary);

export default router;
