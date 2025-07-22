/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import {getCareers} from '@services/Careers';
import {BiEditAlt} from 'react-icons/bi';
import {AiOutlinePlus} from 'react-icons/ai';
import {
  HiOutlineTrash,
  HiOutlineViewGrid,
  HiOutlineViewList,
} from 'react-icons/hi';
import {MdDeleteForever, MdRestore} from 'react-icons/md';
import useCareers from '@hooks/Dashboard/useCareers';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import CareerForm from '@components/Dashboard/Career/CareerForm';
import CustomTable from '@components/UI/Table/CustomTable';
import CareersCardView from '@components/Dashboard/CareersCardView';
import DeleteDialog from '@components/Dashboard/DeleteDialog';

const Careers = () => {
  const [careerIdToDelete, setCareerIdToDelete] = useState(null);
  const [careerToHardDelete, setCareerToHardDelete] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' o 'card'
  const {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onHardDelete,
    onRestore,
    onCloseForm,
    onToggleForm,
    isOpenForm,
    currentData,
    showDeleted,
    toggleShowDeleted,
  } = useCareers();

  // Funciones wrapper para manejar las acciones con invalidación correcta
  const handleRestore = (id) => {
    onRestore.mutate(id);
  };

  const handleHardDelete = (id) => {
    setCareerToHardDelete(id);
  };

  const customActions = getCustomActions(
    onEdit,
    setCareerIdToDelete,
    handleHardDelete,
    handleRestore,
    showDeleted
  );
  const columns = getColumns(showDeleted);

  // Wrapper para fetchData que incluye el parámetro showDeleted
  const fetchCareersData = async (
    pageNumber,
    pageSize,
    searchedWord,
    filters = null
  ) => {
    if (showDeleted) {
      // Cuando showDeleted es true, obtenemos todas las carreras (incluidas eliminadas)
      // y luego filtramos solo las eliminadas
      const result = await getCareers(
        pageNumber,
        pageSize,
        searchedWord,
        filters,
        true // includeDeleted = true
      );

      // Filtrar solo las carreras que tienen deletedAt (soft deleted)
      const deletedRows = result.rows.filter((row) => row.deletedAt);

      return {
        ...result,
        rows: deletedRows,
        nRows: deletedRows.length,
        nPages: Math.ceil(deletedRows.length / pageSize),
      };
    } else {
      // Cuando showDeleted es false, solo obtenemos carreras activas
      return getCareers(
        pageNumber,
        pageSize,
        searchedWord,
        filters,
        false // includeDeleted = false
      );
    }
  };

  return (
    <div>
      <CustomHeader title="Carreras" />

      <Breadcrumb pageName="Carreras" />

      <div className="flex justify-between items-center mb-4 mt-1 flex-wrap gap-4">
        <h1 className="text-primary text-3xl font-bold">Gestión de Carreras</h1>
        <div className="flex items-center gap-4 justify-between w-full md:w-auto">
          {/* Toggle mejorado para mostrar eliminados */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => showDeleted && toggleShowDeleted()}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  !showDeleted
                    ? 'bg-primary text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => !showDeleted && toggleShowDeleted()}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  showDeleted
                    ? 'bg-red-500 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Eliminados
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleForm}
            className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <AiOutlinePlus className="md:mr-2" />
            <span className="hidden md:block">Agregar carrera</span>
          </button>
        </div>
      </div>

      {/* Renderizado condicional: tabla en pantallas grandes, tarjetas en md y abajo */}
      <div className="hidden md:block">
        {viewMode === 'table' ? (
          <CustomTable
            columns={columns}
            queryKey={showDeleted ? 'careers-with-deleted' : 'careers'}
            customActions={customActions}
            fetchData={fetchCareersData}
          />
        ) : (
          <CareersCardView
            showDeleted={showDeleted}
            onEdit={onEdit}
            onDelete={setCareerIdToDelete}
            onHardDelete={handleHardDelete}
            onRestore={handleRestore}
          />
        )}
      </div>

      {/* Vista de tarjetas para móviles (siempre) */}
      <div className="block md:hidden">
        <CareersCardView
          showDeleted={showDeleted}
          onEdit={onEdit}
          onDelete={setCareerIdToDelete}
          onHardDelete={handleHardDelete}
          onRestore={handleRestore}
        />
      </div>

      <DeleteDialog
        isOpen={!empty(careerIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setCareerIdToDelete(null)}
        onDelete={() => onDelete.mutate(careerIdToDelete)}
        title="Eliminar Carrera"
        message="¿Estás seguro de que deseas eliminar esta carrera? Esta acción se puede revertir."
      />

      <DeleteDialog
        isOpen={!empty(careerToHardDelete)}
        isLoading={onHardDelete.isPending}
        isSuccess={onHardDelete.isSuccess}
        onClose={() => setCareerToHardDelete(null)}
        onDelete={() => onHardDelete.mutate(careerToHardDelete)}
        title="Eliminar Permanentemente"
        message="¿Estás seguro de que deseas eliminar permanentemente esta carrera? Esta acción NO se puede revertir."
        confirmText="Eliminar Permanentemente"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      <CustomModal
        isOpen={isOpenForm}
        onToggleModal={onCloseForm}
        className="p-0 w-full sm:max-w-2xl"
      >
        <CareerForm
          initialData={currentData}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onClose={onCloseForm}
        />
      </CustomModal>
    </div>
  );
};

