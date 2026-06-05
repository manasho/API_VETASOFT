import { UsuariosService } from '../../services/usuarios.service';
import * as db from '../../lib/db';
import { PasswordUtil } from '../../utils/password.util';

// Mock de la base de datos
jest.mock('../../lib/db');
jest.mock('../../utils/password.util');

const mockedSql = db.sql as jest.MockedFunction<typeof db.sql>;
const mockedPasswordUtil = PasswordUtil as jest.Mocked<typeof PasswordUtil>;

describe('UsuariosService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería retornar todos los usuarios activos', async () => {
      const usuariosEsperados = [
        {
          usuario_id: 1,
          nombre: 'Juan',
          correo: 'juan@example.com',
          nombre_rol: 'Admin',
        },
        {
          usuario_id: 2,
          nombre: 'María',
          correo: 'maria@example.com',
          nombre_rol: 'Usuario',
        },
      ];

      mockedSql.mockResolvedValueOnce(usuariosEsperados as any);

      const result = await UsuariosService.findAll();

      expect(result).toEqual(usuariosEsperados);
      expect(mockedSql).toHaveBeenCalled();
    });

    it('debería retornar un array vacío si no hay usuarios', async () => {
      mockedSql.mockResolvedValueOnce([] as any);

      const result = await UsuariosService.findAll();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('debería manejar errores de base de datos', async () => {
      mockedSql.mockRejectedValueOnce(new Error('Database error'));

      await expect(UsuariosService.findAll()).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('findById', () => {
    it('debería retornar un usuario por su ID', async () => {
      const usuarioEsperado = {
        usuario_id: 1,
        nombre: 'Juan',
        correo: 'juan@example.com',
        nombre_rol: 'Admin',
      };

      mockedSql.mockResolvedValueOnce([usuarioEsperado] as any);

      const result = await UsuariosService.findById(1);

      expect(result).toEqual(usuarioEsperado);
    });

    it('debería retornar null si el usuario no existe', async () => {
      mockedSql.mockResolvedValueOnce([] as any);

      const result = await UsuariosService.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('debería crear un nuevo usuario con contraseña hasheada', async () => {
      const nuevoUsuario = {
        nombre: 'Carlos',
        correo: 'carlos@example.com',
        contrasena: 'password123',
        telefono: '123456789',
        direccion: 'Calle 123',
        rol_id: 2,
      };

      const usuarioCreado = {
        usuario_id: 1,
        nombre: 'Carlos',
        correo: 'carlos@example.com',
        telefono: '123456789',
        direccion: 'Calle 123',
        rol_id: 2,
      };

      mockedPasswordUtil.hash.mockResolvedValueOnce('hashedPassword123');
      mockedSql.mockResolvedValueOnce([usuarioCreado] as any);

      const result = await UsuariosService.create(nuevoUsuario);

      expect(result).toEqual(usuarioCreado);
      expect(mockedPasswordUtil.hash).toHaveBeenCalledWith('password123');
    });

    it('debería usar rol_id por defecto si no se proporciona', async () => {
      const nuevoUsuario = {
        nombre: 'Ana',
        correo: 'ana@example.com',
        contrasena: 'password123',
      };

      mockedPasswordUtil.hash.mockResolvedValueOnce('hashedPassword123');
      mockedSql.mockResolvedValueOnce([
        {
          usuario_id: 2,
          nombre: 'Ana',
          correo: 'ana@example.com',
        },
      ] as any);

      const result = await UsuariosService.create(nuevoUsuario);

      expect(result).toBeDefined();
    });
  });

  describe('authenticate', () => {
    it('debería autenticar un usuario con credenciales válidas', async () => {
      const usuarioEnBD = {
        usuario_id: 1,
        nombre: 'Juan',
        correo: 'juan@example.com',
        contrasena: 'hashedPassword123',
        activo: true,
      };

      mockedSql.mockResolvedValueOnce([usuarioEnBD] as any);
      mockedPasswordUtil.verify.mockResolvedValueOnce(true);

      const result = await UsuariosService.authenticate(
        'juan@example.com',
        'password123'
      );

      expect(result).toBeDefined();
      expect(result?.correo).toBe('juan@example.com');
      expect(result?.contrasena).toBeUndefined();
    });

    it('debería retornar null si el usuario no existe', async () => {
      mockedSql.mockResolvedValueOnce([] as any);

      const result = await UsuariosService.authenticate(
        'noexiste@example.com',
        'password123'
      );

      expect(result).toBeNull();
    });

    it('debería retornar null si la contraseña es incorrecta', async () => {
      const usuarioEnBD = {
        usuario_id: 1,
        nombre: 'Juan',
        correo: 'juan@example.com',
        contrasena: 'hashedPassword123',
        activo: true,
      };

      mockedSql.mockResolvedValueOnce([usuarioEnBD] as any);
      mockedPasswordUtil.verify.mockResolvedValueOnce(false);

      const result = await UsuariosService.authenticate(
        'juan@example.com',
        'passwordIncorrecto'
      );

      expect(result).toBeNull();
    });

    it('no debería retornar la contraseña en la respuesta', async () => {
      const usuarioEnBD = {
        usuario_id: 1,
        nombre: 'Juan',
        correo: 'juan@example.com',
        contrasena: 'hashedPassword123',
        activo: true,
      };

      mockedSql.mockResolvedValueOnce([usuarioEnBD] as any);
      mockedPasswordUtil.verify.mockResolvedValueOnce(true);

      const result = await UsuariosService.authenticate(
        'juan@example.com',
        'password123'
      );

      expect(result?.contrasena).toBeUndefined();
    });
  });

  describe('update', () => {
    it('debería actualizar un usuario', async () => {
      const usuarioActual = {
        usuario_id: 1,
        nombre: 'Juan',
        correo: 'juan@example.com',
        contrasena: 'hashedPassword123',
        telefono: '123456789',
        direccion: 'Calle 123',
        rol_id: 2,
        activo: true,
      };

      const datosActualizar = {
        nombre: 'Juan Actualizado',
      };

      mockedSql
        .mockResolvedValueOnce([usuarioActual] as any)
        .mockResolvedValueOnce([
          { ...usuarioActual, nombre: 'Juan Actualizado' },
        ] as any);

      const result = await UsuariosService.update(1, datosActualizar);

      expect(result?.nombre).toBe('Juan Actualizado');
    });

    it('debería retornar null si el usuario no existe', async () => {
      mockedSql.mockResolvedValueOnce([] as any);

      const result = await UsuariosService.update(999, { nombre: 'Nuevo' });

      expect(result).toBeNull();
    });

    it('debería hashear la contraseña si se proporciona una nueva', async () => {
      const usuarioActual = {
        usuario_id: 1,
        nombre: 'Juan',
        correo: 'juan@example.com',
        contrasena: 'hashedPassword123',
      };

      mockedSql.mockResolvedValueOnce([usuarioActual] as any);
      mockedPasswordUtil.hash.mockResolvedValueOnce('newHashedPassword');
      mockedSql.mockResolvedValueOnce([usuarioActual] as any);

      await UsuariosService.update(1, { contrasena: 'newPassword123' });

      expect(mockedPasswordUtil.hash).toHaveBeenCalledWith('newPassword123');
    });
  });

  describe('delete', () => {
    it('debería desactivar un usuario', async () => {
      const usuarioDesactivado = {
        usuario_id: 1,
        nombre: 'Juan',
        activo: false,
      };

      mockedSql.mockResolvedValueOnce([usuarioDesactivado] as any);

      const result = await UsuariosService.delete(1);

      expect(result?.activo).toBe(false);
    });
  });
});
