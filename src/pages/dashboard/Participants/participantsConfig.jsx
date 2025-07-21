/* eslint-disable prettier/prettier */
import React from 'react';
import {BiEditAlt} from 'react-icons/bi';
import {HiOutlineTrash} from 'react-icons/hi';
import {HiOutlineQrCode} from 'react-icons/hi2';
import BadgeMedio from '@components/UI/Badges/BadgeMedio';
import ParticipantContactInfo from '@components/Dashboard/Participants/ParticipantContactInfo';
import ParticipantInscriptions from '@components/Dashboard/Participants/ParticipantInscriptions';
import Permissions from '@utils/Permissions';

/**
 * Datos iniciales del formulario de participantes
 * Contiene todos los campos necesarios para crear/editar un participante
 */
export const initialFormData = {
  id: null,
  name: '',
  email: '',
  confirmEmail: '',
  phoneNumber: '',
  institute: '',
  networks: '',
  medio: 'Formulario',

  subscribedTo: [],
  faculty: '',
  career: null,
  parentStudiedAtUCA: null,
  withParent: '0',
};

/**
 * Genera las acciones personalizadas para cada fila de la tabla de participantes
 * @param {Function} onEdit - Función para editar un participante
 * @param {Function} onDelete - Función para eliminar un participante
 * @param {Function} onShowQR - Función para mostrar el código QR del participante
 * @param {Array} permissions - Array de permisos del usuario actual
 * @returns {Array} Array de objetos con las acciones disponibles
 */
export const getCustomActions = (onEdit, onDelete, onShowQR, permissions) => {
  const actions = [
    {
      id: 1,
      label: '',
      tooltip: 'Ver QR',
      Icon: HiOutlineQrCode,
      onClick: onShowQR,
    },
  ];

  if (permissions.includes(Permissions.CREATE_PARTICIPANT)) {
    actions.push({
      id: 2,
      label: '',
      tooltip: 'Editar',
      Icon: BiEditAlt,
      onClick: onEdit,
    });
  }

  if (permissions.includes(Permissions.DELETE_PARTICIPANT)) {
    actions.push({
      id: 3,
      label: '',
      tooltip: 'Borrar',
      Icon: HiOutlineTrash,
      onClick: (data) => onDelete(data.id),
    });
  }

  return actions;
};

/**
 * Configuración de columnas para la tabla de participantes
 * Define cómo se muestran los datos en cada columna de la tabla
 * @param {Array} permissions - Array de permisos del usuario actual
 * @param {Function} onDeleteAttendance - Función para eliminar asistencia
 * @returns {Array} Array de objetos con la configuración de columnas
 */
export const getColumns = (permissions = [], onDeleteAttendance = null) => [
  {
    title: 'Persona',
    field: 'name',
    render: (rowData) => (
      <ParticipantContactInfo data={rowData} permissions={permissions} />
    ),
  },
  {
    title: 'Facultad / Carrera de interés',
    field: 'permissions',
    render: (rowData) => (
      <ParticipantInscriptions
        data={rowData}
        permissions={permissions}
        onDeleteAttendance={onDeleteAttendance}
      />
    ),
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Institución',
    field: 'institute',
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Como se dio cuenta',
    field: 'networksLabel',
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Medio',
    field: 'medio',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
    render: (rowData) => <BadgeMedio medio={rowData.medio} />,
  },
  {
    title: 'Fecha',
    field: 'createdAt',
    className: 'hidden lg:table-cell',
    render: (rowData) => (
      <div className="text-sm text-gray-600">
        {new Date(rowData.createdAt).toLocaleDateString('es-SV', {
          timeZone: 'America/El_Salvador',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    ),
  },
];

/**
 * Configuración de columnas para la tabla de participantes (versión legacy)
 * @deprecated Usar getColumns(permissions, onDeleteAttendance) en su lugar
 * @param {Array} permissions - Array de permisos del usuario actual
 * @param {Function} onDeleteAttendance - Función para eliminar asistencia
 */
export const getColumnsLegacy = (permissions = [], onDeleteAttendance = null) => [
  {
    title: 'Persona',
    field: 'name',
    render: (rowData) => <ParticipantContactInfo data={rowData} />,
  },
  {
    title: 'Facultad / Carrera de interés',
    field: 'permissions',
    render: (rowData) => (
      <ParticipantInscriptions
        data={rowData}
        permissions={permissions}
        onDeleteAttendance={onDeleteAttendance}
      />
    ),
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Institución',
    field: 'institute',
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Como se dio cuenta',
    field: 'networksLabel',
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Medio',
    field: 'medio',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
    render: (rowData) => <BadgeMedio medio={rowData.medio} />,
  },
  {
    title: 'Fecha',
    field: 'createdAt',
    className: 'hidden lg:table-cell',
    render: (rowData) => (
      <div className="text-sm text-gray-600">
        {new Date(rowData.createdAt).toLocaleDateString('es-SV', {
          timeZone: 'America/El_Salvador',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    ),
  },
];

/**
 * @deprecated Usar getColumns(permissions, onDeleteAttendance) en su lugar
 */
export const columns = getColumnsLegacy();
