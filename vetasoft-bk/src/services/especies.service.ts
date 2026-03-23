/**
 * Especies Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class EspeciesService {
  static async findAll() {
    const especies = await sql`
      SELECT e.*, COUNT(r.raza_id) as total_razas
      FROM especies e
      LEFT JOIN razas r ON e.especie_id = r.especie_id AND r.activo = true
      WHERE e.activo = true
      GROUP BY e.especie_id
      ORDER BY e.nombre_especie
    `;
    return especies;
  }

  static async findById(id: string) {
    const especie = await sql`
      SELECT e.*, COUNT(r.raza_id) as total_razas
      FROM especies e
      LEFT JOIN razas r ON e.especie_id = r.especie_id AND r.activo = true
      WHERE e.especie_id = ${id}
      GROUP BY e.especie_id
    `;
    return especie.length > 0 ? especie[0] : null;
  }

  static async create(data: any) {
    const especie = await sql`
      INSERT INTO especies (nombre_especie, descripcion)
      VALUES (${data.nombre_especie}, ${data.descripcion || null})
      RETURNING *
    `;
    return especie[0];
  }

  static async update(id: string, data: any) {
    const especie = await sql`
      UPDATE especies SET
        nombre_especie = COALESCE(${data.nombre_especie}, nombre_especie),
        descripcion = COALESCE(${data.descripcion}, descripcion)
      WHERE especie_id = ${id}
      RETURNING *
    `;
    return especie[0] || null;
  }

  static async delete(id: string) {
    const especie = await sql`
      UPDATE especies SET activo = false WHERE especie_id = ${id} RETURNING *
    `;
    return especie[0] || null;
  }
}
