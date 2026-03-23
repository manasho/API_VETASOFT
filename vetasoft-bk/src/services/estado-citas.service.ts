/**
 * Estado Citas Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class EstadoCitasService {
  static async findAll(filters: { activo?: boolean | null }) {
    const estados = await sql`
      SELECT estado_id, estado_nombre, descripcion, activo
      FROM estado_citas
      WHERE (${filters.activo}::boolean IS NULL OR activo = ${filters.activo}::boolean)
      ORDER BY estado_nombre ASC
    `;
    return estados;
  }

  static async findById(id: number) {
    const estado = await sql`
      SELECT estado_id, estado_nombre, descripcion, activo
      FROM estado_citas WHERE estado_id = ${id}
    `;
    return estado[0] || null;
  }
}


