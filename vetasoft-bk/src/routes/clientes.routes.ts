/**
 * Clientes Routes - Express
 */

import { Router, Request, Response } from "express";
import { ClientesService } from "../services/clientes.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * GET /api/clientes
 */
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const clientes = await ClientesService.findAll();
    res.json({ success: true, data: clientes });
  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener clientes" });
  }
});

/**
 * GET /api/clientes/:id
 */
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const cliente = await ClientesService.findById(req.params.id);
    if (!cliente) {
      res.status(404).json({ success: false, error: "Cliente no encontrado" });
      return;
    }
    res.json({ success: true, data: cliente });
  } catch (error) {
    console.error("Error obteniendo cliente:", error);
    res.status(500).json({ success: false, error: "Error al obtener cliente" });
  }
});

/**
 * POST /api/clientes
 */
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const cliente = await ClientesService.create(req.body);
    res.status(201).json({ success: true, data: cliente });
  } catch (error) {
    console.error("Error creando cliente:", error);
    res.status(500).json({ success: false, error: "Error al crear cliente" });
  }
});

/**
 * PUT /api/clientes/:id
 */
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const cliente = await ClientesService.update(req.params.id, req.body);
    if (!cliente) {
      res.status(404).json({ success: false, error: "Cliente no encontrado" });
      return;
    }
    res.json({ success: true, data: cliente });
  } catch (error) {
    console.error("Error actualizando cliente:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al actualizar cliente" });
  }
});

/**
 * DELETE /api/clientes/:id
 */
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const cliente = await ClientesService.deactivate(req.params.id);
    if (!cliente) {
      res.status(404).json({ success: false, error: "Cliente no encontrado" });
      return;
    }
    res.json({ success: true, data: cliente, message: "Cliente desactivado" });
  } catch (error) {
    console.error("Error eliminando cliente:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar cliente" });
  }
});

export default router;
