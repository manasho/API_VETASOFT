/**
 * TypeScript Type Definitions for Database Entities
 * Migrado de Next.js a Express
 */

// ============================================
// ENUMS
// ============================================

export type SexoAnimal = "Macho" | "Hembra";
export type EstadoAnimal = "Activo" | "Adoptado" | "En adopcion";

// ============================================
// USER MANAGEMENT
// ============================================

export interface RolUsuario {
  rol_id: number;
  nombre_rol: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface Usuario {
  usuario_id: number;
  nombre: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  direccion?: string;
  rol_id: number;
  fecha_registro: Date;
  ultimo_acceso?: Date;
  activo: boolean;
}

// ============================================
// CLIENTS
// ============================================

export interface Cliente {
  cliente_id: number;
  nombre: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: Date;
  documento_id: string;
  fecha_registro: Date;
  activo: boolean;
  empleado_id?: number;
}

// ============================================
// SPECIES & BREEDS
// ============================================

export interface Especie {
  especie_id: number;
  nombre_especie: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface Raza {
  raza_id: number;
  especie_id: number;
  nombre_raza: string;
  descripcion?: string;
  activo: boolean;
}

// ============================================
// ANIMALS
// ============================================

export interface Animal {
  animal_id: number;
  cliente_id: number;
  nombre: string;
  raza_id: number;
  edad: number;
  fecha_nacimiento?: Date;
  peso: number;
  sexo: SexoAnimal;
  descripcion: string;
  numero_chip?: string;
  estado: EstadoAnimal;
  fecha_ingreso: Date;
  activo: boolean;
}

// ============================================
// VETERINARIANS
// ============================================

export interface Veterinario {
  veterinario_id: number;
  usuario_id: number;
  numero_licencia: string;
  especialidad?: string;
  fecha_contratacion?: Date;
  horario_inicio?: string;
  horario_fin?: string;
  activo: boolean;
}

// ============================================
// APPOINTMENTS
// ============================================

export interface EstadoCita {
  estado_id: number;
  estado_nombre: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface TipoConsulta {
  tipo_consulta_id: number;
  nombre: string;
  descripcion?: string;
  costo?: number;
  activo: boolean;
  fecha_creacion: Date;
}

export interface Cita {
  cita_id: number;
  animal_id: number;
  veterinario_id: number;
  tipo_consulta_id: number;
  fecha_cita: Date;
  motivo?: string;
  estado_id: number;
  observaciones?: string;
  fecha_creacion: Date;
  creado_por: number;
}

// ============================================
// MEDICAL HISTORY
// ============================================

export interface HistorialMedico {
  historial_id: number;
  cita_id: number;
  animal_id: number;
  veterinario_id: number;
  tipo_consulta_id: number;
  fecha_consulta?: Date;
  sintomas?: string;
  diagnostico: string;
  tratamiento: string;
  examenes_realizados?: string;
  medicamentos?: string;
  proxima_cita?: Date;
  observaciones?: string;
  peso?: number;
  temperatura?: number;
  frecuencia_cardiaca?: number;
  frecuencia_respiratoria?: number;
  fecha_creacion: Date;
}

// ============================================
// VACCINATIONS
// ============================================

export interface Vacuna {
  vacuna_id: number;
  nombre: string;
  descripcion?: string;
  edad_minima_meses: number;
  intervalo_meses: number;
  activo: boolean;
  especie_id: number;
  fecha_creacion: Date;
}

export interface HistorialVacunacion {
  vacunacion_id: number;
  animal_id: number;
  vacuna_id: number;
  veterinario_id: number;
  fecha_vacunacion: Date;
  lote_vacuna: string;
  proxima_vacuna?: Date;
  observaciones?: string;
  fecha_registro: Date;
}

// ============================================
// DONATIONS
// ============================================

export interface CampanaDonacion {
  campana_id: number;
  nombre: string;
  descripcion?: string;
  meta_monto: number;
  monto_recaudado: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  activo: boolean;
  fecha_creacion: Date;
  creado_por: number;
}

export interface Donacion {
  donacion_id: number;
  campana_id: number;
  nombre_donante: string;
  correo_donante?: string;
  telefono_donante?: string;
  monto: number;
  fecha_donacion: Date;
  metodo_pago?: string;
  numero_transaccion?: string;
  observaciones?: string;
  anonimo: boolean;
}

// ============================================
// ADOPTIONS
// ============================================

export interface EstadoAdopcion {
  estado_id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fecha_creacion: Date;
}

export interface SolicitudAdopcion {
  solicitud_id: number;
  animal_id: number;
  nombre_solicitante: string;
  correo_solicitante: string;
  telefono_solicitante: string;
  direccion_solicitante: string;
  experiencia_animales: string;
  motivo: string;
  fecha_solicitud: Date;
  fecha_respuesta?: Date;
  observacion_respuesta?: string;
  respondido_por?: number;
  estado_id: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// DATABASE ERROR TYPE
// ============================================

export interface DatabaseError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
}
