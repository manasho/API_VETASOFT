/**
 * Solicitudes Adopcion Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class SolicitudesAdopcionService {
  static async findAll(filters: {
    estado_id?: number | null;
    animal_id?: number | null;
    usuario_id?: number | null;
  }) {
    const solicitudes = await sql`
      SELECT s.*, a.nombre as animal_nombre, a.edad as animal_edad,
             r.nombre_raza, e.nombre_especie, ea.nombre as estado_nombre, u.nombre as respondido_por_nombre
      FROM solicitudes_adopcion s
      LEFT JOIN animales a ON s.animal_id = a.animal_id
      LEFT JOIN razas r ON a.raza_id = r.raza_id
      LEFT JOIN especies e ON r.especie_id = e.especie_id
      LEFT JOIN estado_adopcion ea ON s.estado_id = ea.estado_id
      LEFT JOIN usuarios u ON s.respondido_por = u.usuario_id
      WHERE (${filters.estado_id}::int IS NULL OR s.estado_id = ${filters.estado_id}::int)
        AND (${filters.animal_id}::int IS NULL OR s.animal_id = ${filters.animal_id}::int)
        AND (${filters.usuario_id}::int IS NULL OR s.usuario_id = ${filters.usuario_id}::int)
      ORDER BY s.fecha_solicitud DESC
    `;
    return solicitudes;
  }

  static async findById(id: string) {
    const solicitudes = await sql`
      SELECT s.*, a.nombre as animal_nombre, a.edad as animal_edad,
             r.nombre_raza, e.nombre_especie, ea.nombre as estado_nombre, u.nombre as respondido_por_nombre
      FROM solicitudes_adopcion s
      LEFT JOIN animales a ON s.animal_id = a.animal_id
      LEFT JOIN razas r ON a.raza_id = r.raza_id
      LEFT JOIN especies e ON r.especie_id = e.especie_id
      LEFT JOIN estado_adopcion ea ON s.estado_id = ea.estado_id
      LEFT JOIN usuarios u ON s.respondido_por = u.usuario_id
      WHERE s.solicitud_id = ${id}
    `;
    return solicitudes[0] || null;
  }

  static async create(data: any) {
    const result = await sql`
      INSERT INTO solicitudes_adopcion (animal_id, nombre_solicitante, correo_solicitante, 
        telefono_solicitante, direccion_solicitante, experiencia_animales, motivo, estado_id, usuario_id)
      VALUES (${data.animal_id}, ${data.nombre_solicitante}, ${
      data.correo_solicitante
    },
        ${data.telefono_solicitante}, ${data.direccion_solicitante}, ${
      data.experiencia_animales
    }, 
        ${data.motivo}, ${data.estado_id || 1}, ${data.usuario_id || null})
      RETURNING *
    `;
    return result[0];
  }

  static async updateEstado(
    id: string,
    data: {
      estado_id: number;
      respondido_por: number;
      observacion_respuesta?: string;
    }
  ) {
    const result = await sql`
      UPDATE solicitudes_adopcion SET
        estado_id = ${data.estado_id},
        respondido_por = ${data.respondido_por},
        observacion_respuesta = COALESCE(${data.observacion_respuesta}, observacion_respuesta),
        fecha_respuesta = CURRENT_TIMESTAMP
      WHERE solicitud_id = ${id}
      RETURNING *
    `;
    return result[0] || null;
  }

  static async delete(id: string) {
    const result =
      await sql`DELETE FROM solicitudes_adopcion WHERE solicitud_id = ${id} RETURNING *`;
    return result[0] || null;
  }
}
