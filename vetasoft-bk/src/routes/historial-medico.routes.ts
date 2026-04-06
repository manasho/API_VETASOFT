/**
 * Historial Medico Routes - Express
 */

import { Router, Request, Response } from "express";
import { HistorialMedicoService } from "../services/historial-medico.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { animal_id, veterinario_id, cliente_id } = req.query;
    const historial = await HistorialMedicoService.findAll({
      animal_id: (animal_id as string) || null,
      veterinario_id: (veterinario_id as string) || null,
      cliente_id: cliente_id ? Number(cliente_id) : null,
    });
    res.json({ success: true, data: historial });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener historial médico" });
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const historial = await HistorialMedicoService.findById(req.params.id);
    if (!historial) {
      res
        .status(404)
        .json({ success: false, error: "Historial no encontrado" });
      return;
    }
    res.json({ success: true, data: historial });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener historial" });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const historial = await HistorialMedicoService.create(req.body);
    res.status(201).json({ success: true, data: historial });
  } catch (error) {
    console.error("Error creando historial:", error);
    res.status(500).json({ success: false, error: "Error al crear historial" });
  }
});

export default router;
