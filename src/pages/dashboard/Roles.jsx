/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import {BiEditAlt} from 'react-icons/bi';
import {getRoles} from '@services/Roles';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi';
import useRole from '@hooks/Dashboard/useRole';
import useCatalogs from '@hooks/Dashboard/useCatalogs';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import RoleForm from '@components/Dashboard/Role/RoleForm';
import CustomTable from '@components/UI/Table/CustomTable';
import DeleteDialog from '@components/Dashboard/DeleteDialog';

const Roles = () => {
  const {permissions} = useCatalogs();
  const columns = getColumns(permissions);
  const [roleIdToDelete, setRoleIdToDelete] = useState(null);
  const {onEdit, onCreate, onUpdate, onDelete, onCloseForm, onToggleForm, isOpenForm, currentData} = useRole();
  const customActions = getCustomActions(onEdit, setRoleIdToDelete);

  return (
    <div>
      <CustomHeader title="Roles y permisos" />

      <Breadcrumb pageName="Roles y permisos" />

      <div className="flex justify-between items-center mb-4 mt-1 flex-wrap">
        <h1 className="text-primary text-3xl font-bold">Roles y permisos</h1>
        <button
          type="button"
          onClick={onToggleForm}
          className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary"
        >
          <AiOutlinePlus className="mr-2" />
          <span>Agregar rol</span>
        </button>
      </div>

      <CustomTable
        columns={columns}
        queryKey="roles"
        customActions={customActions}
        fetchData={getRoles}
      />

      <DeleteDialog
        isOpen={!empty(roleIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setRoleIdToDelete(null)}
        onDelete={() => onDelete.mutate(roleIdToDelete)}
      />

      <CustomModal
        isOpen={isOpenForm}
        onToggleModal={onCloseForm}
        className="p-0 w-full sm:max-w-2xl"
      >
        <RoleForm
          initialData={currentData}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onClose={onCloseForm}
          permissions={permissions}
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

const getColumns = (permissions) => [
  {
    title: 'Nombre',
    field: 'name',
  },
  {
    title: 'Descripción',
    field: 'description',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Permisos',
    field: 'permissions',
    render: (rowData) => <Permissions data={rowData.permissions} permissions={permissions} />,
  },
];

const Permissions = ({data, permissions}) => {
  return (
    <ul className="list-disc list-inside">
      {data.map((permission) => (
        <li key={permission} className="text-xs">{getPermissionLabel(permission, permissions)}</li>
      ))}
    </ul>
  )
}

const getPermissionLabel = (permission, permissions) => permissions.find((p) => p.value === permission)?.name ?? '';

export default Roles;
