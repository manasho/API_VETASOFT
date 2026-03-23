/**
 * Vacunas Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class VacunasService {
  static async findAll(especie_id: string | null) {
    if (especie_id) {
      return await sql`
        SELECT v.*, e.nombre_especie
        FROM vacunas v
        LEFT JOIN especies e ON v.especie_id = e.especie_id
        WHERE v.activo = true AND v.especie_id = ${especie_id}
        ORDER BY e.nombre_especie, v.nombre
      `;
    } else {
      return await sql`
        SELECT v.*, e.nombre_especie
        FROM vacunas v
        LEFT JOIN especies e ON v.especie_id = e.especie_id
        WHERE v.activo = true
        ORDER BY e.nombre_especie, v.nombre
      `;
    }
  }

  static async findById(id: string) {
    const vacunas = await sql`
      SELECT v.*, e.nombre_especie
      FROM vacunas v
      LEFT JOIN especies e ON v.especie_id = e.especie_id
      WHERE v.vacuna_id = ${id}
    `;
    return vacunas.length > 0 ? vacunas[0] : null;
  }

  static async create(data: any) {
    const result = await sql`
      INSERT INTO vacunas (
        nombre, descripcion, edad_minima_meses, intervalo_meses, 
        activo, especie_id, fecha_creacion
      ) VALUES (
        ${data.nombre}, 
        ${data.descripcion || null}, 
        ${data.edad_minima_meses}, 
        ${data.intervalo_meses}, 
        true, 
        ${data.especie_id},
        NOW()
      )
      RETURNING *
    `;
    return result[0];
  }

  static async update(id: string, data: any) {
    const result = await sql`
      UPDATE vacunas SET
        nombre = COALESCE(${data.nombre}, nombre),
        descripcion = COALESCE(${data.descripcion}, descripcion),
        edad_minima_meses = COALESCE(${data.edad_minima_meses}, edad_minima_meses),
        intervalo_meses = COALESCE(${data.intervalo_meses}, intervalo_meses),
        especie_id = COALESCE(${data.especie_id}, especie_id)
      WHERE vacuna_id = ${id}
      RETURNING *
    `;
    return result[0] || null;
  }

  static async delete(id: string) {
    const result = await sql`
      UPDATE vacunas SET activo = false WHERE vacuna_id = ${id} RETURNING *
    `;
    return result[0] || null;
  }
}
