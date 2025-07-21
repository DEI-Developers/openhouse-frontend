/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import {BiEditAlt} from 'react-icons/bi';
import {getPermissions} from '@services/Permissions';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi';
import {MdDeleteForever, MdRestore} from 'react-icons/md';
import usePermission from '@hooks/Dashboard/usePermission';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import PermissionForm from '@components/Dashboard/Permission/PermissionForm';
import CustomTable from '@components/UI/Table/CustomTable';
import DeleteDialog from '@components/Dashboard/DeleteDialog';
import {useAuth} from '@context/AuthContext';
import Permissions from '@utils/Permissions';

const PermissionsPage = () => {
  const columns = getColumns();
  const {permissions} = useAuth();
  const [permissionIdToDelete, setPermissionIdToDelete] = useState(null);
  const [permissionToHardDelete, setPermissionToHardDelete] = useState(null);
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
  } = usePermission();

  // Funciones wrapper para manejar las acciones con invalidación correcta
  const handleRestore = (id) => {
    onRestore.mutate(id);
  };

  const handleHardDelete = (id) => {
    setPermissionToHardDelete(id);
  };

  const customActions = getCustomActions(
    onEdit,
    setPermissionIdToDelete,
    handleHardDelete,
    handleRestore,
    showDeleted,
    permissions
  );

  // Wrapper para fetchData que incluye el parámetro showDeleted
  const fetchPermissionsData = async (
    pageNumber,
    pageSize,
    searchedWord,
    filters = null
  ) => {
    if (showDeleted) {
      // Cuando showDeleted es true, obtenemos todos los permisos (incluidos eliminados)
      // y luego filtramos solo los eliminados
      const result = await getPermissions(
        pageNumber,
        pageSize,
        searchedWord,
        filters,
        true // includeDeleted = true
      );

      // Filtrar solo los permisos que tienen deletedAt (soft deleted)
      const deletedRows = result.rows.filter((row) => row.deletedAt);

      return {
        ...result,
        rows: deletedRows,
        nRows: deletedRows.length,
        nPages: Math.ceil(deletedRows.length / pageSize),
      };
    } else {
      // Cuando showDeleted es false, solo obtenemos permisos activos
      return getPermissions(
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
      <CustomHeader title="Permisos" />

      <Breadcrumb pageName="Permisos" />

      <div className="flex justify-between items-center mb-4 mt-1 flex-wrap gap-4">
        <h1 className="text-primary text-3xl font-bold">Gestión de Permisos</h1>
        <div className="flex items-center gap-4">
          {/* Toggle mejorado para mostrar eliminados */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-700">Vista:</span>
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
              {permissions.includes(Permissions.HARD_DELETE_PERMISSION) && (
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
              )}
            </div>
          </div>

          {permissions.includes(Permissions.CREATE_PERMISSIONS) && (
            <button
              type="button"
              onClick={() => onToggleForm()}
              className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary transition-colors"
            >
              <AiOutlinePlus className="mr-2" />
              <span>Agregar permiso</span>
            </button>
          )}
        </div>
      </div>

      <CustomTable
        columns={columns}
        queryKey={showDeleted ? 'permissions-with-deleted' : 'permissions'}
        customActions={customActions}
        fetchData={fetchPermissionsData}
      />

      <DeleteDialog
        isOpen={!empty(permissionIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setPermissionIdToDelete(null)}
        onDelete={() => onDelete.mutate(permissionIdToDelete)}
        title="Eliminar Permiso"
        message="¿Estás seguro de que deseas eliminar este permiso? Esta acción se puede revertir."
      />

      <DeleteDialog
        isOpen={!empty(permissionToHardDelete)}
        isLoading={onHardDelete.isPending}
        isSuccess={onHardDelete.isSuccess}
        onClose={() => setPermissionToHardDelete(null)}
        onDelete={() => onHardDelete.mutate(permissionToHardDelete)}
        title="Eliminar Permanentemente"
        message="¿Estás seguro de que deseas eliminar permanentemente este permiso? Esta acción NO se puede revertir."
        confirmText="Eliminar Permanentemente"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      <CustomModal
        isOpen={isOpenForm}
        onToggleModal={onCloseForm}
        className="p-0 w-full sm:max-w-2xl lg:max-w-3xl"
      >
        <PermissionForm
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
  showDeleted,
  permissions = []
) => {
  const acciones = [];
  if (permissions.includes(Permissions.UPDATE_PERMISSION)) {
    acciones.push({
      id: 1,
      label: '',
      tooltip: 'Editar',
      Icon: BiEditAlt,
      onClick: onEdit,
      ruleToHide: (data) => showDeleted && data.deletedAt, // Ocultar editar si está eliminado
    });
  }
  if (permissions.includes(Permissions.DELETE_PERMISSION)) {
    acciones.push({
      id: 2,
      label: '',
      tooltip: 'Eliminar',
      Icon: HiOutlineTrash,
      onClick: (data) => onDelete(data.id),
      ruleToHide: (data) => showDeleted && data.deletedAt, // Ocultar eliminar si ya está eliminado
    });
  }
  if (permissions.includes(Permissions.UPDATE_PERMISSION)) {
    acciones.push({
      id: 3,
      label: '',
      tooltip: 'Restaurar',
      Icon: MdRestore,
      onClick: (data) => onRestore(data.id), // Cambio aquí: usar la función en lugar de mutate directo
      ruleToHide: (data) => !showDeleted || !data.deletedAt, // Solo mostrar si está eliminado
    });
  }
  if (permissions.includes(Permissions.HARD_DELETE_PERMISSION)) {
    acciones.push({
      id: 4,
      label: '',
      tooltip: 'Eliminar Permanentemente',
      Icon: MdDeleteForever,
      onClick: (data) => onHardDelete(data.id),
      ruleToHide: (data) => !showDeleted || !data.deletedAt, // Solo mostrar si está eliminado
    });
  }
  return acciones;
};

const getColumns = () => [
  {
    title: 'Estado',
    field: 'status', // Cambio de 'deletedAt' a 'status' para evitar duplicados
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
    title: 'Valor',
    field: 'value',
    render: (rowData) => (
      <span
        className={`font-mono text-sm px-2 py-1 rounded ${
          rowData.deletedAt
            ? 'bg-red-50 text-red-700 line-through'
            : 'bg-gray-100'
        }`}
      >
        {rowData.value}
      </span>
    ),
  },
  {
    title: 'Nombre',
    field: 'name',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
    render: (rowData) => (
      <span className={rowData.deletedAt ? 'text-red-500 line-through' : ''}>
        {rowData.name}
      </span>
    ),
  },
  {
    title: 'Tipo',
    field: 'type',
    render: (rowData) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
          rowData.deletedAt
            ? 'bg-red-100 text-red-800'
            : 'bg-blue-100 text-blue-800'
        }`}
      >
        {rowData.type}
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

export default PermissionsPage;
