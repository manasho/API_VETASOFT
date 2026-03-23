/**
 * Campanas Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class CampanasService {
  static async findAll(activo: string | null) {
    if (activo !== null) {
      const activoBool = activo === "true";
      return await sql`
        SELECT c.*, u.nombre as creado_por_nombre, COUNT(d.donacion_id) as total_donaciones
        FROM campana_donacion c
        LEFT JOIN usuarios u ON c.creado_por = u.usuario_id
        LEFT JOIN donaciones d ON c.campana_id = d.campana_id
        WHERE c.activo = ${activoBool}
        GROUP BY c.campana_id, u.nombre
        ORDER BY c.fecha_inicio DESC
      `;
    } else {
      return await sql`
        SELECT c.*, u.nombre as creado_por_nombre, COUNT(d.donacion_id) as total_donaciones
        FROM campana_donacion c
        LEFT JOIN usuarios u ON c.creado_por = u.usuario_id
        LEFT JOIN donaciones d ON c.campana_id = d.campana_id
        GROUP BY c.campana_id, u.nombre
        ORDER BY c.fecha_inicio DESC
      `;
    }
  }

  static async findById(id: string) {
    const result = await sql`
      SELECT c.*, u.nombre as creado_por_nombre, COUNT(d.donacion_id) as total_donaciones
      FROM campana_donacion c
      LEFT JOIN usuarios u ON c.creado_por = u.usuario_id
      LEFT JOIN donaciones d ON c.campana_id = d.campana_id
      WHERE c.campana_id = ${id}
      GROUP BY c.campana_id, u.nombre
    `;
    return result[0] || null;
  }

  static async create(data: any) {
    const result = await sql`
      INSERT INTO campana_donacion (nombre, descripcion, meta_monto, fecha_inicio, fecha_fin, creado_por)
      VALUES (${data.nombre}, ${data.descripcion}, ${data.meta_monto}, ${data.fecha_inicio}, ${data.fecha_fin}, ${data.creado_por})
      RETURNING *
    `;
    return result[0];
  }

  static async update(id: string, data: any) {
    const result = await sql`
      UPDATE campana_donacion SET
        nombre = COALESCE(${data.nombre}, nombre),
        descripcion = COALESCE(${data.descripcion}, descripcion),
        meta_monto = COALESCE(${data.meta_monto}, meta_monto),
        fecha_inicio = COALESCE(${data.fecha_inicio}, fecha_inicio),
        fecha_fin = COALESCE(${data.fecha_fin}, fecha_fin)
      WHERE campana_id = ${id}
      RETURNING *
    `;
    return result[0] || null;
  }

  static async delete(id: string) {
    const result = await sql`
      UPDATE campana_donacion SET activo = false WHERE campana_id = ${id} RETURNING *
    `;
    return result[0] || null;
  }
}
