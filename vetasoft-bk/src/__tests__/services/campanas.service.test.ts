import { CampanasService } from "../../services/campanas.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("CampanasService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("debería obtener todas las campañas", async () => {
      const mockCampanas = [
        {
          campana_id: 1,
          nombre: "Vacunación",
          descripcion: "Campaña de vacunación",
          fecha_inicio: "2024-01-01",
          fecha_fin: "2024-12-31",
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockCampanas);

      const result = await CampanasService.findAll('2');

      expect(result).toEqual(mockCampanas);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("debería crear una nueva campaña", async () => {
      const newCampana = {
        nombre: "Esterilización",
        descripcion: "Campaña de esterilización",
        fecha_inicio: "2024-02-01",
        fecha_fin: "2024-03-31",
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { campana_id: 1, ...newCampana },
      ]);

      const result = await CampanasService.create(newCampana);

      expect(result).toBeDefined();
      expect(result.nombre).toBe("Esterilización");
    });
  });
});
