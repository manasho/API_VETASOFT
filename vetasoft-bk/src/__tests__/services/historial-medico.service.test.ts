import { HistorialMedicoService } from "../../services/historial-medico.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("HistorialMedicoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("debería obtener historial médico por ID", async () => {
      const mockHistorial = {
        historial_id: 1,
        animal_id: 1,
        descripcion: "Revisión general",
        fecha: "2024-01-01",
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([mockHistorial]);

      const result = await HistorialMedicoService.findById("1");

      expect(result).toEqual(mockHistorial);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("debería crear un nuevo registro de historial", async () => {
      const newHistorial = {
        animal_id: 1,
        descripcion: "Vacunación",
        veterinario_id: 1,
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { historial_id: 1, ...newHistorial },
      ]);

      const result = await HistorialMedicoService.create(newHistorial);

      expect(result).toBeDefined();
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería obtener registro de historial por ID", async () => {
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { historial_id: 1, descripcion: "Vacunación" },
      ]);

      const result = await HistorialMedicoService.findById("1");

      expect(result).toBeDefined();
    });
  });
});
