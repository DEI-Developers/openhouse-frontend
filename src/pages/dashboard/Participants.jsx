/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import Permissions from '@utils/Permissions';
import {AiOutlinePlus} from 'react-icons/ai';
import {
  HiOutlineDownload,
  HiOutlineViewGrid,
  HiOutlineViewList,
} from 'react-icons/hi';
import {useAuth} from '@context/AuthContext';
import useBooleanBox from '@hooks/useBooleanBox';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import DeleteDialog from '@components/Dashboard/DeleteDialog';
import DeleteAttendanceDialog from '@components/Dashboard/DeleteAttendanceDialog';
import AdminParticipationForm from '@components/Dashboard/AdminParticipationForm';
import ParticipantQRModal from '@components/Dashboard/ParticipantQRModal';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  deleteParticipant,
  deleteParticipantAttendance,
  getParticipants,
} from '@services/Participants';
import ParticipantsFilters from '@components/UI/Filters/ParticipantsFilters';
import AdvancedCustomTable from '@components/UI/Table/AdvancedCustomTable';
import ParticipantsCardView from '@components/Dashboard/ParticipantsCardView';
import {useParticipantExcelExport} from '@hooks/Dashboard/useParticipantExcelExport';
import {
  initialFormData,
  getCustomActions,
  getColumns,
} from './Participants/participantsConfig';

