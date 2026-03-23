/**
 * Database Connection - Neon PostgreSQL
 */

import dotenv from "dotenv";
import path from "path";

// Cargar .env desde la raíz del proyecto con ruta absoluta
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ ERROR: DATABASE_URL no está definida.");
  console.error("   Revisa que tu archivo .env contenga:");
  console.error("   DATABASE_URL=postgresql://usuario:pass@host/db");
  process.exit(1);
}

export const sql = neon(databaseUrl);

/**
 * Verificar conexión a la base de datos
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1 as connected`;
    console.log("✅ Conexión a la base de datos exitosa");
    return true;
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error);
    return false;
  }
}
