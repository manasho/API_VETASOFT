/**
 * Clientes Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class ClientesService {
  /**
   * Obtener todos los clientes activos
   */
  static async findAll() {
    const clientes = await sql`
      SELECT 
        c.*,
        u.nombre as empleado_nombre,
        COUNT(a.animal_id) as total_animales
      FROM clientes c
      LEFT JOIN usuarios u ON c.empleado_id = u.usuario_id
      LEFT JOIN animales a ON c.cliente_id = a.cliente_id AND a.activo = true
      WHERE c.activo = true
      GROUP BY c.cliente_id, u.nombre
      ORDER BY c.fecha_registro DESC
    `;
    return clientes;
  }

  /**
   * Crear cliente
   */
  static async create(data: any) {
    const cliente = await sql`
      INSERT INTO clientes (
        nombre, correo, telefono, direccion,
        fecha_nacimiento, documento_id, empleado_id
      ) VALUES (
        ${data.nombre}, ${data.correo}, ${data.telefono}, ${data.direccion},
        ${data.fecha_nacimiento}, ${data.documento_id}, ${data.empleado_id}
      ) RETURNING *
    `;
    return cliente[0];
  }

  /**
   * Obtener cliente por ID con animales
   */
  static async findById(id: string) {
    const clientes = await sql`
      SELECT c.*, u.nombre as empleado_nombre
      FROM clientes c
      LEFT JOIN usuarios u ON c.empleado_id = u.usuario_id
      WHERE c.cliente_id = ${id}
    `;

    if (clientes.length === 0) return null;

    const animales = await sql`
      SELECT a.*, r.nombre_raza, e.nombre_especie
      FROM animales a
      LEFT JOIN razas r ON a.raza_id = r.raza_id
      LEFT JOIN especies e ON r.especie_id = e.especie_id
      WHERE a.cliente_id = ${id} AND a.activo = true
      ORDER BY a.fecha_ingreso DESC
    `;

    return { ...clientes[0], animales };
  }

  /**
   * Actualizar cliente
   */
  static async update(id: string, data: any) {
    const cliente = await sql`
      UPDATE clientes SET
        nombre = COALESCE(${data.nombre}, nombre),
        correo = COALESCE(${data.correo}, correo),
        telefono = COALESCE(${data.telefono}, telefono),
        direccion = COALESCE(${data.direccion}, direccion),
        fecha_nacimiento = COALESCE(${data.fecha_nacimiento}, fecha_nacimiento),
        documento_id = COALESCE(${data.documento_id}, documento_id)
      WHERE cliente_id = ${id}
      RETURNING *
    `;
    return cliente[0] || null;
  }

  /**
   * Desactivar cliente (soft delete)
   */
  static async deactivate(id: string) {
    const cliente = await sql`
      UPDATE clientes SET activo = false
      WHERE cliente_id = ${id}
      RETURNING *
    `;
    return cliente[0] || null;
  }
}
