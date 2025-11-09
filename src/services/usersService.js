import { hash } from "bcrypt";

import prisma from "../prisma/client.js";
import ValidationFormError from "../errors/validation-form/index.js";
import NotFoundException from "../errors/not-found/index.js";
import { transformSetToObject } from "../utils/transformSetToObject.js";
import { messages } from "../misc/messages.js";
import { SALT } from "../misc/constants.js";
import { rules as validationRules } from "../misc/validationRules.js";
import { validate } from "../utils/validate.js";

class UsersService {
  async get(filters = {}) {
    const { page = 1, pageSize = 10 } = filters;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipoDeAcesso: true,
      },
    });

    const result = users.slice((page - 1) * pageSize, page * pageSize);

    return {
      data: result.map((user) => ({
        id: user.id,
        name: user.nome,
        email: user.email,
        accessType: user.tipoDeAcesso,
      })),
      total: users.length,
      totalPages: Math.ceil(users.length / pageSize),
      currentPage: page,
      pageSize,
    };
  }

  /**
   *
   * @param {number} id
   * @returns
   */
  async getById(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(messages.user.notFound);
    return {
      id: user.id,
      name: user.nome,
      email: user.email,
      accessType: user.tipoDeAcesso,
    };
  }

  /**
   *
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @param {number} accessType
   * @returns
   */
  async create(name, email, password, accessType) {
    const rules = validationRules.user.create;
    const data = { name, email, password, accessType };

    const errors = validate(data, rules);

    if (errors.size !== 0) {
      const errorObject = transformSetToObject(errors);
      throw new ValidationFormError("", errorObject);
    }

    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userAlreadyExists) {
      throw new Error("E-mail já cadastrado.");
    }

    const hashedPassword = await hash(password, SALT);

    const newUser = await prisma.user.create({
      data: {
        nome: name,
        email,
        senha: hashedPassword,
        tipoDeAcesso: accessType,
      },
    });

    return {
      id: newUser.id,
      name: newUser.nome,
      email: newUser.email,
      accessType: newUser.tipoDeAcesso,
    };
  }

  /**
   *
   * @param {number} id
   * @param {string} name
   * @param {string} email
   * @param {string} [password]
   * @param {number} accessType
   */
  async update(id, name, email, password, accessType) {
    const rules = { ...validationRules.user.update };

    if (password?.trim()) {
      rules.password = [
        (value) => (!value?.trim() ? messages.user.passwordRequired : null),
      ];
    }

    const data = { name, email, password, accessType };
    const errors = validate(data, rules);
    if (errors.size !== 0) {
      const errorObject = transformSetToObject(errors);
      throw new ValidationFormError("", errorObject);
    }

    const userExist = await prisma.user.findUnique({ where: { id } });
    if (!userExist) throw new Error(messages.user.notFound);

    const updateData = {
      nome: name,
      email,
      tipoDeAcesso: accessType,
    };

    if (password && password.trim() !== "") {
      updateData.senha = await hash(password, SALT);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   *
   * @param {number} id
   */
  async remove(id) {
    const userExist = await prisma.user.findUnique({ where: { id } });
    if (!userExist) throw new NotFoundException(messages.user.notFound);

    await prisma.user.delete({ where: { id } });
  }
}

export default UsersService;
