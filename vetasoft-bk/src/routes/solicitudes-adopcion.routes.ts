/**
 * Solicitudes Adopcion Routes - Express
 */

import { Router, Request, Response } from "express";
import { SolicitudesAdopcionService } from "../services/solicitudes-adopcion.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { estado_id, animal_id } = req.query;
    const solicitudes = await SolicitudesAdopcionService.findAll({
      estado_id: estado_id ? Number(estado_id) : null,
      animal_id: animal_id ? Number(animal_id) : null,
    });
    res.json({ success: true, data: solicitudes });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener solicitudes" });
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const solicitud = await SolicitudesAdopcionService.findById(req.params.id);
    res.json({ success: true, data: solicitud });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener solicitud" });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const solicitud = await SolicitudesAdopcionService.create(req.body);
    res.status(201).json({ success: true, data: solicitud });
  } catch (error) {
    console.error("Error creando solicitud:", error);
    res.status(500).json({ success: false, error: "Error al crear solicitud" });
  }
});

router.put(
  "/:id/estado",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const solicitud = await SolicitudesAdopcionService.updateEstado(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: solicitud });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Error al actualizar estado" });
    }
  }
);

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const solicitud = await SolicitudesAdopcionService.delete(req.params.id);
    res.json({
      success: true,
      data: solicitud,
      message: "Solicitud eliminada",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar solicitud" });
  }
});

export default router;
