import { PasswordUtil } from '../../utils/password.util';

describe('PasswordUtil', () => {
  describe('hash', () => {
    it('debería hashear una contraseña correctamente', async () => {
      const password = 'miContraseña123';
      const hash = await PasswordUtil.hash(password);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('debería generar diferentes hashes para la misma contraseña', async () => {
      const password = 'miContraseña123';
      const hash1 = await PasswordUtil.hash(password);
      const hash2 = await PasswordUtil.hash(password);
      
      expect(hash1).not.toBe(hash2);
    });

    it('debería manejar contraseñas largas', async () => {
      const longPassword = 'a'.repeat(100);
      const hash = await PasswordUtil.hash(longPassword);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });
  });

  describe('verify', () => {
    it('debería verificar una contraseña correcta', async () => {
      const password = 'miContraseña123';
      const hash = await PasswordUtil.hash(password);
      const isValid = await PasswordUtil.verify(password, hash);
      
      expect(isValid).toBe(true);
    });

    it('debería rechazar una contraseña incorrecta', async () => {
      const password = 'miContraseña123';
      const wrongPassword = 'contraseñaIncorrecta';
      const hash = await PasswordUtil.hash(password);
      const isValid = await PasswordUtil.verify(wrongPassword, hash);
      
      expect(isValid).toBe(false);
    });

    it('debería ser sensible a mayúsculas y minúsculas', async () => {
      const password = 'MiContraseña123';
      const differentCase = 'micontraseña123';
      const hash = await PasswordUtil.hash(password);
      const isValid = await PasswordUtil.verify(differentCase, hash);
      
      expect(isValid).toBe(false);
    });

    it('debería manejar contraseñas vacías', async () => {
      const password = '';
      const hash = await PasswordUtil.hash(password);
      const isValid = await PasswordUtil.verify('', hash);
      
      expect(isValid).toBe(true);
    });
  });

  describe('Integración hash y verify', () => {
    it('debería hashear y verificar correctamente una secuencia de contraseñas', async () => {
      const passwords = ['pass1', 'pass2', 'contraseña123', 'SecurePass!@#'];
      
      for (const password of passwords) {
        const hash = await PasswordUtil.hash(password);
        const isValid = await PasswordUtil.verify(password, hash);
        expect(isValid).toBe(true);
      }
    });
  });
});
