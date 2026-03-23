/**
 * Usuarios Routes - Express
 */

import { Router, Request, Response } from "express";
import { UsuariosService } from "../services/usuarios.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const usuarios = await UsuariosService.findAll();
    res.json({ success: true, data: usuarios });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener usuarios" });
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const usuario = await UsuariosService.findById(Number(req.params.id));
    if (!usuario) {
      res.status(404).json({ success: false, error: "Usuario no encontrado" });
      return;
    }
    res.json({ success: true, data: usuario });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Error al obtener usuario" });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const usuario = await UsuariosService.create(req.body);
    res.status(201).json({ success: true, data: usuario });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Error al crear usuario" });
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const usuario = await UsuariosService.update(
      Number(req.params.id),
      req.body
    );
    if (!usuario) {
      res.status(404).json({ success: false, error: "Usuario no encontrado" });
      return;
    }
    res.json({ success: true, data: usuario });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar usuario" });
  }
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const usuario = await UsuariosService.delete(Number(req.params.id));
    res.json({ success: true, data: usuario, message: "Usuario desactivado" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar usuario" });
  }
});

export default router;
