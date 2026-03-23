/**
 * Vacunas Routes - Express
 */

import { Router, Request, Response } from "express";
import { VacunasService } from "../services/vacunas.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { especie_id } = req.query;
    const vacunas = await VacunasService.findAll(
      (especie_id as string) || null
    );
    res.json({ success: true, data: vacunas });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener vacunas" });
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const vacuna = await VacunasService.findById(req.params.id);
    if (!vacuna) {
      res.status(404).json({ success: false, error: "Vacuna no encontrada" });
      return;
    }
    res.json({ success: true, data: vacuna });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener vacuna" });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const vacuna = await VacunasService.create(req.body);
    res.status(201).json({ success: true, data: vacuna });
  } catch (error) {
    console.error("Error creando vacuna:", error);
    res.status(500).json({ success: false, error: "Error al crear vacuna" });
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const vacuna = await VacunasService.update(req.params.id, req.body);
    res.json({ success: true, data: vacuna });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar vacuna" });
  }
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const vacuna = await VacunasService.delete(req.params.id);
    res.json({ success: true, data: vacuna, message: "Vacuna desactivada" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al eliminar vacuna" });
  }
});

export default router;
