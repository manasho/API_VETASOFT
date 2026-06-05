import { HistorialVacunacionService } from "../../services/historial-vacunacion.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("HistorialVacunacionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findByAnimalId", () => {
    it("debería obtener historial de vacunación por animal ID", async () => {
      const mockHistorial = [
        {
          vacunacion_id: 1,
          animal_id: 1,
          vacuna_id: 1,
          fecha_vacunacion: "2024-01-01",
          vacuna_nombre: "Rabia",
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockHistorial);

      const result = await HistorialVacunacionService.findAll({
        animal_id: "1",
      });

      expect(result).toEqual(mockHistorial);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería obtener registro de vacunación por ID", async () => {
      const mockVacunacion = {
        vacunacion_id: 1,
        vacuna_nombre: "Rabia",
        animal_id: 1,
        vacuna_id: 1,
        fecha_vacunacion: "2024-01-01",
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([mockVacunacion]);

      const result = await HistorialVacunacionService.findById("1");

      expect(result).toEqual(mockVacunacion);
    });
  });

  describe("create", () => {
    it("debería registrar una nueva vacunación", async () => {
      const newVacunacion = {
        animal_id: 1,
        vacuna_id: 1,
        fecha_vacunacion: "2024-01-01",
        veterinario_id: 1,
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { vacunacion_id: 1, ...newVacunacion },
      ]);

      const result = await HistorialVacunacionService.create(newVacunacion);

      expect(result).toBeDefined();
      expect(db.sql).toHaveBeenCalled();
    });
  });
});
