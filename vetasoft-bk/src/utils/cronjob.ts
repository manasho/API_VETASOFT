import cron from 'node-cron';
import { CitasService } from '../services/citas.service';
import { NotificacionesService } from '../services/notificaciones.service';
import { UsuariosService } from '../services/usuarios.service';


export const setupCronJobs = () => {
    // Tarea: Ejecutar cada minuto para pruebas (luego cambiar a '0 8 * * *' para las 8 AM)
    cron.schedule('* * * * *', async () => {
        console.info('🔍 Ejecutando revisión de citas (Cron Job)...');
        
        try {
            // 1. Obtener citas de mañana
            const citas = await CitasService.getCitasManana();
            
            if (citas.length === 0) {
                console.info('✅ No hay citas para mañana.');
                return;
            }

            console.info(`✅ Encontradas ${citas.length} citas para mañana.`);

            // 2. Procesar cada cita
            for (const cita of citas) {
                // Construir mensaje
                const mensaje = `Recordatorio: Tienes una cita de ${cita.motivo} mañana a las ${cita.hora_inicio}.`;
                
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
                    
                    // 4. (Futuro) Enviar Push Notification usando Firebase Admin SDK
                    // await NotificacionesService.enviarPush(usuario.fcm_token, mensaje);
                }
            }

        } catch (error) {
            console.error('❌ Error en el Cron Job:', error);
        }
    });

    console.info('✅ Cron Job configurado para revisión de citas.');
};