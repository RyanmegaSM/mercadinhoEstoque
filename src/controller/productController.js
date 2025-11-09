"use strict";

import { response, request } from "express";

import ProductService from "../services/productsService.js";

import { httpStatus } from "../misc/httpStatus.js";
import ValidationFormError from "../errors/validation-form/index.js";
import NotFoundException from "../errors/not-found/index.js";

class ProductController {
  /**
   *
   * @param {request} request
   * @param {response} response
   */

  async listProducts(request, response) {
    const { category, name, page, pageSize } = request.query;

    const filters = {
      category: category ? category : undefined,
      name: name ? name : undefined,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    };

    try {
      const service = new ProductService();
      const produtos = await service.list(filters);
      response.json(produtos);
    } catch (error) {
      return response
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  /**
   *
   * @param {request} request
   * @param {response} response
   */
  async listProductById(request, response) {
    const { id } = request.params;
    const service = new ProductService();

    try {
      const product = await service.getById(Number(id));
      return response.json(product);
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
  async listProductBySupplier(request, response) {
    const { supplierId } = request.params;
    const service = new ProductService();

    try {
      const data = await service.getBySupplier(Number(supplierId));
      return response.json(data);
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
  async createProduct(request, response) {
    const { name, description, unitPrice, categoryId } = request.body;
    const service = new ProductService();

    try {
      const data = await service.create(
        name,
        description,
        unitPrice,
        categoryId
      );
      return response.status(httpStatus.CREATED).json(data);
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
   *
   * @param {request} request
   * @param {response} response
   */
  async updateProduct(request, response) {
    const { id, name, description, unitPrice, categoryId } = request.body;
    const service = new ProductService();

    try {
      await service.update(id, name, description, unitPrice, categoryId);
      return response.status(204).json();
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

      return response.status(400).json({ message: error.message });
    }
  }
  /**
   * @param {request} request
   * @param {response} response
   */
  async removeProduct(request, response) {
    const { id } = request.params;
    const service = new ProductService();

    try {
      await service.remove(Number(id));
      return response.json({
        message: `Produdo com id: ${id} removido com sucesso.`,
      });
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

export default ProductController;
