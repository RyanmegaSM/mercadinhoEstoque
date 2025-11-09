import jwt from "jsonwebtoken";
import { compare } from "bcrypt";

import prisma from "../prisma/client.js";

const JWT_SECRET = process.env.JWT_SECRET;

class AuthService {
  /**
   *
   * @param {string} email
   * @param {string} password
   * @returns
   */
  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Usuário ou senha inválidos");
    }

    const isPasswordValid = await compare(password, user.senha);
    if (!isPasswordValid) {
      throw new Error("Usuário ou senha inválidos");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.nome,
        accessType: user.tipoDeAcesso,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.nome,
        accessType: user.tipoDeAcesso,
      },
    };
  }

  async logout() {
    return { message: "Logout realizado com sucesso." };
  }
}

export default AuthService;
