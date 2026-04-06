/**
 * Auth Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";
import { PasswordUtil } from "../utils/password.util.js";
import { JwtUtil, JwtPayload } from "../utils/jwt.util.js";

export class AuthService {
  /**
   * Autenticar un usuario (Login)
   */
  static async login(correo: string, contrasena: string) {
    const usuarios = await sql`
      SELECT 
        u.usuario_id,
        u.nombre,
        u.correo,
        u.contrasena,
        u.rol_id,
        u.activo,
        u.fecha_registro,
        r.nombre_rol
      FROM usuarios u
      LEFT JOIN roles_usuario r ON u.rol_id = r.rol_id
      WHERE u.correo = ${correo} AND u.activo = true
    `;

    if (usuarios.length === 0) {
      return { success: false, message: "Credenciales inválidas" };
    }

    const usuario = usuarios[0];

    const isPasswordValid = await PasswordUtil.verify(
      contrasena,
      usuario.contrasena as string
    );

    if (!isPasswordValid) {
      return { success: false, message: "Credenciales inválidas" };
    }

    // Si es cliente (rol 3), obtener su cliente_id
    let clienteId: number | null = null;
    if (usuario.rol_id === 3) {
      const clienteRows = await sql`
        SELECT cliente_id FROM clientes
        WHERE usuario_id = ${usuario.usuario_id} AND activo = true
        LIMIT 1
      `;
      if (clienteRows.length > 0) {
        clienteId = clienteRows[0].cliente_id as number;
      }
    }

    // Si es médico tratante (rol 5) o auxiliar (rol 6), obtener su veterinario_id
    let veterinarioId: number | null = null;
    if (usuario.rol_id === 5 || usuario.rol_id === 6) {
      const vetRows = await sql`
        SELECT veterinario_id FROM veterinarios
        WHERE usuario_id = ${usuario.usuario_id} AND activo = true
        LIMIT 1
      `;
      if (vetRows.length > 0) {
        veterinarioId = vetRows[0].veterinario_id as number;
      }
    }

    const payload: JwtPayload = {
      userId: usuario.usuario_id as number,
      email: usuario.correo as string,
      roleId: usuario.rol_id as number,
      roleName: usuario.nombre_rol as string,
    };

    const token = JwtUtil.generateToken(payload);

    const { contrasena: _, ...usuarioSinPassword } = usuario;

    return {
      success: true,
      data: {
        user: {
          ...usuarioSinPassword,
          cliente_id: clienteId,
          veterinario_id: veterinarioId,
        },
        token,
      },
    };
  }

  /**
   * Registrar un nuevo usuario
   */
  static async register(data: {
    nombre: string;
    correo: string;
    contrasena: string;
    rol_id?: number;
  }) {
    const existingUser = await sql`
      SELECT usuario_id FROM usuarios WHERE correo = ${data.correo}
    `;

    if (existingUser.length > 0) {
      return { success: false, message: "El correo ya está registrado" };
    }

    const hashedPassword = await PasswordUtil.hash(data.contrasena);

    const nuevoUsuario = await sql`
      INSERT INTO usuarios (nombre, correo, contrasena, rol_id)
      VALUES (${data.nombre}, ${data.correo}, ${hashedPassword}, ${
      data.rol_id || 2
    })
      RETURNING usuario_id, nombre, correo, rol_id, activo, fecha_registro
    `;

    const payload: JwtPayload = {
      userId: nuevoUsuario[0].usuario_id as number,
      email: nuevoUsuario[0].correo as string,
      roleId: nuevoUsuario[0].rol_id as number,
    };

    const token = JwtUtil.generateToken(payload);

    return {
      success: true,
      data: { user: nuevoUsuario[0], token },
    };
  }

  /**
   * Verificar token
   */
  static async verifyToken(token: string) {
    const payload = JwtUtil.verifyToken(token);
    if (!payload) {
      return { success: false, message: "Token inválido o expirado" };
    }
    return { success: true, data: payload };
  }
}
