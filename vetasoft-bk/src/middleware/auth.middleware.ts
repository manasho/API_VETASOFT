/**
 * Authentication Middleware
 */

import { Request, Response, NextFunction } from "express";
import { JwtUtil, JwtPayload } from "../utils/jwt.util.js";

// Extender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware para verificar JWT
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: "No autorizado - Token no proporcionado",
    });
    return;
  }

  const token = authHeader.substring(7);
  const payload = JwtUtil.verifyToken(token);

  if (!payload) {
    res.status(401).json({
      success: false,
      error: "No autorizado - Token inválido o expirado",
    });
    return;
  }

  req.user = payload;
  next();
}

/**
 * Middleware para verificar roles
 */
export function roleMiddleware(allowedRoles: number[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, error: "No autorizado" });
      return;
    }

    if (!allowedRoles.includes(req.user.roleId)) {
      res.status(403).json({
        success: false,
        error: "Acceso denegado - Sin permisos",
      });
      return;
    }

    next();
  };
}
