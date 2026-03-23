/**
 * Razas Routes - Express
 */

import { Router, Request, Response } from "express";
import { RazasService } from "../services/razas.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { especie_id } = req.query;
    const razas = await RazasService.findAll({
      especie_id: especie_id ? Number(especie_id) : null,
    });
    res.json({ success: true, data: razas });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener razas" });
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const raza = await RazasService.findById(req.params.id);
    if (!raza) {
      res.status(404).json({ success: false, error: "Raza no encontrada" });
      return;
    }
    res.json({ success: true, data: raza });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener raza" });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const raza = await RazasService.create(req.body);
    res.status(201).json({ success: true, data: raza });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al crear raza" });
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const raza = await RazasService.update(req.params.id, req.body);
    res.json({ success: true, data: raza });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al actualizar raza" });
  }
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const raza = await RazasService.delete(req.params.id);
    res.json({ success: true, data: raza, message: "Raza desactivada" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al eliminar raza" });
  }
});

export default router;
