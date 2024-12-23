import React, {useState, useEffect} from 'react';
import {getUsers} from '@services/Users';
import {HiOutlineTrash} from 'react-icons/hi';
import {BiEditAlt} from 'react-icons/bi';
import CustomHeader from '@components/UI/CustomHeader';
import CustomTable from '@components/UI/Table/CustomTable';

const Users = () => {
  const [currentRecord, setCurrentRecord] = useState(null);
  const customActions = getCustomActions(setCurrentRecord);

  useEffect(() => {
    console.log('currentRecord', currentRecord);
  }, [currentRecord]);

  return (
    <div>
      <CustomHeader title="Usuarios" />
      <h1 className="text-primary text-3xl font-bold">Usuarios</h1>

      <CustomTable
        columns={columns}
        queryKey="users"
        customActions={customActions}
        fetchData={getUsers}
      />
    </div>
  );
};

const getCustomActions = (setCurrentRecord) => [
  {
    id: 1,
    label: '',
    tooltip: 'Editar',
    Icon: BiEditAlt,
    onClick: (data) => console.log('Edit', data),
  },
  {
    id: 2,
    label: '',
    tooltip: 'Borrar',
    Icon: HiOutlineTrash,
    onClick: (data) => console.log('Delete', data),
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
