/**
 * Campanas Routes - Express
 */

import { Router, Request, Response } from "express";
import { CampanasService } from "../services/campanas.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { activo } = req.query;
    const campanas = await CampanasService.findAll((activo as string) || null);
    res.json({ success: true, data: campanas });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener campañas" });
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const campana = await CampanasService.findById(req.params.id);
    res.json({ success: true, data: campana });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener campaña" });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const campana = await CampanasService.create(req.body);
    res.status(201).json({ success: true, data: campana });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al crear campaña" });
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const campana = await CampanasService.update(req.params.id, req.body);
    res.json({ success: true, data: campana });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar campaña" });
  }
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const campana = await CampanasService.delete(req.params.id);
    res.json({ success: true, data: campana, message: "Campaña desactivada" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar campaña" });
  }
});

export default router;
