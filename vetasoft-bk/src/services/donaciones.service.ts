/**
 * Donaciones Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class DonacionesService {
  static async findAll(campana_id: number | null = null) {
    if (campana_id) {
      return await sql`
        SELECT d.*, c.nombre as campana_nombre
        FROM donaciones d
        LEFT JOIN campana_donacion c ON d.campana_id = c.campana_id
        WHERE d.campana_id = ${campana_id}
        ORDER BY d.fecha_donacion DESC
      `;
    } else {
      return await sql`
        SELECT d.*, c.nombre as campana_nombre
        FROM donaciones d
        LEFT JOIN campana_donacion c ON d.campana_id = c.campana_id
        ORDER BY d.fecha_donacion DESC
      `;
    }
  }

  static async findById(id: number) {
    const result = await sql`
      SELECT d.*, c.nombre as campana_nombre
      FROM donaciones d
      LEFT JOIN campana_donacion c ON d.campana_id = c.campana_id
      WHERE d.donacion_id = ${id}
    `;
    return result[0] || null;
  }

  static async create(data: any) {
    const result = await sql`
      INSERT INTO donaciones (campana_id, monto, nombre_donante, correo_donante, telefono_donante)
      VALUES (${data.campana_id}, ${data.monto}, ${data.nombre_donante}, 
              ${data.correo_donante || null}, ${data.telefono_donante || null})
      RETURNING *
    `;
    return result[0];
  }

  static async update(id: number, data: any) {
    const result = await sql`
      UPDATE donaciones SET
        campana_id = COALESCE(${data.campana_id}, campana_id),
        monto = COALESCE(${data.monto}, monto)
      WHERE donacion_id = ${id}
      RETURNING *
    `;
    return result[0] || null;
  }

  static async delete(id: number) {
    const result =
      await sql`DELETE FROM donaciones WHERE donacion_id = ${id} RETURNING *`;
    return result[0] || null;
  }
}
