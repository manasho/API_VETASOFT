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
        const mensaje = `Recordatorio: Tienes una cita de ${cita.motivo} mañana a las ${fecha}.`;

        // Buscar usuario responsable (dueño del animal)
        const usuario = await UsuariosService.getUsuarioByAnimal(cita.animal_id);

        if (usuario) {
            // 3. Guardar notificación en la base de datos
            await NotificacionesService.crear({
                usuario_id: usuario.usuario_id,
                titulo: 'Recordatorio de Cita',
                mensaje: mensaje,
                tipo: 'info',
            });

            console.info(`🔔 Notificación creada para usuario ${usuario.usuario_id}`);
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