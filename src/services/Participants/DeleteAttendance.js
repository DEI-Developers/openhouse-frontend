import apiInstance from '@utils/instances/ApiInstance';

/**
 * Elimina la asistencia de un participante específico
 * @param {object} attendanceData - Datos de asistencia del participante
 * @returns {Promise} Respuesta de la API
 */
const deleteParticipantAttendance = async (attendanceData) => {
  const response = await apiInstance.delete('/participants/event-attendance', {
    data: {
      eventId: attendanceData.eventId,
      participantId: attendanceData.participantId,
    },
  });

  return response.data;
};

export default deleteParticipantAttendance;
