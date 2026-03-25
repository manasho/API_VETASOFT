/**
 * Notificaciones Service
 * Campana de notificaciones por usuario
 */

import { sql } from "../lib/db.js";

export class NotificacionesService {
  /**
   * Obtener notificaciones de un usuario
   */
  static async getNotificaciones(userId: number, soloNoLeidas: boolean = false) {
    if (soloNoLeidas) {
      return await sql`
        SELECT *
        FROM notificaciones
        WHERE usuario_id = ${userId} AND leida = false
        ORDER BY fecha_creacion DESC
        LIMIT 50
      `;
    }
    return await sql`
      SELECT *
      FROM notificaciones
      WHERE usuario_id = ${userId}
      ORDER BY fecha_creacion DESC
      LIMIT 50
    `;
  }

  /**
   * Contar notificaciones no leídas (para el badge)
   */
  static async contarNoLeidas(userId: number) {
    const result = await sql`
      SELECT COUNT(*) as total
      FROM notificaciones
      WHERE usuario_id = ${userId} AND leida = false
    `;
    return Number(result[0].total);
  }

  /**
   * Marcar una notificación como leída
   */
  static async marcarLeida(notificacionId: number, userId: number) {
    const result = await sql`
      UPDATE notificaciones
      SET leida = true, fecha_lectura = NOW()
      WHERE notificacion_id = ${notificacionId} AND usuario_id = ${userId}
      RETURNING *
    `;
    return result[0] || null;
  }

  /**
   * Marcar todas las notificaciones del usuario como leídas
   */
  static async marcarTodasLeidas(userId: number) {
    const result = await sql`
      UPDATE notificaciones
      SET leida = true, fecha_lectura = NOW()
      WHERE usuario_id = ${userId} AND leida = false
      RETURNING notificacion_id
    `;
    return result.length;
  }

  /**
   * Crear una notificación (uso interno del backend)
   */
  static async crear(data: {
    usuario_id: number;
    titulo: string;
    mensaje: string;
    tipo?: "info" | "alerta" | "exito" | "error";
    url_accion?: string;
  }) {
    const result = await sql`
      INSERT INTO notificaciones (usuario_id, titulo, mensaje, tipo, url_accion)
      VALUES (
        ${data.usuario_id},
        ${data.titulo},
        ${data.mensaje},
        ${data.tipo || "info"},
        ${data.url_accion || null}
      )
      RETURNING *
    `;
    return result[0];
  }

  /**
   * Eliminar una notificación
   */
  static async eliminar(notificacionId: number, userId: number) {
    const result = await sql`
      DELETE FROM notificaciones
      WHERE notificacion_id = ${notificacionId} AND usuario_id = ${userId}
      RETURNING *
    `;
    return result[0] || null;
  }
}
