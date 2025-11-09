import jwt from "jsonwebtoken";
import { httpStatus } from "../misc/httpStatus.js";

/**
 *
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 */
export function ensureAuthenticated(request, response, next) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(httpStatus.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }

  const [schema, token] = authToken.split(" ");
  if (!/^Bearer$/i.test(schema)) {
    return response.status(httpStatus.UNAUTHORIZED).json({
      message: "token mal formatado.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");
    if (typeof decoded === "string") {
      throw new Error("Token inválido");
    }

    request.headers.userId = decoded.id;
    return next();
  } catch (error) {
    return response.status(httpStatus.UNAUTHORIZED).json({
      message: error.message,
    });
  }
}
