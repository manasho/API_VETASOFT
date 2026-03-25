/**
 * Modulos Routes - Express
 * Control de módulos visibles por rol (RBAC)
 */

import { Router, Request, Response } from "express";
import { ModulosService } from "../services/modulos.service.js";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// ─── MIS MÓDULOS (el frontend llama esto tras el login) ───────────────────────
/**
 * GET /api/modulos/mis-modulos
 * Retorna los módulos habilitados para el rol del usuario autenticado.
 * El frontend usa esta respuesta para renderizar la navegación lateral.
 */
router.get(
  "/mis-modulos",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const rolId = req.user!.roleId;
      const modulos = await ModulosService.getModulosByRol(rolId);
      res.json({ success: true, data: modulos });
    } catch (error) {
      res.status(500).json({ success: false, error: "Error al obtener módulos" });
    }
  }
);

// ─── ADMINISTRACIÓN DE MÓDULOS (solo admin) ────────────────────────────────────

/**
 * GET /api/modulos
 * Lista todos los módulos con sus roles asignados
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware([1]), // rol 1 = Admin
  async (req: Request, res: Response) => {
    try {
      const modulos = await ModulosService.getModulosConRoles();
      res.json({ success: true, data: modulos });
    } catch (error) {
      res.status(500).json({ success: false, error: "Error al obtener módulos" });
    }
  }
);

/**
 * GET /api/modulos/rol/:rolId
 * Módulos asignados a un rol específico
 */
router.get(
  "/rol/:rolId",
  authMiddleware,
  roleMiddleware([1]),
  async (req: Request, res: Response) => {
    try {
      const rolId = Number(req.params.rolId);
      const modulos = await ModulosService.getModulosByRol(rolId);
      res.json({ success: true, data: modulos });
    } catch (error) {
      res.status(500).json({ success: false, error: "Error al obtener módulos del rol" });
    }
  }
);

/**
 * POST /api/modulos
 * Crear un nuevo módulo
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware([1]),
  async (req: Request, res: Response) => {
    try {
      const modulo = await ModulosService.crear(req.body);
      res.status(201).json({ success: true, data: modulo });
    } catch (error) {
      res.status(500).json({ success: false, error: "Error al crear módulo" });
    }
  }
);

/**
 * POST /api/modulos/rol/:rolId/:moduloId
 * Asignar un módulo a un rol
 */
router.post(
  "/rol/:rolId/:moduloId",
  authMiddleware,
  roleMiddleware([1]),
  async (req: Request, res: Response) => {
    try {
      const rolId = Number(req.params.rolId);
      const moduloId = Number(req.params.moduloId);
      const resultado = await ModulosService.asignarModulo(rolId, moduloId);
      res.json({ success: true, data: resultado });
    } catch (error) {
      res.status(500).json({ success: false, error: "Error al asignar módulo" });
    }
  }
);

/**
 * DELETE /api/modulos/rol/:rolId/:moduloId
 * Quitar un módulo de un rol
 */
router.delete(
  "/rol/:rolId/:moduloId",
  authMiddleware,
  roleMiddleware([1]),
  async (req: Request, res: Response) => {
    try {
      const rolId = Number(req.params.rolId);
      const moduloId = Number(req.params.moduloId);
      const ok = await ModulosService.removerModulo(rolId, moduloId);
      if (!ok) {
        res.status(404).json({ success: false, error: "Asignación no encontrada" });
        return;
      }
      res.json({ success: true, message: "Módulo removido del rol" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Error al remover módulo" });
    }
  }
);

export default router;
