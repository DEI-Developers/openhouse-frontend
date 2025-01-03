/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import {BiEditAlt} from 'react-icons/bi';
import {getEvents} from '@services/Events';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi';
import useEvents from '@hooks/Dashboard/useEvents';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import CustomTable from '@components/UI/Table/CustomTable';
import DeleteDialog from '@components/Dashboard/DeleteDialog';
import EventForm from '@components/Dashboard/Event/EventForm';

const Events = () => {
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const {onEdit, onCreate, onUpdate, onDelete, onCloseForm, onToggleForm, isOpenForm, currentData} = useEvents();
  const customActions = getCustomActions(onEdit, setEventIdToDelete);

  return (
    <div>
      <CustomHeader title="Eventos" />

      <Breadcrumb pageName="Eventos" />

      <div className="flex justify-between items-center mb-4 mt-1">
        <h1 className="text-primary text-3xl font-bold">Eventos</h1>
        <button
          type="button"
          onClick={onToggleForm}
          className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary"
        >
          <AiOutlinePlus className="mr-2" />
          <span>Agregar evento</span>
        </button>
      </div>

      <CustomTable
        columns={columns}
        queryKey="events"
        customActions={customActions}
        fetchData={getEvents}
      />

      <DeleteDialog
        isOpen={!empty(eventIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setEventIdToDelete(null)}
        onDelete={() => onDelete.mutate(eventIdToDelete)}
      />

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
    title: 'Evento',
    field: 'name',
  },
  {
    title: 'Fecha de inicio',
    field: 'startDate',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Fecha de fin',
    field: 'endDate',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Capacidad',
    field: 'capacity',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
];

export default Events;
