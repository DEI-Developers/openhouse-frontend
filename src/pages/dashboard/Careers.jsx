/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import {getCareers} from '@services/Careers';
import {BiEditAlt} from 'react-icons/bi';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi';
import useCareers from '@hooks/Dashboard/useCareers';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import CareerForm from '@components/Dashboard/Career/CareerForm';
import CustomTable from '@components/UI/Table/CustomTable';
import DeleteDialog from '@components/Dashboard/DeleteDialog';

const Careers = () => {
  const [careerIdToDelete, setCareerIdToDelete] = useState(null);
  const {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onCloseForm,
    onToggleForm,
    isOpenForm,
    currentData,
  } = useCareers();
  const customActions = getCustomActions(onEdit, setCareerIdToDelete);

  return (
    <div>
      <CustomHeader title="Carreras" />

      <Breadcrumb pageName="Carreras" />

      <div className="flex justify-between items-center mb-4 mt-1">
        <h1 className="text-primary text-3xl font-bold">Carreras</h1>
        <button
          type="button"
          onClick={onToggleForm}
          className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary"
        >
          <AiOutlinePlus className="mr-2" />
          <span>Agregar carrera</span>
        </button>
      </div>

      <CustomTable
        columns={columns}
        queryKey="careers"
        customActions={customActions}
        fetchData={getCareers}
      />

      <DeleteDialog
        isOpen={!empty(careerIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setCareerIdToDelete(null)}
        onDelete={() => onDelete.mutate(careerIdToDelete)}
      />

      <CustomModal
        isOpen={isOpenForm}
        onToggleModal={onCloseForm}
        className="p-0 w-full sm:max-w-2xl"
      >
        <CareerForm
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
];

export default Careers;
