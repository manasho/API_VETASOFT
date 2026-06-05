import { RolesService } from "../../services/roles.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("RolesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("debería obtener todos los roles", async () => {
      const mockRoles = [
        {
          rol_id: 1,
          nombre_rol: "Admin",
          descripcion: "Administrador del sistema",
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockRoles);

      const result = await RolesService.findAll();

      expect(result).toEqual(mockRoles);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería obtener rol por ID", async () => {
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { rol_id: 1, nombre_rol: "Admin" },
      ]);

      const result = await RolesService.findById(1);

      expect(result).toBeDefined();
    });
  });

 

});
