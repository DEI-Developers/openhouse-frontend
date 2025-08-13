/* eslint-disable prettier/prettier */
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import {formatPhoneNumber} from '@utils/helpers/formatters';
import {getParticipants} from '@services/Participants';

/**
 * Servicio para la exportación de participantes a Excel
 * Maneja toda la lógica compleja de preparación de datos y creación del archivo Excel
 */

/**
 * Genera un nombre seguro para las hojas de Excel
 * Reemplaza caracteres prohibidos y limita la longitud a 31 caracteres
 * @param {string} eventName - Nombre del evento
 * @param {string} eventDate - Fecha del evento formateada
 * @returns {string} Nombre seguro para la hoja de Excel
 */
const generateSafeSheetName = (eventName, eventDate) => {
  const rawSheetName = `${eventDate} - ${eventName}`;
  // Reemplazar caracteres prohibidos en nombres de hoja de Excel: : \ / ? * [ ]
  const safeSheetName = rawSheetName
    .replace(/[:\\\/\?\*\[\]]/g, '-')
    .slice(0, 31); // Máximo 31 caracteres para nombres de hoja en Excel

  return safeSheetName;
};

/**
 * Formatea la fecha del evento para mostrar en formato local
 * @param {string|Date} date - Fecha del evento
 * @returns {string} Fecha formateada en formato dd/mm/yyyy
 */
const formatEventDate = (date) => {
  return new Date(date).toLocaleDateString('es-SV', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Procesa los datos de participantes para la hoja general
 * @param {Array} participants - Array de participantes
 * @returns {Array} Array de objetos con datos formateados para Excel ordenados por fecha de inscripción
 */
const processParticipantsSheet = (participants) => {
  // Ordenar participantes por fecha de inscripción (más recientes primero)
  const sortedParticipants = [...participants].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return sortedParticipants.map((p) => ({
    Nombre: p.name,
    Email: p.email,
    Teléfono: formatPhoneNumber(p.phoneNumber),
    Instituto: p.institute,
    Medio: p.medio,
    Redes: p.networksLabel,
    'Registrado en': new Date(p.createdAt).toLocaleString('es-SV'),
  }));
};

/**
 * Procesa las inscripciones de participantes y las categoriza por evento
 * @param {Array} participants - Array de participantes
 * @returns {Object} Objeto con hojas de eventos categorizadas
 */
const processEventSheets = (participants) => {
  const eventSheets = {}; // { "Nombre evento - fecha": [inscripciones...] }

  participants.forEach((p) => {
    // Categorizar inscripciones por evento
    if (Array.isArray(p.subscribedTo)) {
      p.subscribedTo.forEach((sub) => {
        const eventName = sub.event?.name || 'Evento desconocido';
        const eventDate = formatEventDate(sub.event?.date);

        // Generar nombre seguro para la hoja de Excel
        const safeSheetName = generateSafeSheetName(eventName, eventDate);

        const row = {
          Nombre: p.name,
          Email: p.email,
          Teléfono: formatPhoneNumber(p.phoneNumber),
          Instituto: p.institute,
          Facultad: sub.faculty?.name ?? 'N/A',
          Carrera: sub.career?.name ?? 'N/A',
          Evento: eventName,
          medio: p.medio,
          Redes: p.networksLabel,
          FechaEvento: eventDate,
          Asistió: sub.attended ? 'Sí' : 'No',
          'Acompañado por familiar': sub.withParent ? 'Sí' : 'No',
          'Familiar estudió en UCA': sub.parentStudiedAtUCA ? 'Sí' : 'No',
          FechaInscripción: new Date(sub.subscribedAt).toLocaleString('es-SV'),
          _subscribedAtRaw: sub.subscribedAt, // Campo auxiliar para ordenamiento
        };

        if (!eventSheets[safeSheetName]) {
          eventSheets[safeSheetName] = [];
        }
        eventSheets[safeSheetName].push(row);
      });
    }
  });

  // Ordenar las inscripciones dentro de cada evento por fecha de inscripción (más recientes primero)
  Object.keys(eventSheets).forEach((sheetName) => {
    eventSheets[sheetName].sort((a, b) => {
      const dateB = new Date(b._subscribedAtRaw).getTime();
      const dateA = new Date(a._subscribedAtRaw).getTime();
      return dateB - dateA;
    });
    
    // Eliminar el campo auxiliar después del ordenamiento
    eventSheets[sheetName].forEach(row => {
      delete row._subscribedAtRaw;
    });
  });

  return eventSheets;
};

/**
 * Crea el archivo Excel con múltiples hojas
 * @param {Array} participantsSheet - Datos para la hoja general de participantes
 * @param {Object} eventSheets - Datos categorizados por evento
 * @returns {Blob} Blob del archivo Excel generado
 */
const createExcelFile = (participantsSheet, eventSheets) => {
  // Crear el libro de trabajo (workbook)
  const wb = XLSX.utils.book_new();

  // Crear hoja general de participantes
  const wsParticipants = XLSX.utils.json_to_sheet(participantsSheet);
  XLSX.utils.book_append_sheet(wb, wsParticipants, 'Participantes');

  // Crear hojas individuales por evento
  Object.entries(eventSheets).forEach(([sheetName, rows]) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  // Generar el buffer del archivo Excel
  const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});

  // Crear y retornar el blob
  return new Blob([excelBuffer], {
    type: 'application/octet-stream',
  });
};

/**
 * Función principal para exportar participantes a Excel
 * Obtiene los datos, los procesa y genera el archivo para descarga
 * @param {Array} permissions - Permisos del usuario actual
 * @throws {Error} Si ocurre un error durante la exportación
 */
export const exportParticipantsToExcel = async (permissions) => {
  try {
    // Obtener datos de participantes desde la API
    const response = await getParticipants(permissions);
    const participants = response.rows || [];

    // Procesar datos para la hoja general
    const participantsSheet = processParticipantsSheet(participants);

    // Procesar datos para hojas por evento
    const eventSheets = processEventSheets(participants);

    // Crear archivo Excel
    const blob = createExcelFile(participantsSheet, eventSheets);

    // Descargar archivo
    saveAs(blob, 'participantes-por-evento.xlsx');
  } catch (error) {
    console.error('Error exportando Excel:', error);
    throw new Error(
      'Error al exportar los datos a Excel. Por favor, inténtelo de nuevo.'
    );
  }
};
