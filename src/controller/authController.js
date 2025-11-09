import { response, request } from "express";

import AuthService from "../services/authService.js";

class AuthController {
  /**
   * @param {request} request
   * @param {response} response
   */
  async login(request, response) {
    const { email, password } = request.body;
    const service = new AuthService();

    try {
      const result = await service.login(email, password);
      return response.json(result);
    } catch (error) {
      return response.status(400).json({ message: error.message });
    }
  }

  /**
   * @param {request} request
   * @param {response} response
   */
  async logout(request, response) {
    const service = new AuthService();
    const result = await service.logout();
    return response.json(result);
  }
}

export default AuthController;
