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

const Permissions = () => {
  const columns = getColumns();
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

  const customActions = getCustomActions(
    onEdit,
    setPermissionIdToDelete,
    setPermissionToHardDelete,
    onRestore,
    showDeleted
  );

  // Wrapper para fetchData que incluye el parámetro showDeleted
  const fetchPermissionsData = (
    pageNumber,
    pageSize,
    searchedWord,
    filters = null
  ) => {
    return getPermissions(
      pageNumber,
      pageSize,
      searchedWord,
      filters,
      showDeleted
    );
  };

  return (
    <div>
      <CustomHeader title="Permisos" />

      <Breadcrumb pageName="Permisos" />

      <div className="flex justify-between items-center mb-4 mt-1 flex-wrap">
        <h1 className="text-primary text-3xl font-bold">Gestión de Permisos</h1>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={toggleShowDeleted}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Mostrar eliminados</span>
          </label>
          <button
            type="button"
            onClick={() => onToggleForm()}
            className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary"
          >
            <AiOutlinePlus className="mr-2" />
            <span>Agregar permiso</span>
          </button>
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

const getCustomActions = (onEdit, onDelete, onHardDelete, onRestore, showDeleted) => [
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
    onClick: (data) => onRestore.mutate(data.id),
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

const getColumns = () => [
  {
    title: 'Estado',
    field: 'deletedAt',
    render: (rowData) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        rowData.deletedAt 
          ? 'bg-red-100 text-red-800' 
          : 'bg-green-100 text-green-800'
      }`}>
        {rowData.deletedAt ? 'Eliminado' : 'Activo'}
      </span>
    ),
  },
  {
    title: 'Valor',
    field: 'value',
    render: (rowData) => (
      <span className={`font-mono text-sm px-2 py-1 rounded ${
        rowData.deletedAt 
          ? 'bg-red-50 text-red-700 line-through' 
          : 'bg-gray-100'
      }`}>
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
        rowData.deletedAt 
          ? 'bg-red-100 text-red-800' 
          : 'bg-blue-100 text-blue-800'
      }`}>
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

export default Permissions;
