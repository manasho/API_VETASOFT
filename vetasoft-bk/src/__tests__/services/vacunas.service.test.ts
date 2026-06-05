import { VacunasService } from "../../services/vacunas.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("VacunasService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("debería obtener todas las vacunas", async () => {
      const mockVacunas = [
        {
          vacuna_id: 1,
          nombre: "Rabia",
          descripcion: "Vacuna antirrábica",
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockVacunas);

      const result = await VacunasService.findAll('1');

      expect(result).toEqual(mockVacunas);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería obtener vacuna por ID", async () => {
      const mockVacuna = {
        vacuna_id: 1,
        nombre: "Rabia",
        descripcion: "Vacuna antirrábica",
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([mockVacuna]);

      const result = await VacunasService.findById("1");

      expect(result).toEqual(mockVacuna);
    });
  });

  describe("create", () => {
    it("debería crear una nueva vacuna", async () => {
      const newVacuna = {
        nombre: "DHPP",
        descripcion: "Vacuna combinada",
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { vacuna_id: 1, ...newVacuna },
      ]);

      const result = await VacunasService.create(newVacuna);

      expect(result).toBeDefined();
      expect(result.nombre).toBe("DHPP");
    });
  });
});
