/**
 * Donaciones Routes - Express
 */

import { Router, Request, Response } from "express";
import { DonacionesService } from "../services/donaciones.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { campana_id } = req.query;
    const donaciones = await DonacionesService.findAll(
      campana_id ? Number(campana_id) : null
    );
    res.json({ success: true, data: donaciones });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener donaciones" });
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const donacion = await DonacionesService.findById(Number(req.params.id));
    res.json({ success: true, data: donacion });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener donación" });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const donacion = await DonacionesService.create(req.body);
    res.status(201).json({ success: true, data: donacion });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al crear donación" });
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const donacion = await DonacionesService.update(
      Number(req.params.id),
      req.body
    );
    res.json({ success: true, data: donacion });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar donación" });
  }
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const donacion = await DonacionesService.delete(Number(req.params.id));
    res.json({ success: true, data: donacion, message: "Donación eliminada" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar donación" });
  }
});

export default router;
