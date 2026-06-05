import { TipoConsultaService } from "../../services/tipo-consulta.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("TipoConsultaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("debería obtener todos los tipos de consulta", async () => {
      const mockTipos = [
        {
          tipo_consulta_id: 1,
          nombre: "Consulta General",
          descripcion: "Revisión general de salud",
          activo: true,
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockTipos);

      const result = await TipoConsultaService.findAll();

      expect(result).toEqual(mockTipos);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería obtener tipo de consulta por ID", async () => {
      const mockTipo = {
        tipo_consulta_id: 1,
        nombre: "Consulta General",
        descripcion: "Revisión",
        activo: true,
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([mockTipo]);

      const result = await TipoConsultaService.findById(1);

      expect(result).toEqual(mockTipo);
    });
  });
});
