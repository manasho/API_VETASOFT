import { ModulosService } from "../../services/modulos.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("ModulosService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getModulosByRol", () => {
    it("debería obtener módulos por rol", async () => {
      const mockModulos = [
        {
          modulo_id: 1,
          nombre: "Gestión de Animales",
          icono: "icon-animales",
          ruta: "/animales",
          descripcion: "Módulo para gestionar animales",
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockModulos);

      const result = await ModulosService.getModulosByRol(1);

      expect(result).toEqual(mockModulos);
      expect(db.sql).toHaveBeenCalled();
    });
  });
});
