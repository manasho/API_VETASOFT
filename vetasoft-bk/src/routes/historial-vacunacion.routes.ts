/**
 * Historial Vacunacion Routes - Express
 */

import { Router, Request, Response } from "express";
import { HistorialVacunacionService } from "../services/historial-vacunacion.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { animal_id, veterinario_id, cliente_id } = req.query;
    const historial = await HistorialVacunacionService.findAll({
      animal_id: (animal_id as string) || null,
      veterinario_id: (veterinario_id as string) || null,
      cliente_id: cliente_id ? Number(cliente_id) : null
    });
    res.json({ success: true, data: historial });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener historial vacunación" });
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const historial = await HistorialVacunacionService.findById(req.params.id);
    res.json({ success: true, data: historial });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener historial" });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const historial = await HistorialVacunacionService.create(req.body);
    res.status(201).json({ success: true, data: historial });
  } catch (error) {
    console.error("Error creando historial:", error);
    res.status(500).json({ success: false, error: "Error al crear historial" });
  }
});

export default router;
