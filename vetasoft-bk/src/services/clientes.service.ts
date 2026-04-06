/**
 * Clientes Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";
import { PasswordUtil } from "../utils/password.util.js";

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

  /**
   * Registro completo: crea Usuario + Cliente en una sola operación.
   * La contraseña por defecto es el documento_id del cliente (hasheado).
   * El cliente podrá cambiarla luego desde el app/web.
   */
  static async registroCompleto(data: {
    nombre: string;
    correo: string;
    documento_id: string;
    telefono?: string;
    direccion?: string;
    fecha_nacimiento?: string;
    empleado_id?: number;
  }) {
    // Verificar que el correo no esté ya registrado
    const existeUsuario = await sql`
      SELECT usuario_id FROM usuarios WHERE correo = ${data.correo}
    `;
    if (existeUsuario.length > 0) {
      throw new Error('El correo ya está registrado en el sistema');
    }

    // Verificar que el documento_id no esté ya registrado
    const existeCliente = await sql`
      SELECT cliente_id FROM clientes WHERE documento_id = ${data.documento_id}
    `;
    if (existeCliente.length > 0) {
      throw new Error('El número de documento ya está registrado');
    }

    // Hashear el documento_id como contraseña por defecto
    const contrasenaPorDefecto = await PasswordUtil.hash(data.documento_id);

    // 1. Crear el usuario con rol Cliente (rol_id = 3)
    const nuevoUsuario = await sql`
      INSERT INTO usuarios (nombre, correo, contrasena, rol_id, activo)
      VALUES (
        ${data.nombre},
        ${data.correo},
        ${contrasenaPorDefecto},
        3,
        true
      )
      RETURNING usuario_id, nombre, correo, rol_id
    `;
    const usuario = nuevoUsuario[0];

    // 2. Crear el cliente vinculado al usuario
    const nuevoCliente = await sql`
      INSERT INTO clientes (
        nombre, correo, telefono, direccion,
        fecha_nacimiento, documento_id, empleado_id, usuario_id
      ) VALUES (
        ${data.nombre},
        ${data.correo},
        ${data.telefono || null},
        ${data.direccion || null},
        ${data.fecha_nacimiento || null},
        ${data.documento_id},
        ${data.empleado_id || null},
        ${usuario.usuario_id}
      )
      RETURNING *
    `;
    const cliente = nuevoCliente[0];

    return {
      usuario: {
        usuario_id: usuario.usuario_id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol_id: usuario.rol_id,
      },
      cliente,
      contrasena_inicial: data.documento_id, // Solo para mostrarlo en pantalla una vez
      mensaje: `Usuario creado. Contraseña inicial: número de documento (${data.documento_id}). Se recomienda cambiarla al primer ingreso.`,
    };
  }
}
