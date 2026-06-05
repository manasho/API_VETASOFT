import { VeterinariosService } from "../../services/veterinarios.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("VeterinarioService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("debería obtener todos los veterinarios", async () => {
      const mockVeterinarios = [
        {
          veterinario_id: 1,
          usuario_id: 1,
          colegiado: "12345",
          especialidad: "General",
          usuario_nombre: "Dr. Martinez",
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockVeterinarios);

      const result = await VeterinariosService.findAll();

      expect(result).toEqual(mockVeterinarios);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería obtener veterinario por ID", async () => {
      const mockVeterinario = {
        veterinario_id: 1,
        usuario_nombre: "Dr. Martinez",
        especialidad: "General",
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([mockVeterinario]);

      const result = await VeterinariosService.findById('1');

      expect(result).toEqual(mockVeterinario);
    });
  });

  describe("create", () => {
    it("debería crear un nuevo veterinario", async () => {
      const newVeterinario = {
        usuario_id: 1,
        colegiado: "54321",
        especialidad: "Cirugía",
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { veterinario_id: 1, ...newVeterinario },
      ]);

      const result = await VeterinariosService.create(newVeterinario);

      expect(result).toBeDefined();
      expect(result.especialidad).toBe("Cirugía");
    });
  });
});
