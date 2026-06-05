# Guía de Pruebas Unitarias con Jest

## 📋 Estructura Configurada

Ya tenemos Jest configurado en el proyecto con:
- **jest.config.js** - Configuración principal
- **Scripts en package.json** para ejecutar pruebas
- **Estructura de carpetas**: `src/__tests__/` para organizar las pruebas

## 🚀 Comandos Principales

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch (se re-ejecutan al cambiar archivos)
npm run test:watch

# Ver cobertura de código
npm run test:coverage
```

## 📁 Estructura de Carpetas

```
src/
├── __tests__/
│   ├── services/
│   │   ├── usuarios.service.test.ts
│   │   └── animales.service.test.ts
│   └── utils/
│       └── password.util.test.ts
├── services/
├── utils/
└── ...
```

## 📝 Cómo Crear Nuevas Pruebas

### 1. Archivo de prueba para utilidades (sin dependencias):

```typescript
import { MiUtilidad } from '../../utils/mi-utilidad';

describe('MiUtilidad', () => {
  it('debería hacer algo específico', () => {
    const resultado = MiUtilidad.miMetodo('entrada');
    expect(resultado).toBe('salida esperada');
  });

  it('debería manejar casos especiales', () => {
    const resultado = MiUtilidad.miMetodo(null);
    expect(resultado).toBeNull();
  });
});
```

### 2. Archivo de prueba para servicios (con mocking):

```typescript
import { MiService } from '../../services/mi.service';
import * as db from '../../lib/db';

jest.mock('../../lib/db');

const mockedSql = db.sql as jest.MockedFunction<typeof db.sql>;

describe('MiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería obtener datos de la BD', async () => {
    const datosEsperados = [{ id: 1, nombre: 'Test' }];
    mockedSql.mockResolvedValueOnce(datosEsperados as any);

    const resultado = await MiService.findAll();

    expect(resultado).toEqual(datosEsperados);
    expect(mockedSql).toHaveBeenCalled();
  });

  it('debería manejar errores de BD', async () => {
    mockedSql.mockRejectedValueOnce(new Error('BD error'));

    await expect(MiService.findAll()).rejects.toThrow('BD error');
  });
});
```

## 🔧 Matchers Comunes

```typescript
// Igualdad
expect(valor).toBe(5);                    // igualdad estricta
expect(objeto).toEqual({id: 1});          // igualdad profunda

// Booleanos
expect(valor).toBeTruthy();
expect(valor).toBeFalsy();
expect(valor).toBeNull();
expect(valor).toBeUndefined();
expect(valor).toBeDefined();

// Números
expect(valor).toBeGreaterThan(5);
expect(valor).toBeGreaterThanOrEqual(5);
expect(valor).toBeLessThan(10);

// Strings
expect(texto).toContain('palabra');
expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

// Arrays/Objects
expect(array).toContain('elemento');
expect(array).toHaveLength(3);
expect(objeto).toHaveProperty('clave');

// Funciones
expect(funcion).toThrow();
expect(funcion).toThrow('mensaje específico');

// Async
await expect(promesa).resolves.toBe(5);
await expect(promesa).rejects.toThrow();
```

## 🎯 Mocking

### Mock de funciones:

```typescript
const mock = jest.fn();
mock.mockReturnValue(5);
mock.mockResolvedValue({ id: 1 });
mock.mockRejectedValue(new Error('error'));
mock.mockImplementation((x) => x * 2);

// Verificar llamadas
expect(mock).toHaveBeenCalled();
expect(mock).toHaveBeenCalledWith(arg1, arg2);
expect(mock).toHaveBeenCalledTimes(2);
```

### Mock de módulos:

```typescript
jest.mock('../../lib/db');
const db = require('../../lib/db');
db.sql.mockResolvedValue([]);
```

## 📊 Cobertura de Código

Ejecuta: `npm run test:coverage`

Verás:
- **Statements**: % de líneas ejecutadas
- **Branches**: % de condiciones probadas
- **Functions**: % de funciones llamadas
- **Lines**: % de líneas probadas

## 💡 Buenas Prácticas

✅ **Haz**:
- Una prueba por comportamiento
- Usa nombres descriptivos: `debería...`, `cuando...`
- Prueba casos normales y excepcionales
- Mock dependencias externas (BD, APIs)
- Limpia mocks después de cada prueba

❌ **Evita**:
- Pruebas muy largas
- Dependencias entre pruebas
- Hardcoding valores
- Pruebas de la BD real sin aislamiento
- Ignorar casos edge

## 📚 Ejemplos en el Proyecto

Consulta estos archivos como referencia:
- `src/__tests__/utils/password.util.test.ts` - Pruebas sin BD
- `src/__tests__/services/usuarios.service.test.ts` - Pruebas con mocking
- `src/__tests__/services/animales.service.test.ts` - Pruebas con filtros

## 🔗 Recursos

- Documentación: https://jestjs.io/
- Jest Docs: https://jestjs.io/docs/getting-started
- Matchers: https://jestjs.io/docs/expect
