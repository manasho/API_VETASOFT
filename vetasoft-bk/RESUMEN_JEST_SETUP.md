# 📊 Jest Setup Completado - VetaSoft Backend

## ✅ Lo que hemos configurado

### 1. **Instalación**
- ✅ Jest (framework de testing)
- ✅ ts-jest (integración con TypeScript)
- ✅ @types/jest (tipos de TypeScript)

### 2. **Configuración**
- ✅ `jest.config.js` - configuración optimizada
- ✅ Scripts en `package.json`:
  - `npm test` - ejecutar pruebas una vez
  - `npm run test:watch` - modo watch
  - `npm run test:coverage` - reporte de cobertura

### 3. **Estructura de Pruebas**
```
src/__tests__/
├── services/
│   ├── usuarios.service.test.ts     (19 tests) ✅
│   └── animales.service.test.ts     (9 tests)  ✅
├── utils/
│   └── password.util.test.ts        (10 tests) ✅
└── EJEMPLO_AVANZADO.test.ts         (17 tests) ✅
```

## 📈 Estado Actual

| Métrica | Valor |
|---------|-------|
| **Test Suites** | 4 pasando ✅ |
| **Tests Totales** | 57 tests |
| **Tests Pasando** | 55 ✅ |
| **Tests Saltados** | 1 (skip) |
| **Tests Pendientes** | 1 (todo) |
| **Cobertura PasswordUtil** | 100% ✅ |
| **Cobertura UsuariosService** | 92.59% |

## 🚀 Próximos Pasos

### Paso 1: Crear más pruebas
Copia este template para nuevos servicios:

```typescript
import { MiService } from '../../services/mi.service';
import * as db from '../../lib/db';

jest.mock('../../lib/db');

describe('MiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería retornar todos los registros', async () => {
      const datosEsperados = [{ id: 1, nombre: 'test' }];
      (db.sql as jest.Mock).mockResolvedValueOnce(datosEsperados);

      const result = await MiService.findAll();

      expect(result).toEqual(datosEsperados);
    });
  });
});
```

### Paso 2: Aumentar cobertura
Objetivo: **80%+ de cobertura**

Ejecuta:
```bash
npm run test:coverage
```

Luego crea pruebas para:
- [ ] `src/services/` - Servicios principales
- [ ] `src/middleware/` - Middleware de autenticación
- [ ] `src/utils/` - Utilidades

### Paso 3: Automatización
Agrega a CI/CD (GitHub Actions, etc.):
```yaml
- name: Run Tests
  run: npm test -- --coverage
```

## 📚 Documentación Disponible

- **[GUIA_JEST.md](./GUIA_JEST.md)** - Guía completa de Jest
- **[src/__tests__/EJEMPLO_AVANZADO.test.ts](./src/__tests__/EJEMPLO_AVANZADO.test.ts)** - Patrones avanzados
- **Ejemplos reales**: 
  - [UsuariosService tests](./src/__tests__/services/usuarios.service.test.ts)
  - [PasswordUtil tests](./src/__tests__/utils/password.util.test.ts)

## 🔧 Comandos Útiles

```bash
# Ejecutar una prueba específica
npm test -- usuarios.service.test

# Ejecutar en modo watch (rerun automático)
npm run test:watch

# Ver cobertura detallada
npm run test:coverage

# Debuggear una prueba (Node inspector)
node --inspect-brk node_modules/.bin/jest --runInBand

# Actualizar snapshots
npm test -- -u
```

## 💡 Tips Importantes

### 1. **Mock de BD**
```typescript
jest.mock('../../lib/db');
const mockedSql = db.sql as jest.MockedFunction<typeof db.sql>;

mockedSql.mockResolvedValueOnce([{ id: 1 }]);
```

### 2. **Pruebas Asincronas**
```typescript
it('debería hacer algo async', async () => {
  const resultado = await MiService.obtener();
  expect(resultado).toBeDefined();
});
```

### 3. **Manejo de Errores**
```typescript
it('debería rechazar con error', async () => {
  mockedSql.mockRejectedValueOnce(new Error('BD error'));
  
  await expect(MiService.obtener()).rejects.toThrow('BD error');
});
```

### 4. **Limpiar mocks**
```typescript
beforeEach(() => {
  jest.clearAllMocks(); // Limpia entre pruebas
});
```

## 📋 Checklist para Nueva Prueba

- [ ] ¿Está el archivo en `src/__tests__/`?
- [ ] ¿Tiene un nombre descriptivo? (`.test.ts` o `.spec.ts`)
- [ ] ¿Usa `describe()` para agrupar pruebas?
- [ ] ¿Usa nombres claros? (`it('debería...')`)
- [ ] ¿Mock las dependencias externas?
- [ ] ¿Testa casos normales Y excepciones?
- [ ] ¿Limpia mocks en `beforeEach()`?
- [ ] ¿Las pruebas son independientes?

## 🎯 Objetivo Final

Alcanzar **80-90% de cobertura** en:
- ✅ Utilidades (`utils/`)
- ✅ Servicios (`services/`)
- ⏳ Middleware (`middleware/`)
- ⏳ Routes (`routes/`)

---

**Última actualización:** 5 de junio de 2026
**Jest Version:** v29.x
**TypeScript:** v5.3.2
