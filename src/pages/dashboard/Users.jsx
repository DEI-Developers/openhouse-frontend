/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import {getUsers} from '@services/Users';
import {BiEditAlt} from 'react-icons/bi';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi';
import useUsers from '@hooks/Dashboard/useUsers';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import UserForm from '@components/Dashboard/User/UserForm';
import CustomTable from '@components/UI/Table/CustomTable';
import DeleteDialog from '@components/Dashboard/DeleteDialog';

const Users = () => {
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const {onEdit, onCreate, onUpdate, onDelete, onCloseForm, onToggleForm, isOpenForm, currentData} = useUsers();
  const customActions = getCustomActions(onEdit, setUserIdToDelete);

  return (
    <div>
      <CustomHeader title="Usuarios" />

      <Breadcrumb pageName="Usuarios" />

      <div className="flex justify-between items-center mb-4 mt-1">
        <h1 className="text-primary text-3xl font-bold">Usuarios</h1>
        <button
          type="button"
          onClick={onToggleForm}
          className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary"
        >
          <AiOutlinePlus className="mr-2" />
          <span>Agregar usuario</span>
        </button>
      </div>

      <CustomTable
        columns={columns}
        queryKey="users"
        customActions={customActions}
        fetchData={getUsers}
      />

      <DeleteDialog
        isOpen={!empty(userIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setUserIdToDelete(null)}
        onDelete={() => onDelete.mutate(userIdToDelete)}
      />

      <CustomModal
        isOpen={isOpenForm}
        onToggleModal={onCloseForm}
        className="p-0 w-full sm:max-w-3xl"
      >
        <UserForm
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

const columns = [
  {
    title: 'Nombre',
    field: 'name',
  },
  {
    title: 'Apellido',
    field: 'lastname',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Fecha de nacimiento',
    field: 'birthdate',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Rol',
    field: 'roles',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Estado',
    field: 'isActive',
    render: (rowData) => <BadgeStatus status={rowData.isActive} />,
  },
];

const BadgeStatus = ({status}) => {
  const customClassName =
    status == 'Activo'
      ? 'bg-green-100 text-green-600'
      : 'bg-red-100 text-red-600';

  return (
    <div
      className={`flex justify-center item-center bg-green-100 px-3 py-2 rounded-lg ${customClassName}`}
    >
      <p className="font-bold">{status}</p>
    </div>
  );
};

export default Users;
