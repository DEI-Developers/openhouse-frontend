/* eslint-disable prettier/prettier */
import {useState} from 'react';
import {exportParticipantsToExcel} from '@services/Participants/exportService';

/**
 * Custom hook para manejar la exportación de participantes a Excel
 * Proporciona estado de carga, manejo de errores y función de exportación
 * @returns {Object} Objeto con estado y funciones para la exportación
 */
export const useParticipantExcelExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  /**
   * Función para exportar participantes a Excel
   * Maneja el estado de carga y errores durante la exportación
   * @param {Array} permissions - Permisos del usuario actual
   */
  const handleExportToExcel = async (permissions) => {
    setIsExporting(true);
    setExportError(null);

    try {
      await exportParticipantsToExcel(permissions);
    } catch (error) {
      setExportError(error.message);
      console.error('Error en la exportación:', error);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Función para limpiar el error de exportación
   */
  const clearExportError = () => {
    setExportError(null);
  };

  return {
    isExporting,
    exportError,
    handleExportToExcel,
    clearExportError,
  };
};