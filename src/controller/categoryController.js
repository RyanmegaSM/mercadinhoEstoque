import { response, request } from "express";

import CategoriesService from "../services/categoriesService.js";

import { httpStatus } from "../misc/httpStatus.js";
import ValidationFormError from "../errors/validation-form/index.js";
import NotFoundException from "../errors/not-found/index.js";

class CategoriesController {
  /**
   * @param {request} request
   * @param {response} response
   */
  async listCategories(request, response) {
    const service = new CategoriesService();
    const produtos = await service.get();
    response.json(produtos);
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async listCategoryById(request, response) {
    const { id } = request.params;
    const service = new CategoriesService();

    try {
      const category = await service.getById(Number(id));
      return response.status(httpStatus.OK).json(category);
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
  async createCategory(request, response) {
    const { name, description } = request.body;
    const service = new CategoriesService();

    try {
      const data = await service.create(name, description);
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
  async updateCategory(request, response) {
    const { id, name, description } = request.body;
    const service = new CategoriesService();

    try {
      await service.update(id, name, description);
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
  async removeCategory(request, response) {
    const { id } = request.params;
    const service = new CategoriesService();

    try {
      await service.remove(Number(id));
      return response.json();
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

export default CategoriesController;
