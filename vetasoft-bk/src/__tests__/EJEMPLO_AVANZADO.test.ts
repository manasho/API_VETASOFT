/**
 * EJEMPLO AVANZADO: Pruebas unitarias con Jest
 * Patrones y buenas prácticas
 */

// ============================================
// EJEMPLO 1: Utilidad sin dependencias
// ============================================

describe('UtilitarioSimple', () => {
  // Arrange, Act, Assert (AAA pattern)
  it('debería validar emails correctamente', () => {
    // Arrange
    const emails = {
      validos: ['user@example.com', 'test.email@domain.co.uk'],
      invalidos: ['noatdomain', '@nodomain.com', 'user@'],
    };

    // Act & Assert
    emails.validos.forEach(email => {
      const esValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(esValido).toBe(true);
    });

    emails.invalidos.forEach(email => {
      const esValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(esValido).toBe(false);
    });
  });
});

// ============================================
// EJEMPLO 2: Mocking de funciones
// ============================================

describe('ServicioConCallbacks', () => {
  it('debería llamar callback con resultados', () => {
    // Mock de callback
    const mockCallback = jest.fn();

    // Simular llamada
    [1, 2, 3].forEach(valor => {
      mockCallback(valor * 2);
    });

    // Verificaciones
    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toHaveBeenNthCalledWith(1, 2);
    expect(mockCallback).toHaveBeenNthCalledWith(2, 4);
    expect(mockCallback).toHaveBeenNthCalledWith(3, 6);
  });
});

// ============================================
// EJEMPLO 3: Pruebas de promesas
// ============================================

describe('FuncionesAsincrondas', () => {
  it('debería resolver promesa correctamente', async () => {
    const promesa = Promise.resolve({ id: 1, nombre: 'Test' });
    
    await expect(promesa).resolves.toMatchObject({
      id: 1,
      nombre: 'Test',
    });
  });

  it('debería rechazar promesa con error', async () => {
    const promesa = Promise.reject(new Error('Fallo intencional'));
    
    await expect(promesa).rejects.toThrow('Fallo intencional');
  });

  it('debería manejar múltiples operaciones asincronas', async () => {
    const resultados = await Promise.all([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ]);

    expect(resultados).toEqual([1, 2, 3]);
  });
});

// ============================================
// EJEMPLO 4: Setup y Teardown
// ============================================

describe('GestorDeRecursos', () => {
  let recurso: any;

  beforeAll(() => {
    console.log('Se ejecuta UNA VEZ antes de todas las pruebas');
  });

  beforeEach(() => {
    console.log('Se ejecuta ANTES de cada prueba');
    recurso = { conectado: true };
  });

  afterEach(() => {
    console.log('Se ejecuta DESPUÉS de cada prueba');
    recurso = null;
  });

  afterAll(() => {
    console.log('Se ejecuta UNA VEZ después de todas las pruebas');
  });

  it('debería tener recurso disponible', () => {
    expect(recurso.conectado).toBe(true);
  });

  it('debería usar recurso compartido', () => {
    expect(recurso).toBeDefined();
  });
});

// ============================================
// EJEMPLO 5: Pruebas parametrizadas
// ============================================

describe('CalculadoraParametrizada', () => {
  const casos = [
    { entrada: 2, esperado: 4, descripcion: 'número par' },
    { entrada: 3, esperado: 9, descripcion: 'número impar' },
    { entrada: 0, esperado: 0, descripcion: 'cero' },
    { entrada: -2, esperado: 4, descripcion: 'número negativo' },
  ];

  casos.forEach(({ entrada, esperado, descripcion }) => {
    it(`debería calcular cuadrado de ${descripcion}`, () => {
      const resultado = entrada * entrada;
      expect(resultado).toBe(esperado);
    });
  });

  // Alternativa con test.each
  test.each([
    [1, 1],
    [2, 4],
    [3, 9],
    [4, 16],
  ])('el cuadrado de %i debería ser %i', (entrada, esperado) => {
    expect(entrada * entrada).toBe(esperado);
  });
});