const Participants = () => {
  const {permissions} = useAuth();
  const queryClient = useQueryClient();
  const [currentData, setCurrentParticipant] = useState(initialFormData);
  const {isOpen, onToggleBox, onClose} = useBooleanBox();
  const [participantIdToDelete, setParticipantIdToDelete] = useState(null);
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [selectedParticipantForQR, setSelectedParticipantForQR] =
    useState(null);

  // Hook personalizado para la exportación a Excel
  const {isExporting, exportError, handleExportToExcel} =
    useParticipantExcelExport();

  const onDelete = useMutation({
    mutationFn: deleteParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['participants']});
    },
  });

  const onDeleteAttendance = useMutation({
    mutationFn: async (attendanceData) => {
      await deleteParticipantAttendance(attendanceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['participants']});
      setAttendanceToDelete(null);
    },
  });

  /**
   * Maneja la edición de un participante
   * Prepara los datos del participante para el formulario de edición
   */
  const onEdit = (data) => {
    const updatedData = {
      id: data.id,
      name: data.name,
      email: data.email,
      confirmEmail: data.email,
      phoneNumber: data.phoneNumber,
      institute: data.institute,
      networks: data.networks,
      medio: data.medio,

      subscribedTo: data.subscribedTo?.map((e) => {
        if (typeof e.event === 'string') {
          return e.event;
        }
        return e.event?._id;
      }),
      faculty: '',
      career: null,
      parentStudiedAtUCA: null,
      withParent: '0',
    };

    setCurrentParticipant(updatedData);
    onToggleBox();
  };

  /**
   * Cierra el formulario y resetea los datos
   */
  const onCloseForm = () => {
    setCurrentParticipant(initialFormData);
    onClose();
  };

  /**
   * Muestra el modal con el código QR del participante
   */
  const handleShowQR = (participant) => {
    setSelectedParticipantForQR(participant);
  };

  /**
   * Maneja la eliminación de asistencia de un participante
   * Prepara los datos para el diálogo de confirmación
   */
  const handleDeleteAttendance = (attendanceData) => {
    setAttendanceToDelete(attendanceData);
  };

  /**
   * Maneja la descarga del archivo Excel
   * Utiliza el hook personalizado para la exportación
   */
  const handleDownloadExcel = async () => {
    await handleExportToExcel(permissions);

    // Si hay un error, se podría mostrar una notificación aquí
    if (exportError) {
      console.error('Error en la exportación:', exportError);
      // Aquí se podría integrar con un sistema de notificaciones
    }
  };

  // Generar acciones personalizadas para la tabla
  const customActions = getCustomActions(
    onEdit,
    setParticipantIdToDelete,
    handleShowQR,
    permissions
  );

  // Generar columnas con permisos y función de eliminar asistencia
  const columns = getColumns(permissions, handleDeleteAttendance);

  return (
    <div>
      <CustomHeader title="Participantes" />

      <Breadcrumb pageName="Participantes" />

      <div className="flex justify-between items-center mb-4 mt-1 flex-wrap">
        <h1 className="text-primary text-2xl md:text-3xl font-bold">Participantes</h1>
        <div className="flex gap-2 items-center">
          {/* Toggle de vista - Solo visible en desktop */}
          {(permissions.includes(Permissions.VIEW_ALL_PARTICIPANTS) ||
            permissions.includes(Permissions.VIEW_CAREER_PARTICIPANTS) ||
            permissions.includes(Permissions.VIEW_FACULTY_PARTICIPANTS)) && (
            <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <HiOutlineViewList className="mr-2" />
                Tabla
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'card'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <HiOutlineViewGrid className="mr-2" />
                Fichas
              </button>
            </div>
          )}

          {permissions.includes(Permissions.VIEW_ALL_PARTICIPANTS) && (
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={isExporting}
              className={`btn flex justify-center items-center px-4 py-2.5 rounded-lg text-white ${
                isExporting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <HiOutlineDownload className="md:mr-2" />
              <span className="hidden md:inline">
                {isExporting ? 'Exportando...' : 'Descargar Excel'}
              </span>
            </button>
          )}

          {permissions.includes(Permissions.CREATE_PARTICIPANT) && (
            <button
              type="button"
              onClick={onToggleBox}
              className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary"
            >
              <AiOutlinePlus className="md:mr-2" />
              <span className="hidden md:inline">Agregar participante</span>
            </button>
          )}
        </div>
      </div>

      {(permissions.includes(Permissions.VIEW_ALL_PARTICIPANTS) ||
        permissions.includes(Permissions.VIEW_CAREER_PARTICIPANTS) ||
        permissions.includes(Permissions.VIEW_FACULTY_PARTICIPANTS)) && (
        <>
          {/* Vista de tabla - Solo visible en desktop */}
          <div className="hidden md:block">
            {viewMode === 'table' ? (
              <AdvancedCustomTable
                columns={columns}
                queryKey="participants"
                defaultRowsPerPage={10}
                customActions={customActions}
                fetchData={getParticipants}
                CustomFilters={ParticipantsFilters}
                permissions={permissions}
                useAdvancedFiltering={true}
              />
            ) : (
              <ParticipantsCardView
                customActions={customActions}
                permissions={permissions}
                onDeleteAttendance={handleDeleteAttendance}
              />
            )}
          </div>

          {/* Vista de cards - Solo visible en móvil */}
          <div className="block md:hidden">
            <ParticipantsCardView
              customActions={customActions}
              permissions={permissions}
              onDeleteAttendance={handleDeleteAttendance}
            />
          </div>
        </>
      )}

      <DeleteDialog
        isOpen={!empty(participantIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setParticipantIdToDelete(null)}
        onDelete={() => onDelete.mutate(participantIdToDelete)}
      />

      <DeleteAttendanceDialog
        isOpen={!empty(attendanceToDelete)}
        isLoading={onDeleteAttendance.isPending}
        isSuccess={onDeleteAttendance.isSuccess}
        onClose={() => setAttendanceToDelete(null)}
        onDelete={() => {
          onDeleteAttendance.mutate(attendanceToDelete);
        }}
        participantData={attendanceToDelete}
      />

      {permissions.includes(Permissions.CREATE_PARTICIPANT) && (
        <CustomModal
          isOpen={isOpen}
          onToggleModal={onCloseForm}
          className="p-0 w-full sm:max-w-6xl"
        >
          <AdminParticipationForm
            onCloseForm={onCloseForm}
            initialData={currentData}
            titleClassName="text-xl font-bold leading-6 text-primary mb-4"
            titleLabel={
              !empty(currentData.id)
                ? 'Editar participante'
                : 'Agregar participante'
            }
          />
        </CustomModal>
      )}

      <ParticipantQRModal
        participant={selectedParticipantForQR}
        isOpen={!!selectedParticipantForQR}
        onClose={() => setSelectedParticipantForQR(null)}
      />
    </div>
  );
};
export default Participants;
