import { AuthService } from "../../services/auth.service";
import * as db from "../../lib/db";
import { PasswordUtil } from "../../utils/password.util";
import { JwtUtil } from "../../utils/jwt.util";

jest.mock("../../lib/db");
jest.mock("../../utils/password.util");
jest.mock("../../utils/jwt.util");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("debería retornar error si el usuario no existe", async () => {
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([]);

      const result = await AuthService.login("noexiste@test.com", "password123");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Credenciales inválidas");
    });

    it("debería retornar error si la contraseña es incorrecta", async () => {
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        {
          usuario_id: 1,
          nombre: "Test User",
          correo: "test@test.com",
          contrasena: "hashed_password",
          rol_id: 1,
          activo: true,
          nombre_rol: "admin",
        },
      ]);
      (PasswordUtil.verify as jest.Mock).mockResolvedValueOnce(false);

      const result = await AuthService.login("test@test.com", "wrongpassword");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Credenciales inválidas");
    });

    it("debería generar token si las credenciales son válidas", async () => {
      (db.sql as unknown as jest.Mock)
        .mockResolvedValueOnce([
          {
            usuario_id: 1,
            nombre: "Test User",
            correo: "test@test.com",
            contrasena: "hashed_password",
            rol_id: 1,
            activo: true,
            nombre_rol: "admin",
          },
        ])
        .mockResolvedValueOnce([]);
      (PasswordUtil.verify as unknown as jest.Mock).mockResolvedValueOnce(true);
      (JwtUtil.generateToken as unknown as jest.Mock).mockReturnValueOnce("token123");

      const result = await AuthService.login("test@test.com", "password123");

      expect(result.success).toBe(true);
    });
  });
});
