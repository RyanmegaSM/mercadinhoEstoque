import { Router } from "express";

import SuppliersController from "../controller/supplierController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";

const router = Router();

const suppliersController = new SuppliersController();

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Lista todos os fornecedores
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Suppliers
 *     responses:
 *       200:
 *         description: Retorna a lista de fornecedores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supplier'
 */
router.get("/", ensureAuthenticated, suppliersController.listSuppliers);

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Retorna um fornecedor pelo ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Suppliers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Fornecedor não encontrado
 */
router.get("/:id", ensureAuthenticated, suppliersController.listSuppliersById);

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Cria um novo fornecedor
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Suppliers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Erro de validação
 */
router.post("/", ensureAuthenticated, suppliersController.createSupplier);

/**
 * @swagger
 * /suppliers:
 *   put:
 *     summary: Atualiza um fornecedor existente
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Suppliers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Supplier'
 *             required:
 *               - id
 *     responses:
 *       204:
 *         description: Fornecedor atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar fornecedor
 */
router.put("/", ensureAuthenticated, suppliersController.updateSupplier);

/**
 * @swagger
 * /suppliers/{id}:
 *   delete:
 *     summary: Remove um fornecedor
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Suppliers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do fornecedor a ser removido
 *     responses:
 *       200:
 *         description: Fornecedor removido com sucesso
 *       400:
 *         description: Erro ao remover fornecedor
 */
router.delete("/:id", ensureAuthenticated, suppliersController.removeSupplier);

export default router;
