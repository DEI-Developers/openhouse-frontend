/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import {getUsers} from '@services/Users';
import {BiEditAlt} from 'react-icons/bi';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi';
import useUsers from '@hooks/Dashboard/useUsers';
import useCatalogs from '@hooks/Dashboard/useCatalogs';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import UserForm from '@components/Dashboard/User/UserForm';
import CustomTable from '@components/UI/Table/CustomTable';
import DeleteDialog from '@components/Dashboard/DeleteDialog';

const Users = () => {
  const {roles, faculties} = useCatalogs();
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
          roles={roles}
          faculties={faculties}
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
    title: 'Correo electrónico',
    field: 'email',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Rol',
    field: 'roleName',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Facultad / Carrera',
    field: 'careerName',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
    render: (rowData) => <FacultyCareerRow facultyName={rowData.facultyName} careerName={rowData.careerName} />,
  },
  {
    title: 'Estado',
    field: 'isActive',
    render: (rowData) => <BadgeStatus status={rowData.isActive} />,
  },
];

const FacultyCareerRow = ({facultyName, careerName}) => {
  return (
    <div>
      <p className="font-medium">{facultyName ?? 'N/A'}</p>
      {!empty(careerName) && (
        <ul className="list-disc list-inside">
          <li>{careerName}</li>
        </ul>
      )}
    </div>
  )
}

const BadgeStatus = ({status}) => {
  const customClassName =
    status
      ? 'bg-green-100 text-green-600'
      : 'bg-red-100 text-red-600';

  return (
    <div
      className={`flex justify-center item-center bg-green-100 px-3 py-2 rounded-lg ${customClassName}`}
    >
      <p className="font-bold">{status ? 'Activo' : 'Inactivo'}</p>
    </div>
  );
};

export default Users;
