/**
 * Veterinarios Routes - Express
 */

import { Router, Request, Response } from "express";
import { VeterinariosService } from "../services/veterinarios.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const veterinarios = await VeterinariosService.findAll();
    res.json({ success: true, data: veterinarios });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener veterinarios" });
  }
});

router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const veterinario = await VeterinariosService.findById(req.params.id);
    if (!veterinario) {
      res
        .status(404)
        .json({ success: false, error: "Veterinario no encontrado" });
      return;
    }
    res.json({ success: true, data: veterinario });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al obtener veterinario" });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const veterinario = await VeterinariosService.create(req.body);
    res.status(201).json({ success: true, data: veterinario });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al crear veterinario" });
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const veterinario = await VeterinariosService.update(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: veterinario });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar veterinario" });
  }
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const veterinario = await VeterinariosService.delete(req.params.id);
    res.json({
      success: true,
      data: veterinario,
      message: "Veterinario desactivado",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar veterinario" });
  }
});

export default router;
