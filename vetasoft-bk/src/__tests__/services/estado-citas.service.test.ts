import { EstadoCitasService } from "../../services/estado-citas.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("EstadoCitasService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("debería obtener todos los estados de cita", async () => {
      const mockEstados = [
        {
          estado_id: 1,
          estado_nombre: "Confirmada",
          descripcion: "Cita confirmada",
          activo: true,
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockEstados);

      const result = await EstadoCitasService.findAll({ activo: true });

      expect(result).toEqual(mockEstados);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería obtener estado de cita por ID", async () => {
      const mockEstado = {
        estado_id: 1,
        estado_nombre: "Confirmada",
        descripcion: "Cita confirmada",
        activo: true,
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([mockEstado]);

      const result = await EstadoCitasService.findById(1);

      expect(result).toEqual(mockEstado);
    });
  });
});
