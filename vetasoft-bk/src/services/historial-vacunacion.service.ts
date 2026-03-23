/**
 * Historial Vacunacion Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class HistorialVacunacionService {
  static async findAll(animal_id: string | null) {
    if (animal_id) {
      return await sql`
        SELECT hv.*, a.nombre as animal_nombre, v.nombre as vacuna_nombre,
               v.intervalo_meses, u.nombre as veterinario_nombre, e.nombre_especie
        FROM historial_vacunacion hv
        LEFT JOIN animales a ON hv.animal_id = a.animal_id
        LEFT JOIN vacunas v ON hv.vacuna_id = v.vacuna_id
        LEFT JOIN especies e ON v.especie_id = e.especie_id
        LEFT JOIN veterinarios vet ON hv.veterinario_id = vet.veterinario_id
        LEFT JOIN usuarios u ON vet.usuario_id = u.usuario_id
        WHERE hv.animal_id = ${animal_id}
        ORDER BY hv.fecha_vacunacion DESC
      `;
    } else {
      return await sql`
        SELECT hv.*, a.nombre as animal_nombre, v.nombre as vacuna_nombre,
               v.intervalo_meses, u.nombre as veterinario_nombre, e.nombre_especie
        FROM historial_vacunacion hv
        LEFT JOIN animales a ON hv.animal_id = a.animal_id
        LEFT JOIN vacunas v ON hv.vacuna_id = v.vacuna_id
        LEFT JOIN especies e ON v.especie_id = e.especie_id
        LEFT JOIN veterinarios vet ON hv.veterinario_id = vet.veterinario_id
        LEFT JOIN usuarios u ON vet.usuario_id = u.usuario_id
        ORDER BY hv.fecha_vacunacion DESC
      `;
    }
  }

  static async findById(id: string) {
    const result = await sql`
      SELECT hv.*, a.nombre as animal_nombre, v.nombre as vacuna_nombre,
             v.intervalo_meses, u.nombre as veterinario_nombre, e.nombre_especie
      FROM historial_vacunacion hv
      LEFT JOIN animales a ON hv.animal_id = a.animal_id
      LEFT JOIN vacunas v ON hv.vacuna_id = v.vacuna_id
      LEFT JOIN especies e ON v.especie_id = e.especie_id
      LEFT JOIN veterinarios vet ON hv.veterinario_id = vet.veterinario_id
      LEFT JOIN usuarios u ON vet.usuario_id = u.usuario_id
      WHERE hv.vacunacion_id = ${id}
    `;
    return result[0] || null;
  }

  static async create(data: any) {
    const result = await sql`
      INSERT INTO historial_vacunacion (
        animal_id, vacuna_id, veterinario_id, fecha_vacunacion,
        lote_vacuna, proxima_vacuna, observaciones, fecha_registro
      ) VALUES (
        ${data.animal_id}, 
        ${data.vacuna_id}, 
        ${data.veterinario_id}, 
        ${data.fecha_vacunacion},
        ${data.lote_vacuna},
        ${data.proxima_vacuna || null},
        ${data.observaciones || null},
        NOW()
      )
      RETURNING *
    `;
    return result[0];
  }
}
