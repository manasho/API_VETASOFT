/**
 * Animales Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class AnimalesService {
  /**
   * Obtener todos los animales con filtros
   */
  static async findAll(filters: {
    cliente_id?: number | null;
    estado?: string | null;
  }) {
    const animales = await sql`
      SELECT 
        a.*,
        c.nombre as cliente_nombre,
        c.documento_id as cliente_documento,
        r.nombre_raza,
        e.nombre_especie
      FROM animales a
      LEFT JOIN clientes c ON a.cliente_id = c.cliente_id
      LEFT JOIN razas r ON a.raza_id = r.raza_id
      LEFT JOIN especies e ON r.especie_id = e.especie_id
      WHERE (${filters.cliente_id}::int IS NULL OR a.cliente_id = ${filters.cliente_id}::int)
        AND (${filters.estado}::text IS NULL OR a.estado::text = ${filters.estado}::text)
      ORDER BY a.fecha_ingreso DESC
    `;
    return animales;
  }

  /**
   * Obtener animal por ID con historial
   */
  static async findById(id: string) {
    const animals = await sql`
      SELECT 
        a.*,
        c.nombre as cliente_nombre,
        c.telefono as cliente_telefono,
        c.correo as cliente_correo,
        r.nombre_raza,
        e.nombre_especie
      FROM animales a
      LEFT JOIN clientes c ON a.cliente_id = c.cliente_id
      LEFT JOIN razas r ON a.raza_id = r.raza_id
      LEFT JOIN especies e ON r.especie_id = e.especie_id
      WHERE a.animal_id = ${id}
    `;

    if (animals.length === 0) return null;

    const historial = await sql`
      SELECT h.*, u.nombre as veterinario_nombre
      FROM historial_medico h
      LEFT JOIN citas c ON h.cita_id = c.cita_id
      LEFT JOIN veterinarios vet ON c.veterinario_id = vet.veterinario_id
      LEFT JOIN usuarios u ON vet.usuario_id = u.usuario_id
      WHERE c.animal_id = ${id}
      ORDER BY h.fecha_creacion DESC LIMIT 10
    `;

    const vacunas = await sql`
      SELECT hv.*, v.nombre as vacuna_nombre, u.nombre as veterinario_nombre
      FROM historial_vacunacion hv
      LEFT JOIN vacunas v ON hv.vacuna_id = v.vacuna_id
      LEFT JOIN veterinarios vet ON hv.veterinario_id = vet.veterinario_id
      LEFT JOIN usuarios u ON vet.usuario_id = u.usuario_id
      WHERE hv.animal_id = ${id}
      ORDER BY hv.fecha_vacunacion DESC LIMIT 10
    `;

    return {
      ...animals[0],
      historial_medico: historial,
      historial_vacunacion: vacunas,
    };
  }

  /**
   * Crear animal
   */
  static async create(data: any) {
    const result = await sql`
      INSERT INTO animales (
        nombre, raza_id, cliente_id, edad, fecha_nacimiento, 
        peso, sexo, descripcion, estado, fecha_ingreso
      ) VALUES (
        ${data.nombre}, 
        ${data.raza_id}, 
        ${data.cliente_id || null}, 
        ${data.edad || 0}, 
        ${data.fecha_nacimiento || null}, 
        ${data.peso || null}, 
        ${data.sexo}, 
        ${data.descripcion || ""}, 
        ${data.estado || "Animales"}, 
        NOW()
      )
      RETURNING *
    `;
    return result[0];
  }

  static async update(id: string, data: any) {
    const result = await sql`
      UPDATE animales SET
        nombre = COALESCE(${data.nombre}, nombre),
        raza_id = COALESCE(${data.raza_id}, raza_id),
        cliente_id = COALESCE(${data.cliente_id}, cliente_id),
        fecha_nacimiento = COALESCE(${data.fecha_nacimiento}, fecha_nacimiento),
        sexo = COALESCE(${data.sexo}, sexo),
        estado = COALESCE(${data.estado}, estado),
        descripcion = COALESCE(${data.descripcion}, descripcion)
      WHERE animal_id = ${id}
      RETURNING *
    `;
    return result[0] || null;
  }

  /**
   * Desactivar animal (soft delete)
   */
  static async delete(id: string) {
    const result = await sql`
      UPDATE animales SET activo = false
      WHERE animal_id = ${id}
      RETURNING *
    `;
    return result[0] || null;
  }
}
