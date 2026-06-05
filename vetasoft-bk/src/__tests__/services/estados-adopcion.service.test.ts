import { EstadosAdopcionService } from "../../services/estados-adopcion.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("EstadosAdopcionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("debería obtener todos los estados de adopción", async () => {
      const mockEstados = [
        {
          estado_id: 1,
          nombre: "Solicitada",
          descripcion: "Solicitud de adopción",
          activo: true,
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockEstados);

      const result = await EstadosAdopcionService.findAll({ activo: true });

      expect(result).toEqual(mockEstados);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería obtener estado de adopción por ID", async () => {
      const mockEstado = {
        estado_id: 1,
        nombre: "Solicitada",
        descripcion: "Solicitud",
        activo: true,
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([mockEstado]);

      const result = await EstadosAdopcionService.findById(1);

      expect(result).toEqual(mockEstado);
    });
  });
});
