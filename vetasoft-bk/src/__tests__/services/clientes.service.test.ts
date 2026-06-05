import { ClientesService } from "../../services/clientes.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("ClientesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("debería obtener todos los clientes activos", async () => {
      const mockClientes = [
        {
          cliente_id: 1,
          nombre: "Juan Pérez",
          correo: "juan@test.com",
          telefono: "1234567890",
          empleado_nombre: "Admin",
          total_animales: 2,
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockClientes);

      const result = await ClientesService.findAll();

      expect(result).toEqual(mockClientes);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("debería crear un nuevo cliente", async () => {
      const newCliente = {
        nombre: "Carlos García",
        correo: "carlos@test.com",
        telefono: "9876543210",
        direccion: "Calle 123",
        fecha_nacimiento: "1990-01-01",
        documento_id: "123456789",
        empleado_id: 1,
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { cliente_id: 1, ...newCliente },
      ]);

      const result = await ClientesService.create(newCliente);

      expect(result).toBeDefined();
      expect(result.nombre).toBe("Carlos García");
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("debería obtener cliente por ID", async () => {
      const mockCliente = {
        cliente_id: 1,
        nombre: "Juan Pérez",
        correo: "juan@test.com",
        empleado_nombre: "Admin",
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([mockCliente]);

      const result = await ClientesService.findById("1");

      expect(result).toEqual(mockCliente);
    });
  });
});
