/**
 * Notificaciones Routes - Express
 * Campana de notificaciones
 */

import { Router, Request, Response } from "express";
import { NotificacionesService } from "../services/notificaciones.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * GET /api/notificaciones
 * Retorna las notificaciones del usuario autenticado.
 * Query param: ?soloNoLeidas=true  para filtrar solo no leídas
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const soloNoLeidas = req.query.soloNoLeidas === "true";
    const notificaciones = await NotificacionesService.getNotificaciones(
      userId,
      soloNoLeidas
    );
    res.json({ success: true, data: notificaciones });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener notificaciones" });
  }
});

/**
 * GET /api/notificaciones/contador
 * Retorna { count: N } — se usa para el badge rojo de la campana
 */
router.get("/contador", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const count = await NotificacionesService.contarNoLeidas(userId);
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al contar notificaciones" });
  }
});

/**
 * PATCH /api/notificaciones/leer-todas
 * Marca todas las notificaciones del usuario como leídas
 */
router.patch("/leer-todas", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const cantidad = await NotificacionesService.marcarTodasLeidas(userId);
    res.json({
      success: true,
      message: `${cantidad} notificaciones marcadas como leídas`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al marcar notificaciones" });
  }
});

/**
 * PATCH /api/notificaciones/:id/leer
 * Marca una notificación específica como leída
 */
router.patch("/:id/leer", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const notificacionId = Number(req.params.id);
    const notificacion = await NotificacionesService.marcarLeida(
      notificacionId,
      userId
    );
    if (!notificacion) {
      res.status(404).json({ success: false, error: "Notificación no encontrada" });
      return;
    }
    res.json({ success: true, data: notificacion });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al marcar notificación" });
  }
});

/**
 * DELETE /api/notificaciones/:id
 * Elimina una notificación del usuario
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const notificacionId = Number(req.params.id);
    const eliminada = await NotificacionesService.eliminar(notificacionId, userId);
    if (!eliminada) {
      res.status(404).json({ success: false, error: "Notificación no encontrada" });
      return;
    }
    res.json({ success: true, message: "Notificación eliminada" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al eliminar notificación" });
  }
});

export default router;
