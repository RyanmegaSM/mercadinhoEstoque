import prisma from "../prisma/client.js";
import ValidationFormError from "../errors/validation-form/index.js";
import NotFoundException from "../errors/not-found/index.js";
import { transformSetToObject } from "../utils/transformSetToObject.js";
import { rules as validationRules } from "../misc/validationRules.js";
import { validate } from "../utils/validate.js";

class CategoriesService {
  async get() {
    const categories = await prisma.category.findMany();
    return categories;
  }

  /**
   * @param {number} id
   */
  async getById(id) {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException("Categoria não encontrada.");
    }

    return category;
  }

  /**
   *
   * @param {string} name
   * @param {string} description
   */
  async create(name, description) {
    const rules = validationRules.category.create;
    const data = { name, description };

    const errors = validate(data, rules);

    if (errors.size !== 0) {
      const errorObject = transformSetToObject(errors);
      throw new ValidationFormError("", errorObject);
    }

    const existingCategoryName = await prisma.category.findFirst({
      where: { nome: name.trim().toLowerCase() },
    });
    if (existingCategoryName) {
      throw new Error("Categoria com esse nome ja existe.");
    }

    const newCategory = await prisma.category.create({
      data: {
        nome: name.trim().toLowerCase(),
        descricao: description.trim(),
      },
    });

    return newCategory;
  }

  /**
   * @param {number} id
   * @param {string} name
   * @param {string} description
   */
  async update(id, name, description) {
    const rules = validationRules.category.create;
    const data = { name, description };

    const errors = validate(data, rules);

    const categoryExist = await prisma.category.findUnique({
      where: {
        id,
      },
    });
    if (!categoryExist) {
      throw new NotFoundException("Categoria não encontrada.");
    }
    if (errors.size !== 0) {
      const errorObject = transformSetToObject(errors);
      throw new ValidationFormError("", errorObject);
    }

    const existingCategoryName = await prisma.category.findFirst({
      where: { nome: name.trim().toLowerCase(), NOT: { id } },
    });
    if (existingCategoryName) {
      throw new Error("Categoria com esse nome ja existe.");
    }

    await prisma.category.update({
      where: { id },
      data: {
        nome: name.trim().toLowerCase(),
        descricao: description.trim(),
      },
    });
  }

  /**
   * @param {number} id
   */
  async remove(id) {
    const categoryExist = await prisma.category.findUnique({
      where: { id },
      include: { produtos: true },
    });

    if (!categoryExist) {
      throw new NotFoundException("Categoria não encontrada.");
    }

    if (categoryExist.produtos && categoryExist.produtos.length > 0) {
      throw new Error(
        "Não é possível excluir a categoria, pois existem produtos associados a ela."
      );
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });
  }
}

export default CategoriesService;
