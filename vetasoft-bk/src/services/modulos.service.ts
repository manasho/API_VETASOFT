/**
 * Modulos Service
 * Maneja los módulos visibles por rol (RBAC)
 */

import { sql } from "../lib/db.js";

export class ModulosService {
  /**
   * Obtener módulos activos para un rol específico
   */
  static async getModulosByRol(rolId: number) {
    return await sql`
      SELECT m.modulo_id, m.nombre, m.icono, m.ruta, m.descripcion
      FROM modulos m
      INNER JOIN roles_modulos rm ON m.modulo_id = rm.modulo_id
      WHERE rm.rol_id = ${rolId}
        AND m.activo = true
      ORDER BY m.modulo_id
    `;
  }

  /**
   * Obtener todos los módulos (para administración)
   */
  static async getAllModulos() {
    return await sql`
      SELECT * FROM modulos ORDER BY modulo_id
    `;
  }

  /**
   * Obtener módulos con info de qué roles los tienen
   */
  static async getModulosConRoles() {
    return await sql`
      SELECT 
        m.*, 
        COALESCE(
          json_agg(
            json_build_object('rol_id', r.rol_id, 'nombre_rol', r.nombre_rol)
          ) FILTER (WHERE r.rol_id IS NOT NULL),
          '[]'
        ) as roles
      FROM modulos m
      LEFT JOIN roles_modulos rm ON m.modulo_id = rm.modulo_id
      LEFT JOIN roles_usuario r ON rm.rol_id = r.rol_id
      GROUP BY m.modulo_id
      ORDER BY m.modulo_id
    `;
  }

  /**
   * Asignar módulo a un rol
   */
  static async asignarModulo(rolId: number, moduloId: number) {
    const existente = await sql`
      SELECT 1 FROM roles_modulos WHERE rol_id = ${rolId} AND modulo_id = ${moduloId}
    `;
    if (existente.length > 0) {
      return { ya_existe: true };
    }
    await sql`
      INSERT INTO roles_modulos (rol_id, modulo_id)
      VALUES (${rolId}, ${moduloId})
    `;
    return { asignado: true };
  }

  /**
   * Quitar módulo de un rol
   */
  static async removerModulo(rolId: number, moduloId: number) {
    const result = await sql`
      DELETE FROM roles_modulos
      WHERE rol_id = ${rolId} AND modulo_id = ${moduloId}
      RETURNING *
    `;
    return result.length > 0;
  }

  /**
   * Crear un nuevo módulo
   */
  static async crear(data: {
    nombre: string;
    icono?: string;
    ruta?: string;
    descripcion?: string;
  }) {
    const result = await sql`
      INSERT INTO modulos (nombre, icono, ruta, descripcion)
      VALUES (${data.nombre}, ${data.icono || null}, ${data.ruta || null}, ${data.descripcion || null})
      RETURNING *
    `;
    return result[0];
  }
}
