import NotFoundException from "../errors/not-found/index.js";
import ValidationFormError from "../errors/validation-form/index.js";
import prisma from "../prisma/client.js";
import { transformSetToObject } from "../utils/transformSetToObject.js";
import { validate } from "../utils/validate.js";
import { rules as validationRules } from "../misc/validationRules.js";
import formatMoney from "../utils/formatMoney.js";
class ProductService {
  async list(filters = {}) {
    const { category, name, page, pageSize } = filters;

    const where = {};

    if (name) {
      where.nome = {
        contains: name,
      };
    }

    if (category) {
      where.Categoria = {
        nome: {
          contains: category,
        },
      };
    }

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        nome: true,
        descricao: true,
        precoUnitario: true,
        Categoria: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    const result = products.slice((page - 1) * pageSize, page * pageSize);
    return {
      data: result,
      total: products.length,
      totalPages: Math.ceil(products.length / pageSize),
      currentPage: page,
      pageSize,
    };
  }

  /**
   *
   * @param {number} id
   */
  async getById(id) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException("Produto não encontrado.");
    }

    return product;
  }

  /**
   *
   * @param {number} supplierId
   */
  async getBySupplier(supplierId) {
    const supplierWithProducts = await prisma.supplier.findUnique({
      where: { id: supplierId },
      include: {
        Lotes: {
          include: {
            BatchOnProducts: {
              include: {
                produto: true,
              },
            },
          },
        },
      },
    });

    const uniqueProducts = new Set();

    supplierWithProducts.Lotes.forEach((lote) => {
      lote.BatchOnProducts.forEach((bp) => {
        uniqueProducts.add(JSON.stringify(bp.produto));
      });
    });

    const products = Array.from(uniqueProducts).map((product) =>
      JSON.parse(product)
    );

    return products;
  }

  /**
   *
   * @param {string} name
   * @param {string} description
   * @param {float} unitPrice
   * @param {number} categoryId
   */

  async create(name, description, unitPrice, categoryId) {
    const rules = validationRules.product.create;
    const data = { name, description, unitPrice, categoryId };

    const errors = validate(data, rules);

    const existingProductName = await prisma.product.findFirst({
      where: {
        nome: name.trim().toLowerCase(),
      },
    });
    if (existingProductName) {
      throw new Error("Produto com esse nome ja existe.");
    }

    if (errors.size !== 0) {
      const errorObject = transformSetToObject(errors);
      throw new ValidationFormError("", errorObject);
    }

    const categoryExist = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!categoryExist) {
      throw new NotFoundException("Categoria não encontrada.");
    }

    const formattedPrice = formatMoney(unitPrice);
    const newProduct = await prisma.product.create({
      data: {
        nome: name.trim().toLowerCase(),
        descricao: description.trim(),
        precoUnitario: formattedPrice,
        categoriaId: categoryId,
      },
    });

    return newProduct;
  }

  /**
   * @param {int} id
   * @param {string} name
   * @param {string} description
   * @param {float} unitPrice
   * @param {number} categoryId
   */
  async update(id, name, description, unitPrice, categoryId) {
    const rules = validationRules.product.create;
    const data = { name, description, unitPrice, categoryId };

    const errors = validate(data, rules);

    if (errors.size !== 0) {
      const errorObject = transformSetToObject(errors);
      throw new ValidationFormError("", errorObject);
    }

    const productFound = await prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!productFound) {
      throw new NotFoundException("Produto não encontrado.");
    }

    const existingProductName = await prisma.product.findFirst({
      where: {
        nome: name.trim().toLowerCase(),
        NOT: { id },
      },
    });
    if (existingProductName) {
      throw new Error("Produto com esse nome ja existe.");
    }

    const categoryExist = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExist) {
      throw new NotFoundException("Categoria não encontrada.");
    }
    const formattedPrice = formatMoney(unitPrice);

    await prisma.product.update({
      where: {
        id,
      },
      data: {
        nome: name.trim().toLowerCase(),
        descricao: description.trim(),
        precoUnitario: formattedPrice,
        categoriaId: categoryId,
      },
    });
  }

  /**
   *
   * @param {number} id
   */
  async remove(id) {
    const productExist = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!productExist) {
      throw new NotFoundException("Produto não encontrado.");
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });
  }
}

export default ProductService;
