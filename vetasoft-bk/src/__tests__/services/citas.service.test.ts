import { CitasService } from "../../services/citas.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("CitasService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("debería obtener todas las citas", async () => {
      const mockCitas = [
        {
          cita_id: 1,
          animal_id: 1,
          veterinario_id: 1,
          estado_id: 1,
          animal_nombre: "Firulais",
          cliente_nombre: "Juan",
          veterinario_nombre: "Dr. Martinez",
          estado_nombre: "Confirmada",
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockCitas);

      const result = await CitasService.findAll({});

      expect(result).toEqual(mockCitas);
      expect(db.sql).toHaveBeenCalled();
    });

    it("debería filtrar citas por veterinario_id", async () => {
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([]);

      await CitasService.findAll({ veterinario_id: "1" });

      expect(db.sql).toHaveBeenCalled();
    });

    it("debería filtrar citas por rango de fechas", async () => {
      (db.sql as unknown     as jest.Mock).mockResolvedValueOnce([]);

      await CitasService.findAll({
        fecha_inicio: "2024-01-01",
        fecha_fin: "2024-12-31",
      });

      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería obtener cita por ID", async () => {
      const mockCita = {
        cita_id: 1,
        animal_id: 1,
        veterinario_id: 1,
        animal_nombre: "Firulais",
        animal_edad: 5,
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([mockCita]);

      const result = await CitasService.findById(1);

      expect(result).toBeDefined();
      expect(db.sql).toHaveBeenCalled();
    });
  });
});
