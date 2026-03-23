/**
 * Catalogos Routes - Express
 * Endpoints para catálogos (roles, estados, tipos)
 */

import { Router, Request, Response } from "express";
import { RolesService } from "../services/roles.service.js";
import { EstadoCitasService } from "../services/estado-citas.service.js";
import { EstadosAdopcionService } from "../services/estados-adopcion.service.js";
import { TipoConsultaService } from "../services/tipo-consulta.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Roles
router.get("/roles", authMiddleware, async (req: Request, res: Response) => {
  try {
    const roles = await RolesService.findAll();
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener roles" });
  }
});

router.get(
  "/roles/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const role = await RolesService.findById(Number(req.params.id));
      res.json({ success: true, data: role });
    } catch (error) {
      res.status(500).json({ success: false, error: "Error al obtener rol" });
    }
  }
);

// Estado Citas
router.get(
  "/estado-citas",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { activo } = req.query;
      const estados = await EstadoCitasService.findAll({
        activo: activo !== undefined ? activo === "true" : null,
      });
      res.json({ success: true, data: estados });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Error al obtener estados de citas" });
    }
  }
);


router.get(
  "/estado-citas/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const estado = await EstadoCitasService.findById(Number(req.params.id));
      res.json({ success: true, data: estado });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Error al obtener estado de citas" });
    }
  }
);



// Estados Adopcion
router.get(
  "/estados-adopcion",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { activo } = req.query;
      const estados = await EstadosAdopcionService.findAll({
        activo: activo !== undefined ? activo === "true" : null,
      });
      res.json({ success: true, data: estados });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          error: "Error al obtener estados de adopción",
        });
    }
  }
);


router.get(
  "/estados-adopcion/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const estado = await EstadosAdopcionService.findById(Number(req.params.id));
      res.json({ success: true, data: estado });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          error: "Error al obtener estados de adopción",
        });
    }
  }
);

// Tipo Consulta
router.get(
  "/tipo-consulta",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const tipos = await TipoConsultaService.findAll();
      res.json({ success: true, data: tipos });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Error al obtener tipos de consulta" });
    }
  }
);

router.get(
  "/tipo-consulta/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const tipo = await TipoConsultaService.findById(Number(req.params.id));
      res.json({ success: true, data: tipo });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Error al obtener tipo de consulta" });
    }
  }
);

export default router;
