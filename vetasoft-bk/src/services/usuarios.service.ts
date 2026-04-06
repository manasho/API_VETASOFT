/**
 * Usuarios Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";
import { PasswordUtil } from "../utils/password.util.js";

export class UsuariosService {
  static async findAll() {
    const usuarios = await sql`
      SELECT u.*, r.nombre_rol, r.descripcion as rol_descripcion
      FROM usuarios u
      LEFT JOIN roles_usuario r ON u.rol_id = r.rol_id
      WHERE u.activo = true
      ORDER BY u.fecha_registro DESC
    `;
    return usuarios;
  }

  static async findById(id: number) {
    const usuario = await sql`
      SELECT u.*, r.nombre_rol, r.descripcion as rol_descripcion
      FROM usuarios u
      LEFT JOIN roles_usuario r ON u.rol_id = r.rol_id
      WHERE u.usuario_id = ${id}
    `;
    return usuario[0] || null;
  }

  static async create(data: any) {
    const hashedPassword = await PasswordUtil.hash(data.contrasena);
    const usuario = await sql`
      INSERT INTO usuarios (nombre, correo, contrasena, telefono, direccion, rol_id)
      VALUES (${data.nombre}, ${data.correo}, ${hashedPassword}, 
              ${data.telefono || null}, ${data.direccion || null}, ${
      data.rol_id || 2
    })
      RETURNING usuario_id, nombre, correo, telefono, direccion, rol_id
    `;
    return usuario[0];
  }

  static async authenticate(correo: string, contrasena: string) {
    const usuario =
      await sql`SELECT * FROM usuarios WHERE correo = ${correo} AND activo = true`;
    if (usuario.length === 0) return null;
    const isValid = await PasswordUtil.verify(
      contrasena,
      usuario[0].contrasena as string
    );
    if (!isValid) return null;
    const { contrasena: _, ...usuarioSinPassword } = usuario[0];
    return usuarioSinPassword;
  }

  static async update(id: number, data: any) {
    const current = await this.findById(id);
    if (!current) return null;

    let passwordFinal = current.contrasena;
    if (data.contrasena) {
      passwordFinal = await PasswordUtil.hash(data.contrasena);
    }

    const usuario = await sql`
      UPDATE usuarios SET
        nombre = ${data.nombre !== undefined ? data.nombre : current.nombre},
        correo = ${data.correo !== undefined ? data.correo : current.correo},
        contrasena = ${passwordFinal},
        telefono = ${
          data.telefono !== undefined ? data.telefono : current.telefono
        },
        direccion = ${
          data.direccion !== undefined ? data.direccion : current.direccion
        },
        rol_id = ${data.rol_id !== undefined ? data.rol_id : current.rol_id},
        activo = ${data.activo !== undefined ? data.activo : current.activo}
      WHERE usuario_id = ${id}
      RETURNING *
    `;
    return usuario[0];
  }

  static async delete(id: number) {
    const usuario = await sql`
      UPDATE usuarios SET activo = false WHERE usuario_id = ${id} RETURNING *
    `;
    return usuario[0];
  }

   /**
   * Obtener usuario dueño de un animal
   * Cadena: animales → clientes.usuario_id → usuarios (FK directo)
   */
  static async getUsuarioByAnimal(animalId: number) {
    const result = await sql`
      SELECT u.*, r.nombre_rol
      FROM usuarios u
      JOIN clientes cl ON cl.usuario_id = u.usuario_id
      JOIN animales a ON a.cliente_id = cl.cliente_id
      LEFT JOIN roles_usuario r ON u.rol_id = r.rol_id
      WHERE a.animal_id = ${animalId}
        AND u.activo = true
    `;
    return result[0] || null;
  }
}
