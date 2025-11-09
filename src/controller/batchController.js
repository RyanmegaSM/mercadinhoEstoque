import { response, request } from "express";

import BatchService from "../services/batchService.js";

import { httpStatus } from "../misc/httpStatus.js";
import ValidationFormError from "../errors/validation-form/index.js";
import NotFoundException from "../errors/not-found/index.js";

class BatchController {
  /**
   * @param {request} request
   * @param {response} response
   */
  async listBatch(request, response) {
    const { supplierId, validity, page, pageSize } = request.query;

    const filters = {
      supplierId: supplierId ? Number(supplierId) : undefined,
      validity: validity ? validity : undefined,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    };

    try {
      const service = new BatchService();
      const lotes = await service.get(filters);
      response.json(lotes);
    } catch (error) {
      return response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  async listBatchById(request, response) {
    const { id } = request.params;
    const service = new BatchService();

    try {
      const batch = await service.getById(Number(id));
      return response.json(batch);
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
   *
   * @param {request} request
   * @param {response} response
   */
  async createBatch(request, response) {
    const { price, quantity, validity, supplierId, products } = request.body;
    const { userId } = request.headers;
    const service = new BatchService();

    if (!userId || Array.isArray(userId)) {
      throw new Error("id do usuário inválido.");
    }

    try {
      const data = await service.create(
        price,
        quantity,
        validity,
        supplierId,
        userId,
        products
      );
      return response.json(data);
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
  async updateBatch(request, response) {
    const { id, price, quantity, validity, supplierId } = request.body;
    const service = new BatchService();

    try {
      await service.update(id, price, quantity, validity, supplierId);
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
  async removeBatch(request, response) {
    const { id } = request.params;
    const service = new BatchService();

    try {
      await service.remove(Number(id));
      return response.json();
    } catch (error) {
      return response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}

export default BatchController;
