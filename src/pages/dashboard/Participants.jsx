/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import {BiEditAlt} from 'react-icons/bi';
import Permissions from '@utils/Permissions';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi';
import {useAuth} from '@context/AuthContext';
import useBooleanBox from '@hooks/useBooleanBox';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import CustomTable from '@components/UI/Table/CustomTable';
import DeleteDialog from '@components/Dashboard/DeleteDialog';
import ParticipationForm from '@components/Home/ParticipationForm';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteParticipant, getParticipants} from '@services/Participants';
import ParticipantsFilters from '@components/UI/Filters/ParticipantsFilters';

const Participants = () => {
  const {permissions} = useAuth();
  const queryClient = useQueryClient();
  const [currentData, setCurrentParticipant] = useState(initialFormData);
  const {isOpen, onToggleBox, onClose} = useBooleanBox();
  const [participantIdToDelete, setParticipantIdToDelete] = useState(null);

  const onDelete = useMutation({
    mutationFn: deleteParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['participants']});
    },
  });

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

  const onCloseForm = () => {
    setCurrentParticipant(initialFormData);
    onClose();
  };

  const customActions = getCustomActions(
    onEdit,
    setParticipantIdToDelete,
    permissions.includes(Permissions.MANAGE_PARTICIPANTS)
  );

  return (
    <div>
      <CustomHeader title="Participantes" />

      <Breadcrumb pageName="Participantes" />

      <div className="flex justify-between items-center mb-4 mt-1">
        <h1 className="text-primary text-3xl font-bold">Participantes</h1>
        {permissions.includes(Permissions.MANAGE_PARTICIPANTS) && (
          <button
            type="button"
            onClick={onToggleBox}
            className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary"
          >
            <AiOutlinePlus className="mr-2" />
            <span>Agregar participante</span>
          </button>
        )}
      </div>

      <CustomTable
        columns={columns}
        queryKey="participants"
        defaultRowsPerPage={10}
        customActions={customActions}
        fetchData={getParticipants}
        CustomFilters={ParticipantsFilters}
      />

      <DeleteDialog
        isOpen={!empty(participantIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setParticipantIdToDelete(null)}
        onDelete={() => onDelete.mutate(participantIdToDelete)}
      />

      {permissions.includes(Permissions.MANAGE_PARTICIPANTS) && (
        <CustomModal
          isOpen={isOpen}
          onToggleModal={onCloseForm}
          className="p-0 w-full sm:max-w-6xl"
        >
          <ParticipationForm
            onCloseForm={onCloseForm}
            submitButtonLabel="Guardar"
            initialData={currentData}
            titleClassName="text-xl font-bold leading-6 text-primary mb-4"
            titleLabel={
              !empty(currentData.id)
                ? 'Editar participante'
                : 'Agregar participante'
            }
            submitButtonClassName="inline-flex w-full justify-center items-center rounded-md bg-primary px-10 py-3 text-sm font-semibold text-white shadow-sm hover:bg-secondary sm:ml-3 sm:w-auto"
          />
        </CustomModal>
      )}
    </div>
  );
};

const initialFormData = {
  id: null,
  name: '',
  email: '',
  confirmEmail: '',
  phoneNumber: '',
  institute: '',
  networks: '',
  medio: 'Formulario',

  subscribedTo: [],
  faculty: '',
  career: null,
  parentStudiedAtUCA: null,
  withParent: '0',
};

const getCustomActions = (onEdit, onDelete, userHasPermissionsToManage) => {
  if (!userHasPermissionsToManage) return [];

  return [
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
};

const columns = [
  {
    title: 'Nombre',
    field: 'name',
    render: (rowData) => <ContactInfo data={rowData} />,
  },
  {
    title: 'Facultad / Carrera de interés',
    field: 'permissions',
    render: (rowData) => <FacultyCareerRow data={rowData} />,
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Como se dio cuenta',
    field: 'networksLabel',
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Medio',
    field: 'medio',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
    render: (rowData) => <BadgeMedio medio={rowData.medio} />,
  },
];

const ContactInfo = ({data}) => {
  return (
    <div className="max-w-80">
      <p>{data.name}</p>
      <p className="text-gray-500 font-normal">{data.email}</p>
      <a
        rel="noreferrer"
        target="_blank"
        href={`https:wa.me/+${data.phoneNumber}`}
        className="text-blue-500 cursor-pointer hover:underline"
      >
        {`${formatPhoneNumber(data.phoneNumber)}`}
      </a>
      <p className="text-xs text-gray-500 font-normal">{data.institute}</p>
    </div>
  );
};

const FacultyCareerRow = ({data}) => {
  const subscribedTo = data?.subscribedTo ?? [];

  return (
    <div>
      {subscribedTo.map((item) => (
        <div key={item.event} className="mb-2">
          <p className="font-medium text-gray-600">
            {item.faculty?.name ?? 'N/A'}{' '}
            {new Date(item.event?.date).toLocaleDateString()}
          </p>
          {!empty(item.career) && (
            <ul className="list-disc list-inside">
              <li>{item.career?.name}</li>
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

// const ExtraInfo = ({data}) => {
//   return (
//     <ul className="list-disc list-inside">
//       <li className="text-xs text-gray-500 font-normal">
//         {data.parentUca ? 'Acompaña familiar' : 'Sin acompañamiento'}
//       </li>
//       <li className="text-xs text-gray-500 font-normal">
//         {data.means ? 'Recorrido por App' : 'Recorrido guiado'}
//       </li>
//     </ul>
//   );
// };

const BadgeMedio = ({medio}) => {
  const customClassName =
    medio === 'WhatsApp'
      ? 'bg-green-100 text-green-600'
      : medio === 'Formulario'
        ? 'bg-blue-100 text-blue-600'
        : 'bg-red-100 text-red-600';

  return (
    <div
      className={`flex justify-center item-center px-3 py-2 rounded-lg ${customClassName}`}
    >
      <p className="font-bold text-center">{medio}</p>
    </div>
  );
};

const formatPhoneNumber = (phone) => {
  if (!phone) {
    return '-';
  }

  const match = phone.match(/^(\d{3})(\d{4})(\d{4})$/);

  if (match) {
    const [, countryCode, firstPart, secondPart] = match;
    return `+${countryCode} ${firstPart}-${secondPart}`;
  }

  return phone;
};

export default Participants;
