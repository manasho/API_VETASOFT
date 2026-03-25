/**
 * Citas Service - Express
 */

import { sql } from "../lib/db.js";

export class CitasService {
  /**
   * Obtener todas las citas con filtros
   */
  static async findAll(filters: {
    veterinario_id?: string | null;
    estado_id?: string | null;
    fecha_inicio?: string | null;
    fecha_fin?: string | null;
  }) {
    const citas = await sql`
      SELECT 
        c.*,
        a.nombre as animal_nombre,
        cl.nombre as cliente_nombre,
        cl.telefono as cliente_telefono,
        u.nombre as veterinario_nombre,
        ec.estado_nombre
      FROM citas c
      LEFT JOIN animales a ON c.animal_id = a.animal_id
      LEFT JOIN clientes cl ON a.cliente_id = cl.cliente_id
      LEFT JOIN veterinarios v ON c.veterinario_id = v.veterinario_id
      LEFT JOIN usuarios u ON v.usuario_id = u.usuario_id
      LEFT JOIN estado_citas ec ON c.estado_id = ec.estado_id
      WHERE (${filters.veterinario_id}::int IS NULL OR c.veterinario_id = ${filters.veterinario_id}::int)
        AND (${filters.estado_id}::int IS NULL OR c.estado_id = ${filters.estado_id}::int)
        AND (${filters.fecha_inicio}::date IS NULL OR c.fecha_cita >= ${filters.fecha_inicio}::date)
        AND (${filters.fecha_fin}::date IS NULL OR c.fecha_cita <= ${filters.fecha_fin}::date)
      ORDER BY c.fecha_cita DESC
    `;
    return citas;
  }

  /**
   * Obtener cita por ID
   */
  static async findById(id: number) {
    const cita = await sql`
      SELECT 
        c.*,
        a.nombre as animal_nombre,
        a.edad as animal_edad,
        a.peso as animal_peso,
        cl.nombre as cliente_nombre,
        cl.telefono as cliente_telefono,
        cl.correo as cliente_correo,
        u.nombre as veterinario_nombre,
        ec.estado_nombre,
        r.nombre_raza,
        e.nombre_especie
      FROM citas c
      LEFT JOIN animales a ON c.animal_id = a.animal_id
      LEFT JOIN clientes cl ON a.cliente_id = cl.cliente_id
      LEFT JOIN razas r ON a.raza_id = r.raza_id
      LEFT JOIN especies e ON r.especie_id = e.especie_id
      LEFT JOIN veterinarios v ON c.veterinario_id = v.veterinario_id
      LEFT JOIN usuarios u ON v.usuario_id = u.usuario_id
      LEFT JOIN estado_citas ec ON c.estado_id = ec.estado_id
      WHERE c.cita_id = ${id}
    `;
    return cita.length > 0 ? cita[0] : null;
  }

  /**
   * Crear cita
   */
  static async create(data: any) {
    const result = await sql`
      INSERT INTO citas (
        animal_id, veterinario_id, fecha_cita,
        motivo, estado_id, observaciones, fecha_creacion, creado_por
      ) VALUES (
        ${data.animal_id}, 
        ${data.veterinario_id}, 
        ${data.fecha_cita}, 
        ${data.motivo || null}, 
        ${data.estado_id}, 
        ${data.observaciones || null}, 
        NOW(),
        ${data.creado_por}
      ) RETURNING *
    `;
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Actualizar cita
   */
  static async update(id: number, data: any) {
    const updatedCita = await sql`
      UPDATE citas SET
        fecha_cita = COALESCE(${data.fecha_cita}, fecha_cita),
        motivo = COALESCE(${data.motivo}, motivo),
        estado_id = COALESCE(${data.estado_id}, estado_id),
        observaciones = COALESCE(${data.observaciones}, observaciones)
      WHERE cita_id = ${id}
      RETURNING *
    `;
    return updatedCita.length > 0 ? updatedCita[0] : null;
  }

  /**
   * Cancelar cita (soft delete)
   */
  static async delete(id: number) {
    const cancelledCita = await sql`
      UPDATE citas 
      SET observaciones = CONCAT(COALESCE(observaciones, ''), ' [CANCELADA]')
      WHERE cita_id = ${id}
      RETURNING *
    `;
    return cancelledCita.length > 0 ? cancelledCita[0] : null;
  }
}
