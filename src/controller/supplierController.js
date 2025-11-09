import { response, request } from "express";

import SuppliersService from "../services/suppliersService.js";

import { httpStatus } from "../misc/httpStatus.js";
import ValidationFormError from "../errors/validation-form/index.js";
import NotFoundException from "../errors/not-found/index.js";

class SuppliersController {
  /**
   * @param {request} request
   * @param {response} response
   */
  async listSuppliers(request, response) {
    const { name, cnpj, page, pageSize } = request.query;

    const filters = {
      name: name ? String(name) : undefined,
      cnpj: cnpj ? String(cnpj) : undefined,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    };
    try {
      const service = new SuppliersService();
      const fornecedores = await service.get(filters);
      response.json(fornecedores);
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
  async listSuppliersById(request, response) {
    const { id } = request.params;
    const service = new SuppliersService();

    try {
      const fornecedor = await service.getById(Number(id));
      response.json(fornecedor);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response.status(httpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }

      return response.status(400).json({
        message: error.message,
      });
    }
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async createSupplier(request, response) {
    const { name, telephone, address, cnpj } = request.body;
    const service = new SuppliersService();

    try {
      const data = await service.create(name, telephone, address, cnpj);
      return response.status(httpStatus.CREATED).json(data);
    } catch (error) {
      if (error instanceof ValidationFormError) {
        return response.status(httpStatus.BAD_REQUEST).json({
          ...error.errors,
        });
      }

      return response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async updateSupplier(request, response) {
    const { id, name, telephone, address, cnpj } = request.body;
    const service = new SuppliersService();

    try {
      await service.update(id, name, telephone, address, cnpj);
      return response.status(httpStatus.NO_CONTENT).json();
    } catch (error) {
      if (error instanceof ValidationFormError) {
        return response.status(httpStatus.BAD_REQUEST).json({
          ...error.errors,
        });
      }
      if (error instanceof NotFoundException) {
        return response.status(httpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }
      return response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async removeSupplier(request, response) {
    const { id } = request.params;
    const service = new SuppliersService();

    try {
      await service.remove(Number(id));
      return response.json({ message: "Forncedor removido com sucesso." });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response.status(httpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }
      return response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}

export default SuppliersController;
