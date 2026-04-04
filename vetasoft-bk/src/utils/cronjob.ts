import cron from 'node-cron';
import { CitasService } from '../services/citas.service';
import { NotificacionesService } from '../services/notificaciones.service';
import { UsuariosService } from '../services/usuarios.service';

/**
 * Lógica principal del cron job.
 * Exportada por separado para poder ejecutarla manualmente desde un endpoint de prueba.
 */
export const ejecutarRevisionCitas = async () => {
    console.info('🔍 Ejecutando revisión de citas...');

    // 1. Obtener citas de mañana
    const citas = await CitasService.getCitasManana();

    if (citas.length === 0) {
        console.info('✅ No hay citas para mañana.');
        return { mensaje: 'No hay citas para mañana.', notificaciones: 0 };
    }

    console.info(`✅ Encontradas ${citas.length} citas para mañana.`);
    let notificacionesCreadas = 0;

    // 2. Procesar cada cita
    for (const cita of citas) {
        const fecha = new Date(cita.fecha_cita).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

        // ── Notificación al CLIENTE (dueño del animal) ──────────────────
        // Solo funciona si el cliente tiene cuenta en 'usuarios' con el mismo correo
        const usuarioCliente = await UsuariosService.getUsuarioByAnimal(cita.animal_id);

        if (usuarioCliente) {
            const mensajeCliente = `Recordatorio: Tu mascota ${cita.animal_nombre} tiene una cita de ${cita.motivo} mañana a las ${fecha}.`;
            await NotificacionesService.crear({
                usuario_id: usuarioCliente.usuario_id,
                titulo: 'Recordatorio de Cita - Tu Mascota',
                mensaje: mensajeCliente,
                tipo: 'info',
            });
            console.info(`🔔 Notificación enviada al cliente (usuario_id: ${usuarioCliente.usuario_id} - ${usuarioCliente.nombre})`);
            notificacionesCreadas++;
        } else {
            console.info(`⚠️  Animal ${cita.animal_id} (${cita.animal_nombre}): el cliente no tiene cuenta de usuario, sin notificación de cliente.`);
        }

        // ── Notificación al VETERINARIO ─────────────────────────────────
        const usuarioVet = await UsuariosService.findById(cita.veterinario_usuario_id);

        if (usuarioVet) {
            const mensajeVet = `Recordatorio: Tienes una cita de ${cita.motivo} mañana a las ${fecha} con ${cita.animal_nombre} (dueño: ${cita.cliente_nombre}).`;
            await NotificacionesService.crear({
                usuario_id: usuarioVet.usuario_id,
                titulo: 'Recordatorio de Cita Programada',
                mensaje: mensajeVet,
                tipo: 'info',
            });
            console.info(`🔔 Notificación enviada al veterinario (usuario_id: ${usuarioVet.usuario_id} - ${usuarioVet.nombre})`);
            notificacionesCreadas++;
        }
    }

    return {
        mensaje: `Revisión completada.`,
        citas_encontradas: citas.length,
        notificaciones: notificacionesCreadas,
    };
};

/**
 * Registra el cron job en el scheduler.
 * '0 8 * * *' = todos los días a las 8 AM
 * '* * * * *' = cada minuto (solo para pruebas)
 */
export const setupCronJobs = () => {
    cron.schedule('0 8 * * *', async () => {
        try {
            await ejecutarRevisionCitas();
        } catch (error) {
            console.error('❌ Error en el Cron Job:', error);
        }
    });

    console.info('✅ Cron Job configurado para revisión de citas (08:00 AM diario).');
};