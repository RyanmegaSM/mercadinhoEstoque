import prisma from "../prisma/client.js";
import { httpStatus } from "../misc/httpStatus.js";

// Definindo níveis de acesso
export const ACCESS_LEVELS = {
  ADMIN: 1,
  MANAGER: 2,
  EMPLOYEE: 3,
};

/**
 * Middleware para verificar se o usuário tem o nível de acesso necessário
 * @param {number[]} allowedAccessTypes - Array com os tipos de acesso permitidos
 */
export function authorizeAccess(allowedAccessTypes) {
  /**
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */
  return async (request, response, next) => {
    try {
      const userId = request.headers.userId;

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { tipoDeAcesso: true },
      });

      if (!user) {
        return response.status(httpStatus.FORBIDDEN).json({
          message: "Usuário não encontrado",
        });
      }

      if (!allowedAccessTypes.includes(user.tipoDeAcesso)) {
        return response.status(httpStatus.FORBIDDEN).json({
          message: "Acesso não autorizado para este recurso",
        });
      }

      next();
    } catch (error) {
      return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Erro ao verificar permissões",
      });
    }
  };
}
