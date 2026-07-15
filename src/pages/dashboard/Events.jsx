/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState, useEffect} from 'react';
import {BiEditAlt} from 'react-icons/bi';
import {getEvents} from '@services/Events';
import Permissions from '@utils/Permissions';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineTrash, HiViewGrid, HiViewList, HiOutlineDocument} from 'react-icons/hi';
import {BsLink45Deg} from 'react-icons/bs';
import {useAuth} from '@context/AuthContext';
import useEvents from '@hooks/Dashboard/useEvents';
import useCatalogs from '@hooks/Dashboard/useCatalogs';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import CustomTable from '@components/UI/Table/CustomTable';
import DeleteDialog from '@components/Dashboard/DeleteDialog';
import EventForm from '@components/Dashboard/Event/EventForm';
import EventsFilters from '@components/UI/Filters/EventsFilters';
import EventsCardView from '@components/Dashboard/Event/EventsCardView';
import {BASE_PATH_URL} from '@config/index';

const Events = () => {
  const {permissions} = useAuth();
  const {faculties} = useCatalogs();
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' o 'card'
  const {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onCloseForm,
    onToggleForm,
    isOpenForm,
    currentData,
  } = useEvents();
  const customActions = getCustomActions(
    onEdit,
    setEventIdToDelete,
    permissions.includes(Permissions.MANAGE_EVENTS)
  );

  // Detectar si es móvil para forzar vista de tarjeta
  useEffect(() => {
    const checkIsMobile = () => {
      const isMobile = window.innerWidth < 640; // sm breakpoint - solo móviles pequeños
      if (isMobile && viewMode === 'table') {
        setViewMode('card');
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, [viewMode]);

  const isMobile = window.innerWidth < 640; // sm breakpoint

  return (
    <div>
      <CustomHeader title="Eventos" />

      <Breadcrumb pageName="Eventos" />

      <div className="flex justify-between items-center mb-4 mt-1">
        <h1 className="text-primary text-3xl font-bold">Eventos</h1>

        <div className="flex items-center space-x-3">
          {/* Selector de vista - solo en desktop */}
          {!isMobile && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HiViewList className="w-4 h-4 mr-2" />
                Tabla
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'card'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HiViewGrid className="w-4 h-4 mr-2" />
                Tarjetas
              </button>
            </div>
          )}

          {permissions.includes(Permissions.MANAGE_EVENTS) && (
            <button
              type="button"
              onClick={onToggleForm}
              className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary"
            >
              <AiOutlinePlus className="mr-2" />
              <span>Agregar evento</span>
            </button>
          )}
        </div>
      </div>

      {/* Renderizar vista según el modo seleccionado */}
      {viewMode === 'table' ? (
        <CustomTable
          columns={columns}
          queryKey="events"
          customActions={customActions}
          fetchData={getEvents}
          CustomFilters={EventsFilters}
        />
      ) : (
        <EventsCardView
          customActions={customActions}
          onEdit={onEdit}
          onDelete={setEventIdToDelete}
        />
      )}

      <DeleteDialog
        isOpen={!empty(eventIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setEventIdToDelete(null)}
        onDelete={() => onDelete.mutate(eventIdToDelete)}
      />

      {permissions.includes(Permissions.MANAGE_EVENTS) && (
        <CustomModal
          isOpen={isOpenForm}
          onToggleModal={onCloseForm}
          className="p-0 w-full sm:max-w-3xl"
        >
          <EventForm
            initialData={currentData}
            onCreate={onCreate}
            onUpdate={onUpdate}
            onClose={onCloseForm}
            faculties={faculties}
          />
        </CustomModal>
      )}
    </div>
  );
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
    title: 'Fecha',
    field: 'formatDate',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Evento',
    field: 'name',
    className: 'max-w-sm',
  },
  {
    title: 'Facultades',
    field: 'faculties',
    render: (rowData) => <Faculties data={rowData.faculties} />,
  },
  {
    title: 'Carreras',
    field: 'careerLabels',
    render: (rowData) => <Careers data={rowData.careerLabels} />,
  },
  {
    title: 'Capacidad',
    field: 'capacity',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
    render: (rowData) => <Capacity data={rowData} />,
  },
  {
    title: 'Deserción (%)',
    field: 'desertionRate',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
    render: (rowData) => <DesertionRate data={rowData} />,
  },
  {
    title: 'Estado',
    field: 'isActive',
    render: (rowData) => <BadgeStatus status={rowData.isActive} />,
  },
  {
    title: 'Registro público',
    field: 'id',
    className: 'text-right',
    render: (rowData) => <PublicRegistration event={rowData} tableMode />,
  },
];

const Faculties = ({data}) => {
  return (
    <div className="flex flex-wrap gap-1">
      {data.map((faculty) => (
        <span
          key={faculty.value}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {faculty.name}
        </span>
      ))}
    </div>
  );
};

const Careers = ({data}) => {
  if (!data || data.length === 0) {
    return <span className="text-gray-400 text-xs">Sin carreras</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {data.map((career, index) => (
        <span
          key={career.value || index}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
        >
          {career.name || career}
        </span>
      ))}
    </div>
  );
};

const Capacity = ({data}) => {
  return (
    <div className="flex items-center justify-center">
      <p>
        <span className="font-bold">{data.subscribed?.length ?? 0}</span>/
        <span>{data.capacity}</span>
      </p>
    </div>
  );
};

const DesertionRate = ({data}) => {
  const rate = data.desertionRate || 0;
  return (
    <div className="flex items-center justify-center">
      <span className="font-medium">{rate}%</span>
    </div>
  );
};

// Botones de registro público para la columna de la tabla
const PublicRegistration = ({event, tableMode = false}) => {
  const handleOpenLink = () => {
    const url = `${window.location.origin}${BASE_PATH_URL}/evento/${event.id}`
    window.open(url, '_blank')
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {/* Botón QR PDF */}
      <button
        onClick={() => handleDownloadQRPdf(event)}
        className={`flex items-center gap-1 text-primary border border-primary rounded hover:bg-primary hover:text-white transition-colors ${
          tableMode ? 'p-1.5' : 'px-2 py-1.5 text-xs font-medium'
        }`}
        title="Descargar QR en PDF"
      >
        <HiOutlineDocument className={tableMode ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        {!tableMode && <span className="hidden sm:inline">QR PDF</span>}
      </button>

      {/* Botón abrir enlace en nueva pestaña */}
      <button
        onClick={handleOpenLink}
        className={`flex items-center gap-1 text-white bg-primary rounded hover:bg-primary/90 transition-colors ${
          tableMode ? 'p-1.5' : 'px-2 py-1.5 text-xs font-medium'
        }`}
        title="Abrir formulario de registro en nueva pestaña"
      >
        <BsLink45Deg className={tableMode ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        {!tableMode && <span className="hidden sm:inline">Enlace</span>}
      </button>
    </div>
  )
}

const handleDownloadQRPdf = async (event) => {
  try {
    const {jsPDF} = await import('jspdf')
    const QRCode = await import('qrcode')
    const registrationUrl = `${window.location.origin}${BASE_PATH_URL}/evento/${event.id}`
    const qrDataUrl = await QRCode.toDataURL(registrationUrl, {width: 300, margin: 2})

    const pdf = new jsPDF({unit: 'mm', format: 'a4'})
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    pdf.setFillColor(250, 250, 250)
    pdf.rect(0, 0, pageWidth, pageHeight, 'F')

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(22)
    pdf.setTextColor(0, 59, 108)
    pdf.text('Vive la UCA', pageWidth / 2, 25, {align: 'center'})

    pdf.setDrawColor(0, 59, 108)
    pdf.setLineWidth(0.5)
    pdf.line(30, 30, pageWidth - 30, 30)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(16)
    pdf.setTextColor(30, 30, 30)
    pdf.text(event.name || 'Evento', pageWidth / 2, 42, {align: 'center'})

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(12)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Fecha: ${event.formatDate || event.date || 'N/A'}`, pageWidth / 2, 52, {align: 'center'})

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(60, 60, 60)
    pdf.text('Escaneá este código QR con la cámara de tu celular', pageWidth / 2, 68, {align: 'center'})
    pdf.text('para registrar tu asistencia el día del evento.', pageWidth / 2, 74, {align: 'center'})

    const qrSize = 80
    const qrX = (pageWidth - qrSize) / 2
    pdf.addImage(qrDataUrl, 'PNG', qrX, 82, qrSize, qrSize)

    pdf.setFontSize(8)
    pdf.setTextColor(120, 120, 120)
    pdf.text('O visitá:', pageWidth / 2, 170, {align: 'center'})
    pdf.setFontSize(9)
    pdf.setTextColor(0, 59, 108)
    pdf.text(registrationUrl, pageWidth / 2, 178, {align: 'center'})

    pdf.save(`qr_${(event.name || 'evento').replace(/\s+/g, '_')}.pdf`)
  } catch (err) {
    console.error('Error generando PDF:', err)
  }
}

const BadgeStatus = ({status}) => {
  const customClassName = status
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

export default Events;
