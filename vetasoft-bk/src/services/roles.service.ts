/**
 * Roles Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class RolesService {
  static async findAll() {
    const roles = await sql`
      SELECT * FROM roles_usuario WHERE activo = true ORDER BY nombre_rol
    `;
    return roles;
  }

  static async findById(id: number) {
    const role = await sql`SELECT * FROM roles_usuario WHERE rol_id = ${id}`;
    return role[0] || null;
  }
}
