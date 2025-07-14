/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import {BiEditAlt} from 'react-icons/bi';
import {getPermissions} from '@services/Permissions';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi';
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
  const {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onCloseForm,
    onToggleForm,
    isOpenForm,
    currentData,
  } = usePermission();
  const customActions = getCustomActions(onEdit, setPermissionIdToDelete);

  return (
    <div>
      <CustomHeader title="Permisos" />

      <Breadcrumb pageName="Permisos" />

      <div className="flex justify-between items-center mb-4 mt-1 flex-wrap">
        <h1 className="text-primary text-3xl font-bold">Gestión de Permisos</h1>
        <button
          type="button"
          onClick={() => onToggleForm()}
          className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary"
        >
          <AiOutlinePlus className="mr-2" />
          <span>Agregar permiso</span>
        </button>
      </div>

      <CustomTable
        columns={columns}
        queryKey="permissions"
        customActions={customActions}
        fetchData={getPermissions}
      />

      <DeleteDialog
        isOpen={!empty(permissionIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setPermissionIdToDelete(null)}
        onDelete={() => onDelete.mutate(permissionIdToDelete)}
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

const getCustomActions = (onEdit, onDelete) => [
  {
    id: 1,
    label: '',
    tooltip: 'Editar',
    Icon: BiEditAlt,
    onClick: onEdit,
  },
  {
    id: 2,
    label: '',
    tooltip: 'Borrar',
    Icon: HiOutlineTrash,
    onClick: (data) => onDelete(data.id),
  },
];

const getColumns = () => [
  {
    title: 'Valor',
    field: 'value',
    render: (rowData) => (
      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
        {rowData.value}
      </span>
    ),
  },
  {
    title: 'Nombre',
    field: 'name',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Tipo',
    field: 'type',
    render: (rowData) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
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
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
  },
];

export default Permissions;
