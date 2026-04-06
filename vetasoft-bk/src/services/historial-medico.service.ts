/**
 * Historial Medico Service - Express
 */

import { sql } from "../lib/db.js";

export class HistorialMedicoService {
  static async findAll(filters: {
    animal_id?: string | null;
    veterinario_id?: string | null;
    cliente_id?: number | null;
  }) {
    const historial = await sql`
      SELECT 
        h.*,
        a.nombre as animal_nombre,
        cl.nombre as cliente_nombre,
        u.nombre as veterinario_nombre
      FROM historial_medico h
      LEFT JOIN citas c ON h.cita_id = c.cita_id
      LEFT JOIN animales a ON c.animal_id = a.animal_id
      LEFT JOIN clientes cl ON a.cliente_id = cl.cliente_id
      LEFT JOIN veterinarios v ON c.veterinario_id = v.veterinario_id
      LEFT JOIN usuarios u ON v.usuario_id = u.usuario_id
      WHERE (${filters.animal_id}::int IS NULL OR c.animal_id = ${filters.animal_id}::int)
        AND (${filters.veterinario_id}::int IS NULL OR c.veterinario_id = ${filters.veterinario_id}::int)
        AND (${filters.cliente_id ?? null}::int IS NULL OR a.cliente_id = ${filters.cliente_id ?? null}::int)
      ORDER BY h.fecha_creacion DESC
    `;
    return historial;
  }

  static async findById(id: string) {
    const result = await sql`
      SELECT 
        h.*,
        a.nombre as animal_nombre,
        cl.nombre as cliente_nombre,
        u.nombre as veterinario_nombre,
        r.nombre_raza,
        e.nombre_especie
      FROM historial_medico h
      LEFT JOIN citas c ON h.cita_id = c.cita_id
      LEFT JOIN animales a ON c.animal_id = a.animal_id
      LEFT JOIN clientes cl ON a.cliente_id = cl.cliente_id
      LEFT JOIN razas r ON a.raza_id = r.raza_id
      LEFT JOIN especies e ON r.especie_id = e.especie_id
      LEFT JOIN veterinarios v ON c.veterinario_id = v.veterinario_id
      LEFT JOIN usuarios u ON v.usuario_id = u.usuario_id
      WHERE h.historial_id = ${id}
    `;
    return result[0] || null;
  }

  static async create(data: any) {
    const result = await sql`
      INSERT INTO historial_medico (
        cita_id,
        sintomas,
        diagnostico,
        tratamiento,
        examenes_realizados,
        medicamentos,
        proxima_cita,
        observaciones,
        peso,
        temperatura,
        frecuencia_cardiaca,
        frecuencia_respiratoria,
        fecha_creacion
      ) VALUES (
        ${data.cita_id},
        ${data.sintomas || null},
        ${data.diagnostico},
        ${data.tratamiento},
        ${data.examenes_realizados || null},
        ${data.medicamentos || null},
        ${data.proxima_cita || null},
        ${data.observaciones || null},
        ${data.peso || null},
        ${data.temperatura || null},
        ${data.frecuencia_cardiaca || null},
        ${data.frecuencia_respiratoria || null},
        NOW()
      )
      RETURNING *
    `;
    return result[0];
  }
}
