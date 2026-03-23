/**
 * Estados Adopcion Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class EstadosAdopcionService {
  static async findAll(filters: { activo?: boolean | null }) {
    const estados = await sql`
      SELECT estado_id, nombre, descripcion, activo
      FROM estado_adopcion
      WHERE (${filters.activo}::boolean IS NULL OR activo = ${filters.activo}::boolean)
      ORDER BY nombre ASC
    `;
    return estados;
  }

  static async findById(id: number) {
    const estado = await sql`
      SELECT estado_id, nombre, descripcion, activo
      FROM estado_adopcion WHERE estado_id = ${id}
    `;
    return estado[0] || null;
  }
}
