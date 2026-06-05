import { NotificacionesService } from "../../services/notificaciones.service";
import * as db from "../../lib/db";

jest.mock("../../lib/db");

describe("NotificacionesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getNotificaciones", () => {
    it("debería obtener notificaciones del usuario", async () => {
      const mockNotificaciones = [
        {
          notificacion_id: 1,
          usuario_id: 1,
          titulo: "Nueva cita",
          mensaje: "Tu cita ha sido confirmada",
          leida: false,
        },
      ];
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce(mockNotificaciones);

      const result = await NotificacionesService.getNotificaciones(1);

      expect(result).toEqual(mockNotificaciones);
      expect(db.sql).toHaveBeenCalled();
    });
  });

  describe("contarNoLeidas", () => {
    it("debería contar notificaciones no leídas", async () => {
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { total: "5" },
      ]);

      const result = await NotificacionesService.contarNoLeidas(1);

      expect(result).toBe(5);
    });
  });

  describe("marcarLeida", () => {
    it("debería marcar notificación como leída", async () => {
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { notificacion_id: 1, leida: true, usuario_id: 1 },
      ]);

      const result = await NotificacionesService.marcarLeida(1, 1);

      expect(result).toBeDefined();
      expect(result?.leida).toBe(true);
    });
  });

  describe("marcarTodasLeidas", () => {
    it("debería marcar todas las notificaciones como leídas", async () => {
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { notificacion_id: 1 },
        { notificacion_id: 2 },
      ]);

      const result = await NotificacionesService.marcarTodasLeidas(1);

      expect(result).toBe(2);
    });
  });

  describe("crear", () => {
    it("debería crear una nueva notificación", async () => {
      const newNotificacion = {
        usuario_id: 1,
        titulo: "Nueva notificación",
        mensaje: "Tienes una nueva notificación",
        tipo: "info" as const,
      };
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { notificacion_id: 1, ...newNotificacion },
      ]);

      const result = await NotificacionesService.crear(newNotificacion);

      expect(result).toBeDefined();
      expect(result?.titulo).toBe("Nueva notificación");
    });
  });

  describe("eliminar", () => {
    it("debería eliminar notificación", async () => {
      (db.sql as unknown as jest.Mock).mockResolvedValueOnce([
        { notificacion_id: 1, usuario_id: 1, leida: false },
      ]);
      const result = await NotificacionesService.eliminar(1, 1);

      expect(result).toBeDefined();
      expect(result?.notificacion_id).toBe(1);
    });
  });
});

