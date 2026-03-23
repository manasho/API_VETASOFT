/**
 * Health Routes - Express
 */

import { Router, Request, Response } from "express";
import { checkDatabaseConnection } from "../lib/db.js";

const router = Router();

/**
 * GET /api/health
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const dbConnected = await checkDatabaseConnection();

    res.json({
      success: true,
      data: {
        status: "ok",
        timestamp: new Date().toISOString(),
        database: dbConnected ? "connected" : "disconnected",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Health check failed",
    });
  }
});

export default router;
