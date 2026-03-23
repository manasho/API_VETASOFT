/**
 * Animales Routes - Express
 */

import { Router, Request, Response } from "express";
import { AnimalesService } from "../services/animales.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * GET /api/animales
 */
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { cliente_id, estado } = req.query;
    const animales = await AnimalesService.findAll({
      cliente_id: cliente_id ? Number(cliente_id) : null,
      estado: (estado as string) || null,
    });
    res.json({ success: true, data: animales });
  } catch (error) {
    console.error("Error obteniendo animales:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener animales" });
  }
});

/**
 * GET /api/animales/:id
 */
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const animal = await AnimalesService.findById(req.params.id);
    if (!animal) {
      res.status(404).json({ success: false, error: "Animal no encontrado" });
      return;
    }
    res.json({ success: true, data: animal });
  } catch (error) {
    console.error("Error obteniendo animal:", error);
    res.status(500).json({ success: false, error: "Error al obtener animal" });
  }
});

/**
 * POST /api/animales
 */
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const animal = await AnimalesService.create(req.body);
    res.status(201).json({ success: true, data: animal });
  } catch (error) {
    console.error("Error creando animal:", error);
    res.status(500).json({ success: false, error: "Error al crear animal" });
  }
});

/**
 * PUT /api/animales/:id
 */
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const animal = await AnimalesService.update(req.params.id, req.body);
    if (!animal) {
      res.status(404).json({ success: false, error: "Animal no encontrado" });
      return;
    }
    res.json({ success: true, data: animal });
  } catch (error) {
    console.error("Error actualizando animal:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar animal" });
  }
});

/**
 * DELETE /api/animales/:id
 */
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const animal = await AnimalesService.delete(req.params.id);
    if (!animal) {
      res.status(404).json({ success: false, error: "Animal no encontrado" });
      return;
    }
    res.json({ success: true, data: animal, message: "Animal desactivado" });
  } catch (error) {
    console.error("Error eliminando animal:", error);
    res.status(500).json({ success: false, error: "Error al eliminar animal" });
  }
});

export default router;
