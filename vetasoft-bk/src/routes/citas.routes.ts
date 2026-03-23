/**
 * Citas Routes - Express
 */

import { Router, Request, Response } from "express";
import { CitasService } from "../services/citas.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * GET /api/citas
 */
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { veterinario_id, estado_id, fecha_inicio, fecha_fin } = req.query;
    const citas = await CitasService.findAll({
      veterinario_id: (veterinario_id as string) || null,
      estado_id: (estado_id as string) || null,
      fecha_inicio: (fecha_inicio as string) || null,
      fecha_fin: (fecha_fin as string) || null,
    });
    res.json({ success: true, data: citas });
  } catch (error) {
    console.error("Error obteniendo citas:", error);
    res.status(500).json({ success: false, error: "Error al obtener citas" });
  }
});

/**
 * GET /api/citas/:id
 */
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const cita = await CitasService.findById(Number(req.params.id));
    if (!cita) {
      res.status(404).json({ success: false, error: "Cita no encontrada" });
      return;
    }
    res.json({ success: true, data: cita });
  } catch (error) {
    console.error("Error obteniendo cita:", error);
    res.status(500).json({ success: false, error: "Error al obtener cita" });
  }
});

/**
 * POST /api/citas
 */
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const cita = await CitasService.create(req.body);
    res.status(201).json({ success: true, data: cita });
  } catch (error) {
    console.error("Error creando cita:", error);
    res.status(500).json({ success: false, error: "Error al crear cita" });
  }
});

/**
 * PUT /api/citas/:id
 */
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const cita = await CitasService.update(Number(req.params.id), req.body);
    if (!cita) {
      res.status(404).json({ success: false, error: "Cita no encontrada" });
      return;
    }
    res.json({ success: true, data: cita });
  } catch (error) {
    console.error("Error actualizando cita:", error);
    res.status(500).json({ success: false, error: "Error al actualizar cita" });
  }
});

/**
 * DELETE /api/citas/:id
 */
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const cita = await CitasService.delete(Number(req.params.id));
    if (!cita) {
      res.status(404).json({ success: false, error: "Cita no encontrada" });
      return;
    }
    res.json({ success: true, data: cita, message: "Cita cancelada" });
  } catch (error) {
    console.error("Error cancelando cita:", error);
    res.status(500).json({ success: false, error: "Error al cancelar cita" });
  }
});

export default router;
