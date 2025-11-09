import prisma from "../prisma/client.js";
import ValidationFormError from "../errors/validation-form/index.js";
import NotFoundException from "../errors/not-found/index.js";
import { transformSetToObject } from "../utils/transformSetToObject.js";
import { rules as validationRules } from "../misc/validationRules.js";
import { validate } from "../utils/validate.js";

class BatchService {
  async get(filters = {}) {
    const { supplierId, validity, page, pageSize } = filters;
    const where = {};

    if (supplierId) {
      where.fornecedorId = supplierId;
    }

    if (validity) {
      // Converte a string dd/mm/yyyy para Date
      const [day, month, year] = validity.split("/");
      const validityDate = new Date(year, month - 1, day);

      // Define início e fim do dia para comparação exata
      const startOfDay = new Date(validityDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(validityDate);
      endOfDay.setHours(23, 59, 59, 999);

      where.validade = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const batch = await prisma.batch.findMany({
      where,
      select: {
        id: true,
        preco: true,
        quantidade: true,
        validade: true,
        fornecedor: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    const result = batch.slice((page - 1) * pageSize, page * pageSize);
    return {
      data: result,
      total: batch.length,
      totalPages: Math.ceil(batch.length / pageSize),
      currentPage: page,
      pageSize,
    };
  }

  /**
   *
   * @param {number} id
   */
  async getById(id) {
    const batch = await prisma.batch.findUnique({
      where: { id },
      select: {
        id: true,
        preco: true,
        quantidade: true,
        validade: true,
        fornecedor: {
          select: {
            nome: true,
          },
        },
        BatchOnProducts: {
          select: {
            quantidade: true,
            produto: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
    });

    if (!batch) {
      throw new NotFoundException("Lote não encontrado.");
    }

    const data = {
      id: batch.id,
      preco: batch.preco,
      quantidade: batch.quantidade,
      validade: batch.validade,
      fornecedor: batch.fornecedor.nome,
      produtos: batch.BatchOnProducts.map((p) => ({
        nome: p.produto.nome,
        quantidade: p.quantidade,
      })),
    };
    return data;
  }

  /**
   * @typedef {Object} Product
   * @property {number} id - Identificador único do produto
   * @property {number} quantidade - Quantidade disponível do produto
   */

  /**
   * @param {float} price
   * @param {int}quantity
   * @param {dateTime}validity
   * @param {int}supplierId
   * @param {int} userId
   * @param {Product[]} products

   */
  async create(price, quantity, validity, supplierId, userId, products) {
    const rules = validationRules.batch.create;
    const data = { price, quantity, validity, supplierId };
    const errors = validate(data, rules);

    if (errors.size !== 0) {
      const errorObject = transformSetToObject(errors);
      throw new ValidationFormError("", errorObject);
    }
    const supplierExist = await prisma.supplier.findUnique({
      where: {
        id: supplierId,
      },
    });
    if (!supplierExist) {
      throw new Error("Fornecedor não encontrado.");
    }

    const validadeDate = new Date(validity);

    const result = await prisma.$transaction(async (tx) => {
      const batch = await tx.batch.create({
        data: {
          preco: price,
          validade: validadeDate,
          quantidade: products.reduce(
            (acc, product) => acc + product.quantidade,
            0
          ),
          fornecedor: {
            connect: { id: supplierId },
          },
        },
      });

      for (const product of products) {
        await tx.batchOnProducts.create({
          data: {
            loteId: batch.id,
            produtoId: product.id,
            quantidade: product.quantidade,
          },
        });
      }

      const moviment = await tx.stockMovement.create({
        data: {
          usuarioId: userId,
          produtoId: products[0].id,
          data: new Date(),
          tipo: "Entrada",
          quantidade: products.reduce(
            (acc, product) => acc + product.quantidade,
            0
          ),
        },
      });

      await tx.stockMovementProduct.createMany({
        data: products.map((product) => ({
          movimentacaoId: moviment.id,
          produtoId: product.id,
          quantidade: product.quantidade,
        })),
      });

      return {
        ...batch,
        movimentId: moviment.id,
        movimentType: moviment.tipo,
        movimentDate: moviment.data,
      };
    });

    return result;
  }

  /**
   * @param {number} id
   *@param {float} price
   * @param {int}quantity
   * @param {dateTime}validity
   * @param {int}supplierId
   */
  async update(id, price, quantity, validity, supplierId) {
    const rules = validationRules.batch.create;
    const data = { price, quantity, validity, supplierId };
    const errors = validate(data, rules);

    if (errors.size !== 0) {
      const errorObject = transformSetToObject(errors);
      throw new ValidationFormError("", errorObject);
    }

    const batchExist = await prisma.batch.findUnique({
      where: {
        id,
      },
    });
    if (!batchExist) {
      throw new Error("Lote não encontrado.");
    }

    const validadeDate = new Date(validity);

    await prisma.batch.update({
      where: { id },
      data: {
        preco: price,
        quantidade: quantity,
        validade: validadeDate,
        fornecedorId: supplierId,
      },
    });
  }

  /**
   * @param {number} id
   */
  async remove(id) {
    const batchExist = await prisma.batch.findUnique({
      where: {
        id,
      },
    });

    if (!batchExist) {
      throw new Error("Lote não existe.");
    }

    await prisma.batch.delete({
      where: {
        id,
      },
    });
  }
}

export default BatchService;
