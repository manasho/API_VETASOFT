/**
 * Auth Routes - Express
 */

import { Router, Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

const router = Router();

/**
 * POST /api/auth/login
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      res.status(400).json({
        success: false,
        error: "Correo y contraseña son requeridos",
      });
      return;
    }

    const result = await AuthService.login(correo, contrasena);

    if (!result.success) {
      res.status(401).json(result);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

/**
 * POST /api/auth/register
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { nombre, correo, contrasena, rol_id } = req.body;

    if (!nombre || !correo || !contrasena) {
      res.status(400).json({
        success: false,
        error: "Nombre, correo y contraseña son requeridos",
      });
      return;
    }

    const result = await AuthService.register({
      nombre,
      correo,
      contrasena,
      rol_id,
    });

    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

/**
 * POST /api/auth/verify
 */
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({
        success: false,
        error: "Token es requerido",
      });
      return;
    }

    const result = await AuthService.verifyToken(token);
    res.json(result);
  } catch (error) {
    console.error("Error en verify:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

export default router;
