/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import {getFaculties} from '@services/Faculties';
import {BiEditAlt} from 'react-icons/bi';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi';
import useFaculties from '@hooks/Dashboard/useFaculties';
import useCatalogs from '@hooks/Dashboard/useCatalogs';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import FacultyForm from '@components/Dashboard/Faculty/FacultyForm';
import CustomTable from '@components/UI/Table/CustomTable';
import DeleteDialog from '@components/Dashboard/DeleteDialog';

const Faculties = () => {
  const [facultyIdToDelete, setFacultyIdToDelete] = useState(null);
  const { careers } = useCatalogs();
  const {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onRemoveCareer,
    onCloseForm,
    onToggleForm,
    isOpenForm,
    currentData,
  } = useFaculties();
  const customActions = getCustomActions(onEdit, setFacultyIdToDelete);
  const columns = getColumns(onRemoveCareer);

  return (
    <div>
      <CustomHeader title="Facultades" />

      <Breadcrumb pageName="Facultades" />

      <div className="flex justify-between items-center mb-4 mt-1">
        <h1 className="text-primary text-3xl font-bold">Facultades</h1>
        <button
          type="button"
          onClick={onToggleForm}
          className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary"
        >
          <AiOutlinePlus className="mr-2" />
          <span>Agregar facultad</span>
        </button>
      </div>

      <CustomTable
        columns={columns}
        queryKey="faculties"
        customActions={customActions}
        fetchData={getFaculties}
      />

      <DeleteDialog
        isOpen={!empty(facultyIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setFacultyIdToDelete(null)}
        onDelete={() => onDelete.mutate(facultyIdToDelete)}
      />

      <CustomModal
        isOpen={isOpenForm}
        onToggleModal={onCloseForm}
        className="p-0 w-full sm:max-w-2xl"
      >
        <FacultyForm
          initialData={currentData}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onClose={onCloseForm}
          careers={careers}
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

const getColumns = (onRemoveCareer) => [
  {
    title: 'Nombre',
    field: 'name',
  },
  {
    title: 'Carreras',
    field: 'careers',
    render: (rowData) => {
      if (!rowData.careers || rowData.careers.length === 0) {
        return (
          <span className="text-sm text-gray-500 italic">
            Sin carreras
          </span>
        );
      }
      
      return (
        <div className="flex flex-wrap gap-2">
          {rowData.careers.map((career, index) => {
            const careerName = typeof career === 'string' ? career : career.name || career.label;
            const careerId = typeof career === 'object' ? career.id : index;
            
            return (
              <span
                key={careerId || index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {careerName}
                <button
                  type="button"
                  onClick={() => onRemoveCareer.mutate({facultyId: rowData.id, careerId})}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:bg-blue-200 hover:text-blue-600 rounded-full focus:outline-none"
                  title="Eliminar carrera"
                >
                  <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 8 8">
                    <path d="M1.41 0L0 1.41 2.59 4 0 6.59 1.41 8 4 5.41 6.59 8 8 6.59 5.41 4 8 1.41 6.59 0 4 2.59 1.41 0z" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      );
    },
  },
];

export default Faculties;
