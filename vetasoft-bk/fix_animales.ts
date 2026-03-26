import { sql } from "./src/lib/db.js";

async function main() {
  try {
    // Intentaremos agregar la columna activo si no existe
    await sql`ALTER TABLE animales ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;`;
    console.log("Columna 'activo' agregada correctamente a la tabla 'animales'.");
  } catch (error) {
    console.error("Error al alterar la tabla:", error);
  } finally {
    process.exit(0);
  }
}

main();
