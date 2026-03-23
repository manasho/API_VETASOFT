/**
 * Tipo Consulta Service - Migrado de Next.js a Express
 */

import { sql } from "../lib/db.js";

export class TipoConsultaService {
  static async findAll() {
    const tipoConsulta =
      await sql`SELECT * FROM tipo_consulta WHERE activo = true`;
    return tipoConsulta;
  }

  static async findById(id: number) {
    const tipoConsulta =
      await sql`SELECT * FROM tipo_consulta WHERE tipo_consulta_id = ${id}`;
    return tipoConsulta[0] || null;
  }
}