// ============================================
// EJEMPLO 6: Spies y verificación de llamadas
// ============================================

describe('IntegracionConMetodos', () => {
  it('debería verificar llamadas a métodos', () => {
    const objeto = {
      metodo: jest.fn(() => 'resultado'),
    };

    // Usar el método
    const resultado1 = objeto.metodo('arg1');
    const resultado2 = objeto.metodo('arg2');

    // Verificaciones
    expect(objeto.metodo).toHaveBeenCalledTimes(2);
    expect(objeto.metodo).toHaveBeenNthCalledWith(1, 'arg1');
    expect(objeto.metodo).toHaveBeenNthCalledWith(2, 'arg2');
    expect(resultado1).toBe('resultado');
  });

  it('debería usar spy en método existente', () => {
    const usuario = {
      saludar: (nombre: string) => `Hola, ${nombre}`,
    };

    const spy = jest.spyOn(usuario, 'saludar');

    usuario.saludar('Juan');

    expect(spy).toHaveBeenCalledWith('Juan');
    spy.mockRestore();
  });
});

// ============================================
// EJEMPLO 7: Pruebas de excepciones
// ============================================

describe('ManejodeErrores', () => {
  const validarEdad = (edad: number) => {
    if (edad < 0) throw new Error('La edad no puede ser negativa');
    if (edad > 150) throw new Error('La edad no es válida');
    return true;
  };

  it('debería lanzar error para edad negativa', () => {
    expect(() => validarEdad(-5)).toThrow('La edad no puede ser negativa');
  });

  it('debería lanzar error para edad muy alta', () => {
    expect(() => validarEdad(200)).toThrow('La edad no es válida');
  });

  it('debería validar edades correctas', () => {
    expect(() => validarEdad(30)).not.toThrow();
  });
});

// ============================================
// EJEMPLO 8: Snapshots (comparación visual)
// ============================================

describe('SnapshotTesting', () => {
  it('debería hacer snapshot de objeto complejo', () => {
    const usuario = {
      id: 1,
      nombre: 'Juan',
      email: 'juan@example.com',
      createdAt: new Date('2024-01-01'),
    };

    // Primera ejecución: crea el snapshot
    // Ejecuciones posteriores: compara con el snapshot
    expect(usuario).toMatchSnapshot();

    // Para snapshots parciales
    expect({
      nombre: usuario.nombre,
      email: usuario.email,
    }).toMatchSnapshot();
  });
});

// ============================================
// EJEMPLO 9: Skip y Only (debugging)
// ============================================

describe('DebuggingDePruebas', () => {
  it('debería ejecutarse normalmente', () => {
    expect(true).toBe(true);
  });

  it.skip('debería ser saltada', () => {
    // Esta prueba NO se ejecuta
    expect(true).toBe(false);
  });

  it.todo('debería implementar test pendiente');

  // Para debuggear un test específico:
  // Descomenta la siguiente línea para ejecutar SOLO este test:
  // it.only('debería ejecutarse solo este', () => {
  //   expect(true).toBe(true);
  // });
});

// ============================================
// EJEMPLO 10: Prueba de cobertura
// ============================================

describe('CoberturaDeCodigo', () => {
  const procesar = (tipo: string, valor: number) => {
    if (tipo === 'suma') return valor + 10;
    if (tipo === 'resta') return valor - 10;
    if (tipo === 'multiplicacion') return valor * 10;
    return 0;
  };

  // Para 100% de cobertura, necesitas probar todos los caminos:
  
  it('debería sumar', () => {
    expect(procesar('suma', 5)).toBe(15);
  });

  it('debería restar', () => {
    expect(procesar('resta', 20)).toBe(10);
  });

  it('debería multiplicar', () => {
    expect(procesar('multiplicacion', 5)).toBe(50);
  });

  it('debería retornar 0 para tipo desconocido', () => {
    expect(procesar('desconocido', 5)).toBe(0);
  });
});
