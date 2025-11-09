import { response, request } from "express";
import UsersService from "../services/usersService.js";
import { httpStatus } from "../misc/httpStatus.js";
import NotFoundException from "../errors/not-found/index.js";

class UsersController {
  /**
   * @param {request} request
   * @param {response} response
   */
  async listUsers(request, response) {
    const { page, pageSize } = request.query;

    const filters = {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    };

    try {
      const service = new UsersService();
      const users = await service.get(filters);
      return response.json(users);
    } catch (error) {
      return response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async listUserById(request, response) {
    const { id } = request.params;
    const service = new UsersService();

    try {
      const user = await service.getById(Number(id));
      return response.json(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response
          .status(httpStatus.NOT_FOUND)
          .json({ message: error.message });
      }

      return response.status(400).json({ message: error.message });
    }
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async createUser(request, response) {
    const { name, email, password, accessType } = request.body;
    const service = new UsersService();

    try {
      const user = await service.create(name, email, password, accessType);
      return response.status(httpStatus.CREATED).json(user);
    } catch (error) {
      return response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.message, errors: error.errors });
    }
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async updateUser(request, response) {
    const { id, name, email, password, accessType } = request.body;
    const service = new UsersService();

    try {
      await service.update(id, name, email, password, accessType);
      return response.status(httpStatus.NO_CONTENT).json();
    } catch (error) {
      return response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.message, errors: error.errors });
    }
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async removeUser(request, response) {
    const { id } = request.params;
    const service = new UsersService();

    try {
      await service.remove(Number(id));
      return response.json("Usuário removido com sucesso.");
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response
          .status(httpStatus.NOT_FOUND)
          .json({ message: error.message });
      }

      return response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}

export default UsersController;
