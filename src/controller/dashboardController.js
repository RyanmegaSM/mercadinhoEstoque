import { response, request } from "express";

import { httpStatus } from "../misc/httpStatus.js";
import DashboardService from "../services/dashboardService.js";

class DashboardController {
  /**
   * @param {request} request
   * @param {response} response
   */
  async getTotalProducts(request, response) {
    const service = new DashboardService();
    try {
      const count = await service.getTotalProducts();
      return response.json({ totalProducts: count });
    } catch (error) {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async getBatchAmount(request, response) {
    const service = new DashboardService();

    try {
      const result = await service.getBatchAmount();
      return response.json({ amount: result });
    } catch (error) {
      return response.status(httpStatus.BAD_REQUEST).json({
        error: error.message,
      });
    }
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async getExpiringBatches(request, response) {
    const { limit } = request.query;

    const days = limit ? Number(limit) : 15;

    if (isNaN(days) || days <= 0) {
      return response.status(httpStatus.BAD_REQUEST).json({
        error: 'O parâmetro "limite" deve ser um número maior que zero.',
      });
    }

    const today = new Date();

    const limitDays = new Date();
    limitDays.setDate(today.getDate() + days);

    const service = new DashboardService();

    try {
      const result = await service.getExpiringBatches(limitDays);
      return response.json(result);
    } catch (error) {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async getLowStockProducts(request, response) {
    const { threshold } = request.query;

    const days = threshold ? Number(threshold) : 20;

    if (isNaN(days) || days <= 0) {
      return response.status(httpStatus.BAD_REQUEST).json({
        error: 'O parâmetro "limite" deve ser um número maior que zero.',
      });
    }

    const service = new DashboardService();

    try {
      const result = await service.getLowStockProducts(days);
      return response.json(result);
    } catch (error) {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  /**
   *
   * @param {request} request
   * @param {response} response
   */
  async getStockSummary(request, response) {
    const service = new DashboardService();

    try {
      const data = await service.getStockSummary();
      return response.json(data);
    } catch (error) {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
}

export default DashboardController;
