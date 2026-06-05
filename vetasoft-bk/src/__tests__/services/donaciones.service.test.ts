import { DonacionesService } from "../../services/donaciones.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("DonacionesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("debería obtener todas las donaciones", async () => {
      const mockDonaciones = [
        {
          donacion_id: 1,
          cliente_id: 1,
          monto: 100,
          fecha: "2024-01-01",
          cliente_nombre: "Juan",
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockDonaciones);

      const result = await DonacionesService.findAll(null, null);

      expect(result).toEqual(mockDonaciones);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("debería crear una nueva donación", async () => {
      const newDonacion = {
        cliente_id: 1,
        monto: 500,
        descripcion: "Donación voluntaria",
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { donacion_id: 1, ...newDonacion },
      ]);

      const result = await DonacionesService.create(newDonacion);

      expect(result).toBeDefined();
      expect(result.monto).toBe(500);
    });
  });

  describe("findById", () => {
    it("debería obtener donación por ID", async () => {
      const mockDonacion = {
        donacion_id: 1,
        monto: 100,
        cliente_id: 1,
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([mockDonacion]);

      const result = await DonacionesService.findById(1);

      expect(result).toEqual(mockDonacion);
    });
  });
});
