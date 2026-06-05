import { SolicitudesAdopcionService } from "../../services/solicitudes-adopcion.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("SolicitudesAdopcionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("debería obtener todas las solicitudes de adopción", async () => {
      const mockSolicitudes = [
        {
          solicitud_id: 1,
          animal_id: 1,
          cliente_id: 1,
          estado_id: 1,
          fecha_solicitud: "2024-01-01",
          animal_nombre: "Firulais",
          cliente_nombre: "Juan",
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockSolicitudes);

      const result = await SolicitudesAdopcionService.findAll({ estado_id: 1 });

      expect(result).toEqual(mockSolicitudes);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("debería crear una nueva solicitud de adopción", async () => {
      const newSolicitud = {
        animal_id: 1,
        cliente_id: 1,
        estado_id: 1,
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { solicitud_id: 1, ...newSolicitud },
      ]);

      const result = await SolicitudesAdopcionService.create(newSolicitud);

      expect(result).toBeDefined();
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería obtener solicitud de adopción por ID", async () => {
      const mockSolicitud = {
        solicitud_id: 1,
        animal_nombre: "Firulais",
        cliente_nombre: "Juan",
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([mockSolicitud]);

      const result = await SolicitudesAdopcionService.findById("1");

      expect(result).toEqual(mockSolicitud);
    });
  });
});