const getCustomActions = (
  onEdit,
  onDelete,
  onHardDelete,
  onRestore,
  showDeleted
) => [
  {
    id: 1,
    label: '',
    tooltip: 'Editar',
    Icon: BiEditAlt,
    onClick: onEdit,
    ruleToHide: (data) => showDeleted && data.deletedAt, // Ocultar editar si está eliminado
  },
  {
    id: 2,
    label: '',
    tooltip: 'Eliminar',
    Icon: HiOutlineTrash,
    onClick: (data) => onDelete(data.id),
    ruleToHide: (data) => showDeleted && data.deletedAt, // Ocultar eliminar si ya está eliminado
  },
  {
    id: 3,
    label: '',
    tooltip: 'Restaurar',
    Icon: MdRestore,
    onClick: (data) => onRestore(data.id),
    ruleToHide: (data) => !showDeleted || !data.deletedAt, // Solo mostrar si está eliminado
  },
  {
    id: 4,
    label: '',
    tooltip: 'Eliminar Permanentemente',
    Icon: MdDeleteForever,
    onClick: (data) => onHardDelete(data.id),
    ruleToHide: (data) => !showDeleted || !data.deletedAt, // Solo mostrar si está eliminado
  },
];

const getColumns = (showDeleted) => [
  {
    title: 'Estado',
    field: 'status',
    render: (rowData) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          rowData.deletedAt
            ? 'bg-red-100 text-red-800'
            : 'bg-green-100 text-green-800'
        }`}
      >
        {rowData.deletedAt ? 'Eliminado' : 'Activo'}
      </span>
    ),
  },
  {
    title: 'Nombre',
    field: 'name',
    render: (rowData) => (
      <span className={rowData.deletedAt ? 'text-red-500 line-through' : ''}>
        {rowData.name}
      </span>
    ),
  },
  {
    title: 'Fecha de creación',
    field: 'createdAt',
    stackedColumn: true,
    className: 'hidden xl:table-cell',
    render: (rowData) => {
      const date = new Date(rowData.createdAt);
      return (
        <span className={rowData.deletedAt ? 'text-red-500' : ''}>
          {date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      );
    },
  },
  {
    title: 'Fecha de eliminación',
    field: 'deletedAt',
    stackedColumn: true,
    className: 'hidden xl:table-cell',
    render: (rowData) => {
      if (!rowData.deletedAt) return '-';
      const date = new Date(rowData.deletedAt);
      return (
        <span className="text-red-500">
          {date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      );
    },
  },
];

export default Careers;
