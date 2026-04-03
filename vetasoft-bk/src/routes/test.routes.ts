/**
 * Rutas de prueba - SOLO DESARROLLO
 * Permite ejecutar tareas manuales como los cron jobs desde Postman
 */

import { Router, Request, Response } from 'express';
import { ejecutarRevisionCitas } from '../utils/cronjob.js';

const router = Router();

/**
 * POST /api/test/cron/revision-citas
 * Ejecuta manualmente el cron job de recordatorio de citas
 */
router.post('/cron/revision-citas', async (req: Request, res: Response) => {
    try {
        const resultado = await ejecutarRevisionCitas();
        res.json({
            success: true,
            ejecutado_en: new Date().toISOString(),
            ...resultado,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: String(error),
        });
    }
});

export default router;
