import prisma from "../prisma/client.js";
import ValidationFormError from "../errors/validation-form/index.js";
import { transformSetToObject } from "../utils/transformSetToObject.js";
import { validate } from "../utils/validate.js";
import { rules } from "../misc/validationRules.js";

class StockMovementService {
  async get(filters = {}) {
    const { page, pageSize } = filters;

    const stockMovement = await prisma.stockMovement.findMany({
      select: {
        id: true,
        data: true,
        tipo: true,
        quantidade: true,
        produtos: {
          select: {
            produto: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
        Usuario: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const data = stockMovement.map((mov) => ({
      id: mov.id,
      data: mov.data,
      tipo: mov.tipo,
      usuario: mov.Usuario?.nome,
      quantidade: mov.quantidade,
      produtos: mov.produtos.map((p) => ({
        id: p.produto.id,
        nome: p.produto.nome,
      })),
    }));
    const total = await prisma.stockMovement.count();

    return {
      data,
      total,
      totalPages: Math.ceil(stockMovement.length / pageSize),
      currentPage: page,
      pageSize,
    };
  }

  async getById(id) {
    const stockMovement = await prisma.stockMovement.findUnique({
      where: { id },
    });

    if (!stockMovement) {
      throw new NotFoundException("Movimentação não encontrada.");
    }

    return stockMovement;
  }

  /**
   * @param {dateTime} date
   * @param {String}type
   * @param {int}quantity
   * @param {int}productId
   * @param {int}userId
   */
  async create(date, type, quantity, productId, userId) {
    const data = { date, type, quantity, productId, userId };
    const errors = validate(data, rules);

    if (errors.size !== 0) {
      const errorObject = transformSetToObject(errors);
      throw new ValidationFormError("", errorObject);
    }

    const validadeDate = new Date(date);

    const newStockMovement = await prisma.stockMovement.create({
      data: {
        data: validadeDate,
        tipo: type,
        quantidade: quantity,
        produtoId: productId,
        usuarioId: userId,
      },
    });

    return newStockMovement;
  }

  /**
   * @param {int} id
   * @param {dateTime} date
   * @param {String}type
   * @param {int}quantity
   * @param {int}productId
   * @param {int}userId
   */
  async update(id, date, type, quantity, productId, userId) {
    const data = { date, type, quantity, productId, userId };
    const errors = validate(data, rules);

    if (errors.size !== 0) {
      const errorObject = transformSetToObject(errors);
      throw new ValidationFormError("", errorObject);
    }

    const stockMovementExist = await prisma.stockMovement.findUnique({
      where: {
        id,
      },
    });

    if (!stockMovementExist) {
      throw new Error("Movimentação não encontrada.");
    }

    const validadeDate = new Date(date);

    await prisma.stockMovement.update({
      where: { id },
      data: {
        data: validadeDate,
        tipo: type,
        quantidade: quantity,
        produtoId: productId,
        usuarioId: userId,
      },
    });
  }

  /**
   * @param {number} id
   */
  async remove(id) {
    const stockMovementExist = await prisma.stockMovement.findUnique({
      where: {
        id,
      },
    });

    if (!stockMovementExist) {
      throw new Error("Movimentação não existe.");
    }

    await prisma.stockMovement.delete({
      where: {
        id,
      },
    });
  }
}

export default StockMovementService;
