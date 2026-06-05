import { EspeciesService } from "../../services/especies.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("EspeciesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("debería obtener todas las especies", async () => {
      const mockEspecies = [
        {
          especie_id: 1,
          nombre: "Perro",
          descripcion: "Canis familiaris",
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockEspecies);

      const result = await EspeciesService.findAll();

      expect(result).toEqual(mockEspecies);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería obtener especie por ID", async () => {
      const mockEspecie = {
        especie_id: 1,
        nombre: "Perro",
        descripcion: "Canis familiaris",
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([mockEspecie]);

      const result = await EspeciesService.findById("1");

      expect(result).toEqual(mockEspecie);
    });
  });

  describe("create", () => {
    it("debería crear una nueva especie", async () => {
      const newEspecie = {
        nombre: "Gato",
        descripcion: "Felis catus",
      };
      (db.sql as unknown     as jest.Mock).mockResolvedValueOnce([
        { especie_id: 1, ...newEspecie },
      ]);

      const result = await EspeciesService.create(newEspecie);

      expect(result).toBeDefined();
      expect(result.nombre).toBe("Gato");
    });
  });
});
