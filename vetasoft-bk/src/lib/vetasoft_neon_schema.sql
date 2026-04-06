-- ============================================================
-- VetSoft - Esquema completo PostgreSQL para Neon DB
-- Migrado desde MySQL, incluye módulos y notificaciones
-- ============================================================

SET search_path TO public;

-- ─────────────────────────────────────────────────────────────
-- 1. ROLES DE USUARIO
-- ─────────────────────────────────────────────────────────────
CREATE TABLE roles_usuario (
  rol_id      SERIAL PRIMARY KEY,
  nombre_rol  VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  activo      BOOLEAN DEFAULT TRUE
);

-- ─────────────────────────────────────────────────────────────
-- 2. USUARIOS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE usuarios (
  usuario_id      SERIAL PRIMARY KEY,
  nombre          VARCHAR(100) NOT NULL,
  correo          VARCHAR(150) NOT NULL UNIQUE,
  contrasena      VARCHAR(255) NOT NULL,
  telefono        VARCHAR(20),
  direccion       VARCHAR(100),
  rol_id          INT NOT NULL REFERENCES roles_usuario(rol_id) ON DELETE RESTRICT,
  fecha_registro  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso   TIMESTAMP,
  activo          BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_usuarios_correo          ON usuarios(correo);
CREATE INDEX idx_usuarios_rol             ON usuarios(rol_id);
CREATE INDEX idx_usuarios_activo          ON usuarios(activo);
CREATE INDEX idx_usuarios_fecha_registro  ON usuarios(fecha_registro);

-- ─────────────────────────────────────────────────────────────
-- 3. CLIENTES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE clientes (
  cliente_id       SERIAL PRIMARY KEY,
  nombre           VARCHAR(100) NOT NULL,
  correo           VARCHAR(150),
  telefono         VARCHAR(20),
  direccion        VARCHAR(100),
  fecha_nacimiento DATE,
  documento_id     VARCHAR(50) NOT NULL UNIQUE,
  fecha_registro   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activo           BOOLEAN DEFAULT TRUE,
  empleado_id      INT REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
  usuario_id       INT REFERENCES usuarios(usuario_id) ON DELETE SET NULL  -- cuenta de acceso del cliente (agregado 2026-04-03)
);

CREATE INDEX idx_clientes_empleado   ON clientes(empleado_id);
CREATE INDEX idx_clientes_documento  ON clientes(documento_id);
CREATE INDEX idx_clientes_activo     ON clientes(activo);
CREATE INDEX idx_clientes_nombre     ON clientes(nombre);
CREATE INDEX idx_clientes_usuario    ON clientes(usuario_id);  -- agregado 2026-04-03


-- ─────────────────────────────────────────────────────────────
-- 4. ESPECIES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE especies (
  especie_id     SERIAL PRIMARY KEY,
  nombre_especie VARCHAR(50) NOT NULL UNIQUE,
  descripcion    TEXT,
  activo         BOOLEAN DEFAULT TRUE
);

-- ─────────────────────────────────────────────────────────────
-- 5. RAZAS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE razas (
  raza_id     SERIAL PRIMARY KEY,
  especie_id  INT NOT NULL REFERENCES especies(especie_id) ON DELETE RESTRICT,
  nombre_raza VARCHAR(50) NOT NULL,
  descripcion TEXT,
  activo      BOOLEAN DEFAULT TRUE,
  UNIQUE (especie_id, nombre_raza)
);

CREATE INDEX idx_razas_especie ON razas(especie_id);
CREATE INDEX idx_razas_nombre  ON razas(nombre_raza);

-- ─────────────────────────────────────────────────────────────
-- 6. ANIMALES / MASCOTAS
-- ─────────────────────────────────────────────────────────────
CREATE TYPE sexo_animal   AS ENUM ('Macho', 'Hembra');
CREATE TYPE estado_animal AS ENUM ('Animales', 'Adoptado', 'En adopción');

CREATE TABLE animales (
  animal_id       SERIAL PRIMARY KEY,
  cliente_id      INT NOT NULL REFERENCES clientes(cliente_id) ON DELETE RESTRICT,
  nombre          VARCHAR(50) NOT NULL,
  raza_id         INT NOT NULL REFERENCES razas(raza_id) ON DELETE RESTRICT,
  edad            SMALLINT NOT NULL CHECK (edad BETWEEN 0 AND 150),
  fecha_nacimiento DATE,
  peso            DECIMAL(5,2) NOT NULL CHECK (peso > 0),
  sexo            sexo_animal NOT NULL,
  descripcion     TEXT NOT NULL,
  numero_chip     VARCHAR(50),
  estado          estado_animal DEFAULT 'Animales',
  activo          BOOLEAN DEFAULT TRUE,
  fecha_ingreso   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_animales_cliente ON animales(cliente_id);
CREATE INDEX idx_animales_raza    ON animales(raza_id);
CREATE INDEX idx_animales_estado  ON animales(estado);
CREATE INDEX idx_animales_nombre  ON animales(nombre);
CREATE INDEX idx_animales_chip    ON animales(numero_chip);

-- ─────────────────────────────────────────────────────────────
-- 7. VETERINARIOS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE veterinarios (
  veterinario_id     SERIAL PRIMARY KEY,
  usuario_id         INT NOT NULL REFERENCES usuarios(usuario_id) ON DELETE RESTRICT,
  numero_licencia    VARCHAR(50) NOT NULL UNIQUE,
  especialidad       VARCHAR(100),
  fecha_contratacion DATE,
  horario_inicio     TIME,
  horario_fin        TIME,
  activo             BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_veterinarios_usuario   ON veterinarios(usuario_id);
CREATE INDEX idx_veterinarios_licencia  ON veterinarios(numero_licencia);
CREATE INDEX idx_veterinarios_activo    ON veterinarios(activo);

-- ─────────────────────────────────────────────────────────────
-- 8. ESTADO DE CITAS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE estado_citas (
  estado_id     SERIAL PRIMARY KEY,
  estado_nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion   TEXT,
  activo        BOOLEAN DEFAULT TRUE
);

-- ─────────────────────────────────────────────────────────────
-- 9. CITAS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE citas (
  cita_id        SERIAL PRIMARY KEY,
  animal_id      INT NOT NULL REFERENCES animales(animal_id) ON DELETE RESTRICT,
  veterinario_id INT NOT NULL REFERENCES veterinarios(veterinario_id) ON DELETE RESTRICT,
  fecha_cita     TIMESTAMP NOT NULL,
  motivo         TEXT,
  estado_id      INT NOT NULL REFERENCES estado_citas(estado_id) ON DELETE RESTRICT,
  observaciones  TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  creado_por     INT NOT NULL REFERENCES usuarios(usuario_id) ON DELETE RESTRICT
);

CREATE INDEX idx_citas_animal       ON citas(animal_id);
CREATE INDEX idx_citas_veterinario  ON citas(veterinario_id);
CREATE INDEX idx_citas_fecha        ON citas(fecha_cita);
CREATE INDEX idx_citas_estado       ON citas(estado_id);
CREATE INDEX idx_citas_creado_por   ON citas(creado_por);

-- ─────────────────────────────────────────────────────────────
-- 10. TIPO DE CONSULTA
-- ─────────────────────────────────────────────────────────────
CREATE TABLE tipo_consulta (
  tipo_consulta_id SERIAL PRIMARY KEY,
  nombre           VARCHAR(50) NOT NULL UNIQUE,
  descripcion      TEXT,
  costo            DECIMAL(10,2),
  activo           BOOLEAN DEFAULT TRUE
);

-- ─────────────────────────────────────────────────────────────
-- 11. HISTORIAL MÉDICO
-- ─────────────────────────────────────────────────────────────
CREATE TABLE historial_medico (
  historial_id           SERIAL PRIMARY KEY,
  cita_id                INT NOT NULL REFERENCES citas(cita_id) ON DELETE RESTRICT,
  sintomas               TEXT,
  diagnostico            TEXT NOT NULL,
  tratamiento            TEXT NOT NULL,
  examenes_realizados    TEXT,
  medicamentos           TEXT,
  proxima_cita           TIMESTAMP,
  observaciones          TEXT,
  peso                   DECIMAL(5,2),
  temperatura            DECIMAL(4,1),
  frecuencia_cardiaca    INT,
  frecuencia_respiratoria INT,
  fecha_creacion         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_historial_cita   ON historial_medico(cita_id);
CREATE INDEX idx_historial_fecha  ON historial_medico(fecha_creacion);

-- ─────────────────────────────────────────────────────────────
-- 12. CAMPAÑAS DE DONACIÓN
-- ─────────────────────────────────────────────────────────────
CREATE TABLE campana_donacion (
  campana_id       SERIAL PRIMARY KEY,
  nombre           VARCHAR(50) NOT NULL,
  descripcion      TEXT,
  meta_monto       DECIMAL(12,2),
  monto_recaudado  DECIMAL(12,2) DEFAULT 0,
  fecha_inicio     DATE NOT NULL,
  fecha_fin        DATE NOT NULL,
  activo           BOOLEAN DEFAULT TRUE,
  fecha_creacion   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  creado_por       INT NOT NULL REFERENCES usuarios(usuario_id) ON DELETE RESTRICT
);

CREATE INDEX idx_campana_activo      ON campana_donacion(activo);
CREATE INDEX idx_campana_fechas      ON campana_donacion(fecha_inicio, fecha_fin);
CREATE INDEX idx_campana_creado_por  ON campana_donacion(creado_por);

-- ─────────────────────────────────────────────────────────────
-- 13. DONACIONES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE donaciones (
  donacion_id         SERIAL PRIMARY KEY,
  campana_id          INT NOT NULL REFERENCES campana_donacion(campana_id) ON DELETE RESTRICT,
  usuario_id          INT REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
  nombre_donante      VARCHAR(50) NOT NULL,
  correo_donante      VARCHAR(100),
  telefono_donante    VARCHAR(20),
  monto               DECIMAL(10,2) NOT NULL,
  fecha_donacion      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metodo_pago         VARCHAR(50),
  numero_transaccion  VARCHAR(100),
  observaciones       TEXT,
  anonimo             BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_donaciones_campana  ON donaciones(campana_id);
CREATE INDEX idx_donaciones_usuario  ON donaciones(usuario_id);
CREATE INDEX idx_donaciones_fecha    ON donaciones(fecha_donacion);
CREATE INDEX idx_donaciones_donante  ON donaciones(nombre_donante);

-- ─────────────────────────────────────────────────────────────
-- 14. ESTADO DE ADOPCIÓN
-- ─────────────────────────────────────────────────────────────
CREATE TABLE estado_adopcion (
  estado_id   SERIAL PRIMARY KEY,
  nombre      VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  activo      BOOLEAN DEFAULT TRUE
);

-- ─────────────────────────────────────────────────────────────
-- 15. SOLICITUDES DE ADOPCIÓN
-- ─────────────────────────────────────────────────────────────
CREATE TABLE solicitudes_adopcion (
  solicitud_id           SERIAL PRIMARY KEY,
  animal_id              INT NOT NULL REFERENCES animales(animal_id) ON DELETE RESTRICT,
  usuario_id             INT REFERENCES usuarios(usuario_id) ON DELETE SET NULL,  -- dueño de la solicitud
  nombre_solicitante     VARCHAR(50) NOT NULL,
  correo_solicitante     VARCHAR(100) NOT NULL,
  telefono_solicitante   VARCHAR(20) NOT NULL,
  direccion_solicitante  VARCHAR(100) NOT NULL,
  experiencia_animales   TEXT NOT NULL,
  motivo                 TEXT NOT NULL,
  fecha_solicitud        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_respuesta        TIMESTAMP,
  observacion_respuesta  TEXT,
  respondido_por         INT REFERENCES usuarios(usuario_id) ON DELETE SET NULL,
  estado_id              INT NOT NULL REFERENCES estado_adopcion(estado_id) ON DELETE RESTRICT
);

CREATE INDEX idx_solicitudes_animal         ON solicitudes_adopcion(animal_id);
CREATE INDEX idx_solicitudes_usuario        ON solicitudes_adopcion(usuario_id);
CREATE INDEX idx_solicitudes_estado         ON solicitudes_adopcion(estado_id);
CREATE INDEX idx_solicitudes_fecha          ON solicitudes_adopcion(fecha_solicitud);
CREATE INDEX idx_solicitudes_respondido_por ON solicitudes_adopcion(respondido_por);

-- ─────────────────────────────────────────────────────────────
-- 16a. VACUNAS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE vacunas (
  vacuna_id         SERIAL PRIMARY KEY,
  nombre            VARCHAR(50) NOT NULL,
  descripcion       TEXT,
  edad_minima_meses INT NOT NULL DEFAULT 0,
  intervalo_meses   INT NOT NULL,
  activo            BOOLEAN DEFAULT TRUE,
  especie_id        INT NOT NULL REFERENCES especies(especie_id) ON DELETE RESTRICT,
  fecha_creacion    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (nombre, especie_id)
);

CREATE INDEX idx_vacunas_especie ON vacunas(especie_id);
CREATE INDEX idx_vacunas_activo  ON vacunas(activo);

-- ─────────────────────────────────────────────────────────────
-- 16b. HISTORIAL DE VACUNACIÓN
-- ─────────────────────────────────────────────────────────────
CREATE TABLE historial_vacunacion (
  vacunacion_id   SERIAL PRIMARY KEY,
  animal_id       INT NOT NULL REFERENCES animales(animal_id) ON DELETE RESTRICT,
  vacuna_id       INT NOT NULL REFERENCES vacunas(vacuna_id) ON DELETE RESTRICT,
  veterinario_id  INT NOT NULL REFERENCES veterinarios(veterinario_id) ON DELETE RESTRICT,
  fecha_vacunacion DATE NOT NULL,
  lote_vacuna      VARCHAR(50),
  proxima_vacuna   DATE,
  observaciones    TEXT,
  fecha_registro   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hv_animal      ON historial_vacunacion(animal_id);
CREATE INDEX idx_hv_vacuna      ON historial_vacunacion(vacuna_id);
CREATE INDEX idx_hv_veterinario ON historial_vacunacion(veterinario_id);
CREATE INDEX idx_hv_fecha       ON historial_vacunacion(fecha_vacunacion);
CREATE INDEX idx_hv_proxima     ON historial_vacunacion(proxima_vacuna);

-- ─────────────────────────────────────────────────────────────
-- 17. MÓDULOS (RBAC - visibilidad por rol)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE modulos (
  modulo_id   SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL UNIQUE,
  icono       VARCHAR(100),
  ruta        VARCHAR(150),
  descripcion TEXT,
  activo      BOOLEAN DEFAULT TRUE
);

CREATE TABLE roles_modulos (
  rol_id    INT NOT NULL REFERENCES roles_usuario(rol_id) ON DELETE CASCADE,
  modulo_id INT NOT NULL REFERENCES modulos(modulo_id) ON DELETE CASCADE,
  PRIMARY KEY (rol_id, modulo_id)
);

-- ─────────────────────────────────────────────────────────────
-- 18. NOTIFICACIONES (campana)
-- ─────────────────────────────────────────────────────────────
CREATE TYPE tipo_notificacion AS ENUM ('info', 'alerta', 'exito', 'error');

CREATE TABLE notificaciones (
  notificacion_id SERIAL PRIMARY KEY,
  usuario_id      INT NOT NULL REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
  titulo          VARCHAR(150) NOT NULL,
  mensaje         TEXT NOT NULL,
  tipo            tipo_notificacion DEFAULT 'info',
  leida           BOOLEAN DEFAULT FALSE,
  url_accion      VARCHAR(255),
  fecha_creacion  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_lectura   TIMESTAMP
);

CREATE INDEX idx_notif_usuario ON notificaciones(usuario_id);
CREATE INDEX idx_notif_leida   ON notificaciones(usuario_id, leida);

-- ============================================================
-- SEED DE DATOS BASE
-- ============================================================

-- Roles
INSERT INTO roles_usuario (nombre_rol, descripcion, activo) VALUES
  ('Admin fundacion', 'Acceso total y gestión a nivel de fundación', TRUE),
  ('Administrador', 'Acceso completo al sistema, gestión de usuarios y configuración', TRUE),
  ('Cliente', 'Acceso al portal de clientes para ver historial, citas y mascotas', TRUE),
  ('Director medico', 'Gestión general de la clínica, reportes y supervisión médica', TRUE),
  ('Medico tratante', 'Acceso a consultas médicas, historiales y gestión de citas', TRUE),
  ('Auxiliar veterinario', 'Apoyo en consultas, recepción y control de pacientes', TRUE)
ON CONFLICT (nombre_rol) DO NOTHING;

-- Estados de cita
INSERT INTO estado_citas (estado_nombre, descripcion, activo) VALUES
  ('Pendiente',   'Cita programada, esperando confirmación', TRUE),
  ('Confirmada',  'Cita confirmada por el cliente', TRUE),
  ('En Curso',    'Consulta en progreso', TRUE),
  ('Completada',  'Consulta finalizada exitosamente', TRUE),
  ('Cancelada',   'Cita cancelada por el cliente o veterinaria', TRUE),
  ('No Asistió',  'Cliente no se presentó a la cita', TRUE)
ON CONFLICT (estado_nombre) DO NOTHING;

-- Estados de adopción
INSERT INTO estado_adopcion (nombre, descripcion, activo) VALUES
  ('Pendiente',   'Solicitud recibida, en espera de revisión', TRUE),
  ('En Revisión', 'Solicitud siendo evaluada por el equipo', TRUE),
  ('Aprobada',    'Solicitud aprobada, pendiente de entrega del animal', TRUE),
  ('Rechazada',   'Solicitud rechazada', TRUE),
  ('Completada',  'Adopción completada y animal entregado', TRUE),
  ('Cancelada',   'Solicitud cancelada por el solicitante', TRUE)
ON CONFLICT (nombre) DO NOTHING;

-- Especies
INSERT INTO especies (nombre_especie, descripcion, activo) VALUES
  ('Perro',  'Canis lupus familiaris', TRUE),
  ('Gato',   'Felis catus', TRUE),
  ('Ave',    'Aves domésticas', TRUE),
  ('Roedor', 'Pequeños mamíferos roedores', TRUE),
  ('Reptil', 'Reptiles domésticos', TRUE)
ON CONFLICT (nombre_especie) DO NOTHING;

-- Tipos de consulta
INSERT INTO tipo_consulta (nombre, descripcion, costo, activo) VALUES
  ('Consulta General', 'Revisión médica general', 50000.00, TRUE),
  ('Vacunación',       'Aplicación de vacunas', 30000.00, TRUE),
  ('Cirugía Menor',    'Procedimientos quirúrgicos menores', 150000.00, TRUE),
  ('Cirugía Mayor',    'Procedimientos quirúrgicos mayores', 500000.00, TRUE),
  ('Emergencia',       'Atención de emergencia veterinaria', 100000.00, TRUE),
  ('Control Prenatal', 'Control de animales en gestación', 60000.00, TRUE),
  ('Desparasitación',  'Tratamiento antiparasitario', 25000.00, TRUE),
  ('Esterilización',   'Procedimiento de esterilización', 200000.00, TRUE)
ON CONFLICT (nombre) DO NOTHING;

-- Razas - Perros (especie_id=1)
INSERT INTO razas (especie_id, nombre_raza, descripcion, activo) VALUES
  (1, 'Mestizo',          'Perro cruzado de diferentes razas', TRUE),
  (1, 'Labrador Retriever','Raza amigable y activa', TRUE),
  (1, 'Golden Retriever', 'Raza amigable ideal para familias', TRUE),
  (1, 'Pastor Alemán',    'Raza inteligente y leal', TRUE),
  (1, 'Bulldog Francés',  'Raza pequeña de compañía', TRUE),
  (1, 'Chihuahua',        'Raza muy pequeña', TRUE),
  (1, 'Poodle',           'Raza inteligente hipoalergénica', TRUE),
  (1, 'Beagle',           'Raza cazadora amigable', TRUE),
  (1, 'Husky Siberiano',  'Raza de trabajo resistente al frío', TRUE),
  (1, 'Pitbull',          'Raza fuerte y leal', TRUE)
ON CONFLICT (especie_id, nombre_raza) DO NOTHING;

-- Razas - Gatos (especie_id=2)
INSERT INTO razas (especie_id, nombre_raza, descripcion, activo) VALUES
  (2, 'Mestizo',                 'Gato cruzado de diferentes razas', TRUE),
  (2, 'Siamés',                  'Gato vocal y social', TRUE),
  (2, 'Persa',                   'Gato de pelo largo y tranquilo', TRUE),
  (2, 'Maine Coon',              'Raza grande y amigable', TRUE),
  (2, 'Angora',                  'Gato de pelo largo y sedoso', TRUE),
  (2, 'Bengalí',                 'Gato con apariencia salvaje', TRUE),
  (2, 'Ragdoll',                 'Gato dócil y relajado', TRUE),
  (2, 'Británico de pelo corto', 'Gato robusto y tranquilo', TRUE)
ON CONFLICT (especie_id, nombre_raza) DO NOTHING;

-- Vacunas - Perros (especie_id=1)
INSERT INTO vacunas (nombre, descripcion, edad_minima_meses, intervalo_meses, activo, especie_id) VALUES
  ('Parvovirus',  'Vacuna contra parvovirus canino', 2, 12, TRUE, 1),
  ('Moquillo',    'Vacuna contra moquillo canino', 2, 12, TRUE, 1),
  ('Rabia',       'Vacuna antirrábica obligatoria', 3, 12, TRUE, 1),
  ('Hepatitis',   'Vacuna contra hepatitis infecciosa', 2, 12, TRUE, 1),
  ('Polivalente', 'Vacuna múltiple (parvovirus, moquillo, hepatitis)', 2, 12, TRUE, 1)
ON CONFLICT (nombre, especie_id) DO NOTHING;

-- Vacunas - Gatos (especie_id=2)
INSERT INTO vacunas (nombre, descripcion, edad_minima_meses, intervalo_meses, activo, especie_id) VALUES
  ('Triple Felina',   'Vacuna contra rinotraqueitis, calicivirus y panleucopenia', 2, 12, TRUE, 2),
  ('Rabia',           'Vacuna antirrábica obligatoria', 3, 12, TRUE, 2),
  ('Leucemia Felina', 'Vacuna contra leucemia felina (FeLV)', 2, 12, TRUE, 2)
ON CONFLICT (nombre, especie_id) DO NOTHING;

-- ─── Módulos del sistema ─────────────────────────────────────
INSERT INTO modulos (nombre, icono, ruta) VALUES
  ('Dashboard',        'LayoutDashboard', '/dashboard'),
  ('Clientes',         'Users',           '/clientes'),
  ('Animales',         'PawPrint',        '/animales'),
  ('Citas',            'Calendar',        '/citas'),
  ('Veterinarios',     'Stethoscope',     '/veterinarios'),
  ('Historial Medico', 'FileText',        '/historial-medico'),
  ('Vacunacion',       'Syringe',         '/historial-vacunacion'),
  ('Campanas',         'Megaphone',       '/campanas'),
  ('Donaciones',       'Heart',           '/donaciones'),
  ('Adopciones',       'Home',            '/solicitudes-adopcion'),
  ('Usuarios',         'UserCog',         '/usuarios'),
  ('Reportes',         'BarChart2',       '/reportes')
ON CONFLICT (nombre) DO NOTHING;

-- Admin fundacion (rol_id=1): acceso total
INSERT INTO roles_modulos (rol_id, modulo_id)
SELECT 1, modulo_id FROM modulos
ON CONFLICT DO NOTHING;

-- Administrador (rol_id=2): acceso total
INSERT INTO roles_modulos (rol_id, modulo_id)
SELECT 2, modulo_id FROM modulos
ON CONFLICT DO NOTHING;

-- Cliente (rol_id=3)
INSERT INTO roles_modulos (rol_id, modulo_id)
SELECT 3, modulo_id FROM modulos
WHERE nombre IN ('Dashboard', 'Animales', 'Citas', 'Historial Medico', 'Vacunacion', 'Donaciones', 'Adopciones')
ON CONFLICT DO NOTHING;

-- Director medico (rol_id=4)
INSERT INTO roles_modulos (rol_id, modulo_id)
SELECT 4, modulo_id FROM modulos
WHERE nombre IN ('Dashboard', 'Clientes', 'Animales', 'Citas', 'Veterinarios', 'Historial Medico', 'Vacunacion', 'Campanas', 'Reportes')
ON CONFLICT DO NOTHING;

-- Medico tratante (rol_id=5)
INSERT INTO roles_modulos (rol_id, modulo_id)
SELECT 5, modulo_id FROM modulos
WHERE nombre IN ('Dashboard', 'Clientes', 'Animales', 'Citas', 'Historial Medico', 'Vacunacion')
ON CONFLICT DO NOTHING;

-- Auxiliar veterinario (rol_id=6)
INSERT INTO roles_modulos (rol_id, modulo_id)
SELECT 6, modulo_id FROM modulos
WHERE nombre IN ('Dashboard', 'Clientes', 'Animales', 'Citas')
ON CONFLICT DO NOTHING;

