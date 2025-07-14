/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import {BiEditAlt} from 'react-icons/bi';
import Permissions from '@utils/Permissions';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi';
import {HiOutlineUser, HiOutlineMail, HiOutlinePhone} from 'react-icons/hi';
import {HiOutlineViewGrid, HiOutlineViewList} from 'react-icons/hi';
import {HiOutlineQrCode} from 'react-icons/hi2';
import {useAuth} from '@context/AuthContext';
import useBooleanBox from '@hooks/useBooleanBox';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import DeleteDialog from '@components/Dashboard/DeleteDialog';
import ParticipationForm from '@components/Home/ParticipationForm';
import ParticipantQRModal from '@components/Dashboard/ParticipantQRModal';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteParticipant, getParticipants} from '@services/Participants';
import ParticipantsFilters from '@components/UI/Filters/ParticipantsFilters';
import AdvancedCustomTable from '@components/UI/Table/AdvancedCustomTable';
import ParticipantsCardView from '@components/Dashboard/ParticipantsCardView';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

const Participants = () => {
  const {permissions} = useAuth();
  const queryClient = useQueryClient();
  const [currentData, setCurrentParticipant] = useState(initialFormData);
  const {isOpen, onToggleBox, onClose} = useBooleanBox();
  const [participantIdToDelete, setParticipantIdToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [selectedParticipantForQR, setSelectedParticipantForQR] =
    useState(null);

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

  const handleShowQR = (participant) => {
    setSelectedParticipantForQR(participant);
  };

  const customActions = getCustomActions(
    onEdit,
    setParticipantIdToDelete,
    handleShowQR,
    permissions.includes(Permissions.MANAGE_PARTICIPANTS)
  );

  const handleDownloadExcel = async () => {
    try {
      const response = await getParticipants(permissions);
      const participants = response.rows || [];

      const participantsSheet = [];
      const eventSheets = {}; // { "Nombre evento - fecha": [inscripciones...] }

      participants.forEach((p) => {
        // Agregar participante a hoja general
        participantsSheet.push({
          Nombre: p.name,
          Email: p.email,
          Teléfono: formatPhoneNumber(p.phoneNumber),
          Instituto: p.institute,
          Medio: p.medio,
          Redes: p.networksLabel,
          'Registrado en': new Date(p.createdAt).toLocaleString('es-SV'),
        });

        // Categorizar inscripciones por evento
        if (Array.isArray(p.subscribedTo)) {
          p.subscribedTo.forEach((sub) => {
            const eventName = sub.event?.name || 'Evento desconocido';
            const eventDate = new Date(sub.event?.date).toLocaleDateString(
              'es-SV',
              {
                timeZone: 'UTC',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }
            );

            // Nombre seguro para la hoja de Excel (máx. 31 caracteres)
            const rawSheetName = `${eventDate} - ${eventName}`;
            // Reemplazar caracteres prohibidos en nombres de hoja de Excel
            const safeSheetName = rawSheetName
              .replace(/[:\\\/\?\*\[\]]/g, '-')
              .slice(0, 31);

            const row = {
              Nombre: p.name,
              Email: p.email,
              Teléfono: formatPhoneNumber(p.phoneNumber),
              Instituto: p.institute,
              Facultad: sub.faculty?.name ?? 'N/A',
              Carrera: sub.career?.name ?? 'N/A',
              Evento: eventName,
              medio: p.medio,
              Redes: p.networksLabel,
              FechaEvento: eventDate,
              Asistió: sub.attended ? 'Sí' : 'No',
              'Acompañado por familiar': sub.withParent ? 'Sí' : 'No',
              'Familiar estudió en UCA': sub.parentStudiedAtUCA ? 'Sí' : 'No',
              FechaInscripción: new Date(sub.subscribedAt).toLocaleString(
                'es-SV'
              ),
            };

            if (!eventSheets[safeSheetName]) {
              eventSheets[safeSheetName] = [];
            }
            eventSheets[safeSheetName].push(row);
          });
        }
      });

      // Crear el archivo Excel
      const wb = XLSX.utils.book_new();

      // Hoja general
      const wsParticipants = XLSX.utils.json_to_sheet(participantsSheet);
      XLSX.utils.book_append_sheet(wb, wsParticipants, 'Participantes');

      // Hojas por evento
      Object.entries(eventSheets).forEach(([sheetName, rows]) => {
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
      const blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });

      saveAs(blob, 'participantes-por-evento.xlsx');
    } catch (error) {
      console.error('Error exportando Excel:', error);
    }
  };

  return (
    <div>
      <CustomHeader title="Participantes" />

      <Breadcrumb pageName="Participantes" />

      <div className="flex justify-between items-center mb-4 mt-1 flex-wrap">
        <h1 className="text-primary text-3xl font-bold">Participantes</h1>
        <div className="flex gap-2 items-center">
          {/* Toggle de vista */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HiOutlineViewList className="mr-2" />
              Tabla
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'card'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HiOutlineViewGrid className="mr-2" />
              Fichas
            </button>
          </div>

          {permissions.includes(Permissions.MANAGE_PARTICIPANTS) && (
            <>
              <button
                type="button"
                onClick={handleDownloadExcel}
                className="btn bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700"
              >
                Descargar Excel
              </button>
              <button
                type="button"
                onClick={onToggleBox}
                className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary"
              >
                <AiOutlinePlus className="mr-2" />
                <span>Agregar participante</span>
              </button>
            </>
          )}
        </div>
      </div>

      {viewMode === 'table' ? (
        <AdvancedCustomTable
          columns={columns}
          queryKey="participants"
          defaultRowsPerPage={10}
          customActions={customActions}
          fetchData={getParticipants}
          CustomFilters={ParticipantsFilters}
          permissions={permissions}
          useAdvancedFiltering={true}
        />
      ) : (
        <ParticipantsCardView
          customActions={customActions}
          permissions={permissions}
        />
      )}

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
            submitButtonClassName="inline-flex w-full justify-center items-center rounded-md bg-primary px-10 py-3 text-sm font-semibold text-white shadow-xs hover:bg-secondary sm:ml-3 sm:w-auto"
          />
        </CustomModal>
      )}

      <ParticipantQRModal
        participant={selectedParticipantForQR}
        isOpen={!!selectedParticipantForQR}
        onClose={() => setSelectedParticipantForQR(null)}
      />
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

const getCustomActions = (
  onEdit,
  onDelete,
  onShowQR,
  userHasPermissionsToManage
) => {
  const actions = [
    {
      id: 1,
      label: '',
      tooltip: 'Ver QR',
      Icon: HiOutlineQrCode,
      onClick: onShowQR,
    },
  ];

  if (userHasPermissionsToManage) {
    actions.push(
      {
        id: 2,
        label: '',
        tooltip: 'Editar',
        Icon: BiEditAlt,
        onClick: onEdit,
      },
      {
        id: 3,
        label: '',
        tooltip: 'Borrar',
        Icon: HiOutlineTrash,
        onClick: (data) => onDelete(data.id),
      }
    );
  }

  return actions;
};

const columns = [
  {
    title: 'Persona',
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
    title: 'Institución',
    field: 'institute',
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
  {
    title: 'Fecha',
    field: 'createdAt',
    className: 'hidden lg:table-cell',
    render: (rowData) => (
      <div className="text-sm text-gray-600">
        {new Date(rowData.createdAt).toLocaleDateString('es-SV', {
          timeZone: 'America/El_Salvador',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    ),
  },
];

const ContactInfo = ({data}) => {
  return (
    <div className="max-w-80 space-y-2">
      <div className="flex items-center gap-2">
        <HiOutlineUser className="text-gray-500 text-sm flex-shrink-0" />
        <p
          className="font-semibold text-gray-900 text-base leading-tight truncate"
          title={data.name}
        >
          {data.name}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <HiOutlineMail className="text-gray-500 text-sm flex-shrink-0" />
        <a
          href={`mailto:${data.email}`}
          className="text-gray-600 text-sm font-normal leading-relaxed hover:text-blue-600 transition-colors duration-200"
        >
          {data.email}
        </a>
      </div>

      <div className="flex items-center gap-2">
        <HiOutlinePhone className="text-gray-500 text-sm flex-shrink-0" />
        <div className="flex gap-2">
          <a
            href={`tel:+${data.phoneNumber}`}
            className="text-blue-600 text-sm cursor-pointer hover:underline hover:text-blue-800 transition-colors duration-200"
          >
            {`${formatPhoneNumber(data.phoneNumber)}`}
          </a>
          <span className="text-gray-400">|</span>
          <a
            rel="noreferrer"
            target="_blank"
            href={`https://wa.me/+${data.phoneNumber}`}
            className="text-green-600 text-sm cursor-pointer hover:underline hover:text-green-800 transition-colors duration-200"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

const FacultyCareerRow = ({data}) => {
  const subscribedTo = data?.subscribedTo ?? [];
  const [showAllModal, setShowAllModal] = useState(false);

  if (subscribedTo.length === 0) {
    return <div className="text-gray-500 text-sm">Sin inscripciones</div>;
  }

  const firstItem = subscribedTo[0];
  const additionalCount = subscribedTo.length - 1;

  const renderAccompanimentBadges = (item) => {
    const withParent = item.withParent;
    const parentStudiedAtUCA = item.parentStudiedAtUCA;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            withParent
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {withParent ? 'Con acompañante' : 'Sin acompañante'}
        </span>

        {withParent && (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              parentStudiedAtUCA
                ? 'bg-blue-100 text-blue-800'
                : 'bg-orange-100 text-orange-800'
            }`}
          >
            {parentStudiedAtUCA
              ? 'Familiar estudió en UCA'
              : 'Familiar no estudió en UCA'}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
          <div className="flex flex-col gap-1">
            <h4 className="font-semibold text-gray-900 text-sm">
              {firstItem.faculty?.name ?? 'N/A'}
            </h4>
            <p className="text-xs text-gray-500 font-medium">
              Evento:{' '}
              {new Date(firstItem.event?.date).toLocaleDateString('es-SV', {
                timeZone: 'UTC',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            {!empty(firstItem.career) && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {firstItem.career?.name}
                </span>
              </div>
            )}
            {renderAccompanimentBadges(firstItem)}
          </div>
        </div>

        {additionalCount > 0 && (
          <button
            onClick={() => setShowAllModal(true)}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
          >
            +{additionalCount} más
          </button>
        )}
      </div>

      {showAllModal && (
        <CustomModal
          isOpen={showAllModal}
          onToggleModal={() => setShowAllModal(false)}
          className="p-6 w-full sm:max-w-4xl"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Todas las inscripciones de {data.name}
            </h3>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {subscribedTo.map((item, index) => (
              <div
                key={index + new Date().getTime()}
                className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500"
              >
                <div className="flex flex-col gap-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {item.faculty?.name ?? 'N/A'}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Evento:{' '}
                    {new Date(item.event?.date).toLocaleDateString('es-SV', {
                      timeZone: 'UTC',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {!empty(item.career) && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.career?.name}
                      </span>
                    </div>
                  )}
                  {renderAccompanimentBadges(item)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowAllModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>
        </CustomModal>
      )}
    </>
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

const BadgeMedio = ({medio, compact = false}) => {
  const customClassName =
    medio === 'WhatsApp'
      ? 'bg-green-100 text-green-600'
      : medio === 'Formulario'
        ? 'bg-blue-100 text-blue-600'
        : 'bg-red-100 text-red-600';

  if (compact) {
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${customClassName}`}
      >
        {medio}
      </span>
    );
  }

  return (
    <div
      className={`flex justify-center item-center px-3 py-2 rounded-lg ${customClassName}`}
    >
      <p className="font-bold text-center">{medio}</p>
    </div>
  );
};

const AccompanimentInfo = ({data}) => {
  const subscribedTo = data?.subscribedTo ?? [];

  if (subscribedTo.length === 0) {
    return <div className="text-gray-500 text-sm">-</div>;
  }

  return (
    <div className="space-y-2">
      {subscribedTo.map((item, index) => {
        const withParent = item.withParent;
        const parentStudiedAtUCA = item.parentStudiedAtUCA;

        return (
          <div key={index} className="text-sm">
            <div className="flex flex-col gap-1">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  withParent
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {withParent ? 'Con acompañante' : 'Sin acompañante'}
              </span>

              {withParent && (
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    parentStudiedAtUCA
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {parentStudiedAtUCA
                    ? 'Familiar estudió en UCA'
                    : 'Familiar no estudió en UCA'}
                </span>
              )}
            </div>
          </div>
        );
      })}
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
