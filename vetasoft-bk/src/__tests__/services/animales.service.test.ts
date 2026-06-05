/**
 * Ejemplo de pruebas unitarias para AnimalesService
 * Este archivo muestra cómo estructurar pruebas con mocking de la BD
 */

import { AnimalesService } from '../../services/animales.service';
import * as db from '../../lib/db';

jest.mock('../../lib/db');

const mockedSql = db.sql as jest.MockedFunction<typeof db.sql>;

describe('AnimalesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería retornar todos los animales', async () => {
      const animalesEsperados = [
        {
          animal_id: 1,
          nombre: 'Rex',
          especie: 'Perro',
          cliente_id: 1,
        },
        {
          animal_id: 2,
          nombre: 'Michi',
          especie: 'Gato',
          cliente_id: 2,
        },
      ];

      mockedSql.mockResolvedValueOnce(animalesEsperados as any);

      const result = await AnimalesService.findAll({ cliente_id: null, estado: null });

      expect(result).toEqual(animalesEsperados);
      expect(result.length).toBe(2);
    });

    it('debería retornar un array vacío si no hay animales', async () => {
      mockedSql.mockResolvedValueOnce([] as any);

      const result = await AnimalesService.findAll({ cliente_id: null, estado: null });

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findById', () => {
    it('debería retornar un animal por su ID', async () => {
      const animalEsperado = {
        animal_id: 1,
        nombre: 'Rex',
        especie: 'Perro',
        cliente_id: 1,
      };

      mockedSql.mockResolvedValueOnce([animalEsperado] as any);

      const result = await AnimalesService.findById('animal_1');

      expect(result).toEqual(animalEsperado);
    });

    it('debería retornar null si el animal no existe', async () => {
      mockedSql.mockResolvedValueOnce([] as any);

      const result = await AnimalesService.findById('animal_999');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('debería crear un nuevo animal', async () => {
      const nuevoAnimal = {
        nombre: 'Fluffy',
        especie: 'Gato',
        cliente_id: 1,
        raza_id: 1,
      };

      const animalCreado = {
        animal_id: 3,
        nombre: 'Fluffy',
        especie: 'Gato',
        cliente_id: 1,
      };

      mockedSql.mockResolvedValueOnce([animalCreado] as any);

      const result = await AnimalesService.create(nuevoAnimal);

      expect(result).toEqual(animalCreado);
      expect(result.animal_id).toBe(3);
    });
  });

  describe('Validaciones y edge cases', () => {
    it('debería manejar nombres especiales', async () => {
      const animal = {
        nombre: "O'Connell",
        especie: 'Perro',
        cliente_id: 1,
      };

      mockedSql.mockResolvedValueOnce([{ animal_id: 1, ...animal }] as any);

      const result = await AnimalesService.create(animal);

      expect(result).toBeDefined();
    });
  });
});
