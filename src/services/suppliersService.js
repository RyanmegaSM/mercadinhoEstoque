import prisma from "../prisma/client.js";
import ValidationFormError from "../errors/validation-form/index.js";
import NotFoundException from "../errors/not-found/index.js";
import { transformSetToObject } from "../utils/transformSetToObject.js";
import { validate } from "../utils/validate.js";
import { rules } from "../misc/validationRules.js";
import { cnpj as cnpjValidator } from "cpf-cnpj-validator";

class SupplierService {
  async get(filters = {}) {
    const { name, cnpj, page, pageSize } = filters;
    const where = {};

    if (name) {
      where.nome = { contains: name };
    }

    if (cnpj) {
      where.cnpj = {
        contains: cnpj,
      };
    }

    const suppliers = await prisma.supplier.findMany({
      where,
      select: {
        id: true,
        nome: true,
        telefone: true,
        endereco: true,
        cnpj: true,
      },
    });
    const result = suppliers.slice((page - 1) * pageSize, page * pageSize);
    return {
      data: result,
      total: suppliers.length,
      totalPages: Math.ceil(suppliers.length / pageSize),
      currentPage: page,
      pageSize,
    };
  }

  /**
   *
   * @param {number} id
   */
  async getById(id) {
    const supplier = await prisma.supplier.findUnique({
      where: {
        id,
      },
    });

    if (!supplier) {
      throw new NotFoundException("Fornecedor não encontrado.");
    }

    return supplier;
  }

  /**
   *
   * @param {string} name
   * @param {string} telephone
   * @param {string}address
   * @param {string}cnpj
   */
  async create(name, telephone, address, cnpj) {
    const create = rules.supplier.create;

    const data = { name, telephone, address, cnpj };
    const errors = validate(data, create);

    if (errors.size !== 0) {
      const errorObject = transformSetToObject(errors);
      throw new ValidationFormError("", errorObject);
    }

    const normalizedCnpj = cnpj.replace(/\D/g, "");
    const normalizedTelephone = telephone.replace(/\D/g, "");
    const existingSupplierName = await prisma.supplier.findFirst({
      where: {
        nome: name.trim().toLowerCase(),
      },
    });
    if (existingSupplierName) {
      throw new Error("Fornecedor com esse nome ja existe.");
    }
    if (!cnpjValidator.isValid(normalizedCnpj)) {
      throw new Error("CNPJ inválido.");
    }

    const supplierExist = await prisma.supplier.findFirst({
      where: {
        cnpj: normalizedCnpj,
      },
    });
    if (supplierExist) {
      throw new Error("CNPJ já cadastrado.");
    }

    const existingPhone = await prisma.supplier.findFirst({
      where: { telefone: normalizedTelephone },
    });
    if (existingPhone) {
      throw new Error("Telefone já cadastrado.");
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        nome: name.trim().toLowerCase(),
        telefone: normalizedTelephone,
        endereco: address.trim(),
        cnpj: normalizedCnpj,
      },
    });

    return newSupplier;
  }

  /**
   * @param {number} id
   * @param {string} name
   *  @param {string} telephone
   * @param {string}address
   * @param {string}cnpj
   */
  async update(id, name, telephone, address, cnpj) {
    const update = rules.supplier.create;

    const data = { name, telephone, address, cnpj };
    const errors = validate(data, update);

    if (errors.size !== 0) {
      const errorObject = transformSetToObject(errors);
      throw new ValidationFormError("", errorObject);
    }
    const normalizedCnpj = cnpj.replace(/\D/g, "");
    const normalizedTelephone = telephone.replace(/\D/g, "");

    const supplierExist = await prisma.supplier.findUnique({
      where: {
        id,
      },
    });
    if (!supplierExist) {
      throw new NotFoundException("Fornecedor não encontrado.");
    }

    const existingSupplierName = await prisma.supplier.findFirst({
      where: { nome: name.trim(), NOT: { id } },
    });
    if (existingSupplierName) {
      throw new Error("Já existe um fornecedor com esse nome.");
    }

    const existingSupplierPhone = await prisma.supplier.findFirst({
      where: { telefone: normalizedTelephone, NOT: { id } },
    });
    if (existingSupplierPhone) {
      throw new Error("Telefone já cadastrado.");
    }
    if (!cnpjValidator.isValid(normalizedCnpj)) {
      throw new Error("CNPJ inválido.");
    }
    const existingSupplierCnpj = await prisma.supplier.findFirst({
      where: { cnpj: normalizedCnpj, NOT: { id } },
    });
    if (existingSupplierCnpj) {
      throw new Error("CNPJ já cadastrado.");
    }

    await prisma.supplier.update({
      where: { id },
      data: {
        nome: name.trim().toLowerCase(),
        telefone: normalizedTelephone,
        endereco: address,
        cnpj: normalizedCnpj,
      },
    });
  }

  /**
   * @param {number} id
   * @param {string} name
   * @param {string} telephone
   * @param {string}address
   * @param {string}cnpj
   */
  async remove(id) {
    const supplierExist = await prisma.supplier.findUnique({
      where: { id },
      include: {
        Lotes: true,
      },
    });
    if (!supplierExist) {
      throw new NotFoundException("Fornecedor não encontrado.");
    }

    if (supplierExist.Lotes && supplierExist.Lotes.length > 0) {
      throw new Error(
        "Não é possível excluir o fornecedor, pois existem lotes associados a ele."
      );
    }
    await prisma.supplier.delete({
      where: {
        id,
      },
    });
  }
}

export default SupplierService;
