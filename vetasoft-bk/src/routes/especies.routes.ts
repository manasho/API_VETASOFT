/**
 * Especies Routes - Express
 */

import { Router, Request, Response } from "express";
import { EspeciesService } from "../services/especies.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const especies = await EspeciesService.findAll();
    res.json({ success: true, data: especies });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener especies" });
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const especie = await EspeciesService.findById(req.params.id);
    if (!especie) {
      res.status(404).json({ success: false, error: "Especie no encontrada" });
      return;
    }
    res.json({ success: true, data: especie });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener especie" });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const especie = await EspeciesService.create(req.body);
    res.status(201).json({ success: true, data: especie });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al crear especie" });
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const especie = await EspeciesService.update(req.params.id, req.body);
    res.json({ success: true, data: especie });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar especie" });
  }
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const especie = await EspeciesService.delete(req.params.id);
    res.json({ success: true, data: especie, message: "Especie desactivada" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar especie" });
  }
});

export default router;
