import { RazasService } from "../../services/razas.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("RazasService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("debería obtener todas las razas", async () => {
      const mockRazas = [
        {
          raza_id: 1,
          nombre: "Labrador",
          especie_id: 1,
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockRazas);

      const result = await RazasService.findAll({ especie_id: 1 });

      expect(result).toEqual(mockRazas);
      expect(db.sql).toHaveBeenCalled();
    });
  });

 
  describe("create", () => {
    it("debería crear una nueva raza", async () => {
      const newRaza = {
        nombre: "Pastor Alemán",
        especie_id: 1,
      };
      (db.sql as unknown     as jest.Mock).mockResolvedValueOnce([
        { raza_id: 1, ...newRaza },
      ]);

      const result = await RazasService.create(newRaza);

      expect(result).toBeDefined();
      expect(result.nombre).toBe("Pastor Alemán");
    });
  });
});
