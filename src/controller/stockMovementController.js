import { response, request } from "express";

import StockMovementService from "../services/stockMovementService.js";

import { httpStatus } from "../misc/httpStatus.js";
import ValidationFormError from "../errors/validation-form/index.js";
import NotFoundException from "../errors/not-found/index.js";

class StockMovementController {
  /**
   * @param {request} request
   * @param {response} response
   */
  async listStockMovement(request, response) {
    const { data, tipo, quantidade, page, pageSize } = request.query;

    const filters = {
      data: data ? date(data) : undefined,
      tipo: tipo ? String(tipo) : undefined,
      quantidade: quantidade ? Number(quantidade) : undefined,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    };
    try {
      const service = new StockMovementService();
      const movement = await service.get(filters);
      response.json(movement);
    } catch (error) {
      return response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  async listStockMovementById(request, response) {
    const { id } = request.params;
    const service = new StockMovementService();

    try {
      const movement = await service.getById(Number(id));
      return response.json(movement);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return response.status(httpStatus.NOT_FOUND).json({
          message: error.message,
        });
      }

      return response.status(400).json({ message: error.message });
    }
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async createStockMovement(request, response) {
    const { date, type, quantity, productId, userId } = request.body;
    const service = new StockMovementService();
    try {
      const data = await service.create(
        date,
        type,
        quantity,
        productId,
        userId
      );

      return response.status(httpStatus.CREATED).json(data);
    } catch (error) {
      console.log(error);
      if (error instanceof ValidationFormError) {
        return response.status(httpStatus.BAD_REQUEST).json({
          ...error.errors,
        });
      }
      console.log(error);
      return response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async updateStockMovement(request, response) {
    const { id, date, type, quantity, productId, userId } = request.body;
    const service = new StockMovementService();

    try {
      await service.update(id, date, type, quantity, productId, userId);
      return response.status(httpStatus.NO_CONTENT).json();
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
  async removeStockMovement(request, response) {
    const { id } = request.params;
    const service = new StockMovementService();

    try {
      await service.remove(Number(id));
      return response.json("Movimentação removida com sucesso.");
    } catch (error) {
      return response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}

export default StockMovementController;
