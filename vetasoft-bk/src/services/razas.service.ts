/**
 * Razas Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class RazasService {
  static async findAll(filters: { especie_id?: number | null }) {
    const razas = await sql`
      SELECT r.raza_id, r.nombre_raza, r.descripcion, r.especie_id, e.nombre_especie
      FROM razas r
      LEFT JOIN especies e ON r.especie_id = e.especie_id
      WHERE r.activo = true
        AND (${filters.especie_id}::int IS NULL OR r.especie_id = ${filters.especie_id}::int)
      ORDER BY e.nombre_especie ASC, r.nombre_raza ASC
    `;
    return razas;
  }

  static async findById(id: string) {
    const raza = await sql`
      SELECT r.raza_id, r.nombre_raza, r.descripcion, r.especie_id, e.nombre_especie
      FROM razas r
      LEFT JOIN especies e ON r.especie_id = e.especie_id
      WHERE r.raza_id = ${id}::int
    `;
    return raza.length > 0 ? raza[0] : null;
  }

  static async create(data: any) {
    const raza = await sql`
      INSERT INTO razas (nombre_raza, descripcion, especie_id)
      VALUES (${data.nombre_raza}, ${data.descripcion || null}, ${
      data.especie_id
    })
      RETURNING *
    `;
    return raza[0];
  }

  static async update(id: string, data: any) {
    const updated = await sql`
      UPDATE razas SET
        nombre_raza = COALESCE(${data.nombre_raza}, nombre_raza),
        descripcion = COALESCE(${data.descripcion}, descripcion),
        especie_id = COALESCE(${data.especie_id}, especie_id)
      WHERE raza_id = ${id}::int
      RETURNING *
    `;
    return updated[0] || null;
  }

  static async delete(id: string) {
    const raza = await sql`
      UPDATE razas SET activo = false WHERE raza_id = ${id}::int RETURNING *
    `;
    return raza[0] || null;
  }
}
