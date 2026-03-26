/**
 * Veterinarios Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class VeterinariosService {
  static async findAll() {
    const veterinarios = await sql`
      SELECT v.*, u.nombre as nombre_completo, u.correo, u.telefono
      FROM veterinarios v
      LEFT JOIN usuarios u ON v.usuario_id = u.usuario_id
      WHERE v.activo = true
      ORDER BY u.nombre
    `;
    return veterinarios;
  }

  static async findById(id: string) {
    const veterinarios = await sql`
      SELECT v.*, u.nombre as nombre_completo, u.correo, u.telefono
      FROM veterinarios v
      LEFT JOIN usuarios u ON v.usuario_id = u.usuario_id
      WHERE v.veterinario_id = ${id}
    `;
    return veterinarios.length > 0 ? veterinarios[0] : null;
  }

  static async create(data: any) {
    const result = await sql`
      INSERT INTO veterinarios (usuario_id, numero_licencia, especialidad, fecha_contratacion, horario_inicio, horario_fin)
      VALUES (${data.usuario_id}, ${data.numero_licencia || null}, ${
      data.especialidad || null
    }, ${data.fecha_contratacion || null}, ${data.horario_inicio || null}, ${data.horario_fin || null})
      RETURNING *
    `;
    return result[0];
  }

  static async update(id: string, data: any) {
    const result = await sql`
      UPDATE veterinarios SET
        usuario_id = COALESCE(${data.usuario_id}, usuario_id),
        numero_licencia = COALESCE(${data.numero_licencia}, numero_licencia),
        especialidad = COALESCE(${data.especialidad}, especialidad),
        fecha_contratacion = COALESCE(${data.fecha_contratacion}, fecha_contratacion),
        horario_inicio = COALESCE(${data.horario_inicio}, horario_inicio),
        horario_fin = COALESCE(${data.horario_fin}, horario_fin)
      WHERE veterinario_id = ${id}
      RETURNING *
    `;
    return result[0] || null;
  }

  static async delete(id: string) {
    const result = await sql`
      UPDATE veterinarios SET activo = false WHERE veterinario_id = ${id} RETURNING *
    `;
    return result[0] || null;
  }
}
