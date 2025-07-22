/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import {getFaculties} from '@services/Faculties';
import {BiEditAlt} from 'react-icons/bi';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi';
import {MdDeleteForever, MdRestore} from 'react-icons/md';
import useFaculties from '@hooks/Dashboard/useFaculties';
import useCatalogs from '@hooks/Dashboard/useCatalogs';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import FacultyForm from '@components/Dashboard/Faculty/FacultyForm';
import CustomTable from '@components/UI/Table/CustomTable';
import FacultiesCardView from '@components/Dashboard/FacultiesCardView';
import DeleteDialog from '@components/Dashboard/DeleteDialog';

const Faculties = () => {
  const [facultyIdToDelete, setFacultyIdToDelete] = useState(null);
  const [facultyToHardDelete, setFacultyToHardDelete] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' o 'card'
  const {careers} = useCatalogs();
  const {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onHardDelete,
    onRestore,
    onRemoveCareer,
    onCloseForm,
    onToggleForm,
    isOpenForm,
    currentData,
    showDeleted,
    toggleShowDeleted,
  } = useFaculties();

  // Funciones wrapper para manejar las acciones con invalidación correcta
  const handleRestore = (id) => {
    onRestore.mutate(id);
  };

  const handleHardDelete = (id) => {
    setFacultyToHardDelete(id);
  };

  const customActions = getCustomActions(
    onEdit,
    setFacultyIdToDelete,
    handleHardDelete,
    handleRestore,
    showDeleted
  );
  const columns = getColumns(onRemoveCareer, showDeleted);

  // Wrapper para fetchData que incluye el parámetro showDeleted
  const fetchFacultiesData = async (
    pageNumber,
    pageSize,
    searchedWord,
    filters = null
  ) => {
    if (showDeleted) {
      // Cuando showDeleted es true, obtenemos todas las facultades (incluidas eliminadas)
      // y luego filtramos solo las eliminadas
      const result = await getFaculties(
        pageNumber,
        pageSize,
        searchedWord,
        filters,
        true // includeDeleted = true
      );

      // Filtrar solo las facultades que tienen deletedAt (soft deleted)
      const deletedRows = result.rows.filter((row) => row.deletedAt);

      return {
        ...result,
        rows: deletedRows,
        nRows: deletedRows.length,
        nPages: Math.ceil(deletedRows.length / pageSize),
      };
    } else {
      // Cuando showDeleted es false, solo obtenemos facultades activas
      return getFaculties(
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
      <CustomHeader title="Facultades" />

      <Breadcrumb pageName="Facultades" />

      <div className="flex justify-between items-center mb-4 mt-1 flex-wrap gap-4">
        <h1 className="text-primary text-3xl font-bold">
          Gestión de Facultades
        </h1>
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
            <span className="hidden md:block">Agregar facultad</span>
          </button>
        </div>
      </div>

      {/* Renderizado condicional: tabla en pantallas grandes, tarjetas en md y abajo */}
      <div className="hidden md:block">
        {viewMode === 'table' ? (
          <CustomTable
            columns={columns}
            queryKey={showDeleted ? 'faculties-with-deleted' : 'faculties'}
            customActions={customActions}
            fetchData={fetchFacultiesData}
          />
        ) : (
          <FacultiesCardView
            showDeleted={showDeleted}
            onEdit={onEdit}
            onDelete={setFacultyIdToDelete}
            onHardDelete={handleHardDelete}
            onRestore={handleRestore}
          />
        )}
      </div>

      {/* Vista de tarjetas para móviles (siempre) */}
      <div className="block md:hidden">
        <FacultiesCardView
          showDeleted={showDeleted}
          onEdit={onEdit}
          onDelete={setFacultyIdToDelete}
          onHardDelete={handleHardDelete}
          onRestore={handleRestore}
        />
      </div>

      <DeleteDialog
        isOpen={!empty(facultyIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setFacultyIdToDelete(null)}
        onDelete={() => onDelete.mutate(facultyIdToDelete)}
        title="Eliminar Facultad"
        message="¿Estás seguro de que deseas eliminar esta facultad? Esta acción se puede revertir."
      />

      <DeleteDialog
        isOpen={!empty(facultyToHardDelete)}
        isLoading={onHardDelete.isPending}
        isSuccess={onHardDelete.isSuccess}
        onClose={() => setFacultyToHardDelete(null)}
        onDelete={() => onHardDelete.mutate(facultyToHardDelete)}
        title="Eliminar Permanentemente"
        message="¿Estás seguro de que deseas eliminar permanentemente esta facultad? Esta acción NO se puede revertir."
        confirmText="Eliminar Permanentemente"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      <CustomModal
        isOpen={isOpenForm}
        onToggleModal={onCloseForm}
        className="p-0 w-full sm:max-w-2xl"
      >
        <FacultyForm
          initialData={currentData}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onClose={onCloseForm}
          careers={careers}
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

const getColumns = (onRemoveCareer, showDeleted) => [
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
    title: 'Carreras',
    field: 'careers',
    render: (rowData) => {
      if (!rowData.careers || rowData.careers.length === 0) {
        return (
          <span
            className={`text-sm italic ${
              rowData.deletedAt ? 'text-red-400' : 'text-gray-500'
            }`}
          >
            Sin carreras
          </span>
        );
      }

      return (
        <div className="flex flex-wrap gap-2">
          {rowData.careers.map((career, index) => {
            const careerName =
              typeof career === 'string' ? career : career.name || career.label;
            const careerId =
              typeof career === 'object' ? career.id || career.value : career;

            return (
              <span
                key={careerId || index}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  rowData.deletedAt
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {careerName}
                {!showDeleted && !rowData.deletedAt && (
                  <button
                    type="button"
                    onClick={() => {
                      if (careerId) {
                        onRemoveCareer.mutate({
                          facultyId: rowData.id,
                          careerId,
                        });
                      } else {
                        console.error(
                          'No se pudo obtener el ID de la carrera:',
                          career
                        );
                      }
                    }}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:bg-blue-200 hover:text-blue-600 rounded-full focus:outline-none"
                    title="Eliminar carrera"
                  >
                    <svg
                      className="w-2 h-2"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <path d="M1.41 0L0 1.41 2.59 4 0 6.59 1.41 8 4 5.41 6.59 8 8 6.59 5.41 4 8 1.41 6.59 0 4 2.59 1.41 0z" />
                    </svg>
                  </button>
                )}
              </span>
            );
          })}
        </div>
      );
    },
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

export default Faculties;
