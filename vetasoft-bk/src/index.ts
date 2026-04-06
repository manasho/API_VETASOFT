/**
 * VetaSoft Backend - Express.js
 * Punto de entrada principal del servidor
 *
 * Migrado desde Next.js API Routes
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import authRoutes from "./routes/auth.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import animalesRoutes from "./routes/animales.routes.js";
import citasRoutes from "./routes/citas.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import veterinariosRoutes from "./routes/veterinarios.routes.js";
import especiesRoutes from "./routes/especies.routes.js";
import razasRoutes from "./routes/razas.routes.js";
import vacunasRoutes from "./routes/vacunas.routes.js";
import historialMedicoRoutes from "./routes/historial-medico.routes.js";
import historialVacunacionRoutes from "./routes/historial-vacunacion.routes.js";
import campanasRoutes from "./routes/campanas.routes.js";
import donacionesRoutes from "./routes/donaciones.routes.js";
import solicitudesAdopcionRoutes from "./routes/solicitudes-adopcion.routes.js";
import catalogosRoutes from "./routes/catalogos.routes.js";
import healthRoutes from "./routes/health.routes.js";
import modulosRoutes from "./routes/modulos.routes.js";
import notificacionesRoutes from "./routes/notificaciones.routes.js";
import testRoutes from "./routes/test.routes.js"; // Solo desarrollo

const app = express();
const PORT = process.env.PORT || 4000;

// MIDDLEWARES GLOBALES

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// RUTAS API
// ============================================

// Health check
app.use("/api/health", healthRoutes);

// Auth (login, register)
app.use("/api/auth", authRoutes);

// Recursos principales
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/animales", animalesRoutes);
app.use("/api/veterinarios", veterinariosRoutes);
app.use("/api/citas", citasRoutes);

// Especies y razas
app.use("/api/especies", especiesRoutes);
app.use("/api/razas", razasRoutes);

// Vacunas e historiales
app.use("/api/vacunas", vacunasRoutes);
app.use("/api/historial-medico", historialMedicoRoutes);
app.use("/api/historial-vacunacion", historialVacunacionRoutes);

// Donaciones y campañas
app.use("/api/campanas", campanasRoutes);
app.use("/api/donaciones", donacionesRoutes);

// Adopciones
app.use("/api/solicitudes-adopcion", solicitudesAdopcionRoutes);

// Catálogos (roles, estados, tipos)
app.use("/api/catalogos", catalogosRoutes);

// Módulos por Rol (RBAC - frontend usa /api/modulos/mis-modulos)
app.use("/api/modulos", modulosRoutes);

// Notificaciones (campana)
app.use("/api/notificaciones", notificacionesRoutes);

// ⚠️ Solo desarrollo — ejecutar tareas manualmente
app.use("/api/test", testRoutes);

// Ruta raíz - Documentación de la API
app.get("/", (req, res) => {
  res.json({
    message: "🐾 VetaSoft API v1.0",
    description: "Backend para sistema de gestión veterinaria",
    endpoints: {
      auth: {
        login: "POST /api/auth/login",
        register: "POST /api/auth/register",
      },
      recursos: {
        usuarios: "/api/usuarios",
        clientes: "/api/clientes",
        animales: "/api/animales",
        veterinarios: "/api/veterinarios",
        citas: "/api/citas",
      },
      catalogo: {
        especies: "/api/especies",
        razas: "/api/razas",
        vacunas: "/api/vacunas",
        roles: "/api/catalogos/roles",
        estadoCitas: "/api/catalogos/estado-citas",
        estadosAdopcion: "/api/catalogos/estados-adopcion",
        tipoConsulta: "/api/catalogos/tipo-consulta",
      },
      historiales: {
        medico: "/api/historial-medico",
        vacunacion: "/api/historial-vacunacion",
      },
      donaciones: {
        campanas: "/api/campanas",
        donaciones: "/api/donaciones",
      },
      adopciones: {
        solicitudes: "/api/solicitudes-adopcion",
      },
      modulos: {
        misModulos: "GET /api/modulos/mis-modulos",
        todos: "GET /api/modulos (admin)",
        porRol: "GET /api/modulos/rol/:rolId (admin)",
        asignar: "POST /api/modulos/rol/:rolId/:moduloId (admin)",
        remover: "DELETE /api/modulos/rol/:rolId/:moduloId (admin)",
      },
      notificaciones: {
        listar: "GET /api/notificaciones",
        contador: "GET /api/notificaciones/contador",
        leerTodas: "PATCH /api/notificaciones/leer-todas",
        leerUna: "PATCH /api/notificaciones/:id/leer",
        eliminar: "DELETE /api/notificaciones/:id",
      },
      health: "GET /api/health",
    },
  });
});

// ============================================
// MANEJO DE ERRORES
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`
  🐾 VetaSoft API v1.0 - Express.js
  ================================
  
  Servidor corriendo en: http://localhost:${PORT}
  
  📌 Endpoints principales:
     POST /api/auth/login
     POST /api/auth/register
     GET  /api/usuarios
     GET  /api/clientes
     GET  /api/animales
     GET  /api/veterinarios
     GET  /api/citas
     GET  /api/especies
     GET  /api/razas
     GET  /api/vacunas
     GET  /api/campanas
     GET  /api/catalogo/roles
     GET  /api/donaciones
     GET  /api/solicitudes-adopcion
     GET  /api/health
     
  📖 Documentación: http://localhost:${PORT}
  `);
});

export default app;
