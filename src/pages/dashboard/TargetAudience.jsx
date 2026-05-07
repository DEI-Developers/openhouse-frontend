//@ts-nocheck
import { empty } from '@utils/helpers';
import React, { useState } from 'react';
import { getTargetAudiences } from '@services/TargetAudience';
import { BiEditAlt } from 'react-icons/bi';
import { AiOutlinePlus } from 'react-icons/ai';
import { HiOutlineTrash, HiOutlineLink } from 'react-icons/hi';
import { MdDeleteForever, MdRestore } from 'react-icons/md';
import useTargetAudience from '@hooks/Dashboard/useTargetAudicence';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import TargetAudienceForm from '@components/Dashboard/TargetAudience/TargetAudienceForm';
import CustomTable from '@components/UI/Table/CustomTable';
import DeleteDialog from '@components/Dashboard/DeleteDialog';


const TargetAudience = () => {
  const [targetAudienceIdToDelete, setTargetAudienceIdToDelete] = useState(null);
  const [targetAudienceToHardDelete, setTargetAudienceToHardDelete] = useState(null);

  const {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onHardDelete,
    onRestore,
    onCloseForm,
    onToggleForm,
    isOpenForm,
    currentData,
    showDeleted,
    toogleShowDeleted,
  } = useTargetAudience();

  const handleRestore = (id) => {
    onRestore.mutate(id);
  };

  const handleHardDelete = (id) => {
    setTargetAudienceToHardDelete(id);
  };

  const handleCopyLink = (data) => {
    const id = data.id ?? data.id;
    const link = `${window.location.origin}/registro/${id}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        alert('Enlace de registro copiado al portapapeles');
      })
      .catch(() => {
        alert('Error al copiar el enlace');
      });
  };

  const customActions = getCustomActions(
    onEdit,
    setTargetAudienceIdToDelete,
    handleHardDelete,
    handleRestore,
    handleCopyLink,
    showDeleted
  );

  const columns = getColumns(showDeleted);

  const fetchTargetAudiencesData = async (pageNumber, pageSize, searchedWord, filters = null) => {
    if (showDeleted) {
      const result = await getTargetAudiences(pageNumber, pageSize, searchedWord, filters, true);
      const deletedRows = result.rows.filter((row) => row.deletedAt);
      return {
        ...result,
        rows: deletedRows,
        nRows: deletedRows.length,
        nPages: Math.ceil(deletedRows.length / pageSize),
      };
    }
    return getTargetAudiences(pageNumber, pageSize, searchedWord, filters, false);
  };

 return (
    <div>
      <CustomHeader title="Público Objetivo" />
 
      <Breadcrumb pageName="Público Objetivo" />
 
      <div className="flex justify-between items-center mb-4 mt-1 flex-wrap gap-4">
        <h1 className="text-primary text-3xl font-bold">Gestión de Público Objetivo</h1>
        <div className="flex items-center gap-4 justify-between w-full md:w-auto">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => showDeleted && toogleShowDeleted()}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  !showDeleted
                    ? 'bg-primary text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => !showDeleted && toogleShowDeleted()}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  showDeleted
                    ? 'bg-red-500 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Eliminados
              </button>
            </div>
          </div>
 
          <button
            type="button"
            onClick={onToggleForm}
            className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <AiOutlinePlus className="md:mr-2" />
            <span className="hidden md:block">Agregar público objetivo</span>
          </button>
        </div>
      </div>
 
      <CustomTable
        columns={columns}
        queryKey={showDeleted ? 'target-audiences-with-deleted' : 'target-audiences'}
        customActions={customActions}
        fetchData={fetchTargetAudiencesData}
      />
 
      <DeleteDialog
        isOpen={!empty(targetAudienceIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setTargetAudienceIdToDelete(null)}
        onDelete={() => onDelete.mutate(targetAudienceIdToDelete)}
        title="Eliminar Público Objetivo"
        message="¿Estás seguro de que deseas eliminar este público objetivo? Esta acción se puede revertir."
      />
 
      <DeleteDialog
        isOpen={!empty(targetAudienceToHardDelete)}
        isLoading={onHardDelete.isPending}
        isSuccess={onHardDelete.isSuccess}
        onClose={() => setTargetAudienceToHardDelete(null)}
        onDelete={() => onHardDelete.mutate(targetAudienceToHardDelete)}
        title="Eliminar Permanentemente"
        message="¿Estás seguro de que deseas eliminar permanentemente este público objetivo? Esta acción NO se puede revertir."
        confirmText="Eliminar Permanentemente"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
 
      <CustomModal
        isOpen={isOpenForm}
        onToggleModal={onCloseForm}
        className="p-0 w-full sm:max-w-2xl"
      >
        <TargetAudienceForm
          initialData={currentData}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onClose={onCloseForm}
        />
      </CustomModal>
    </div>
  );

};

const getCustomActions = (onEdit, onDelete, onHardDelete, onRestore, onCopyLink, showDeleted) => [
  {
    id: 1,
    label: '',
    tooltip: 'Copiar enlace de registro',
    Icon: HiOutlineLink,
    onClick: onCopyLink,
    ruleToHide: (data) => showDeleted && data.deletedAt,
  },
  {
    id: 2,
    label: '',
    tooltip: 'Editar',
    Icon: BiEditAlt,
    onClick: onEdit,
    ruleToHide: (data) => showDeleted && data.deletedAt,
  },
  {
    id: 3,
    label: '',
    tooltip: 'Eliminar',
    Icon: HiOutlineTrash,
    onClick: (data) => onDelete(data._id ?? data.id),
    ruleToHide: (data) => showDeleted && data.deletedAt,
  },
  {
    id: 4,
    label: '',
    tooltip: 'Restaurar',
    Icon: MdRestore,
    onClick: (data) => onRestore(data._id ?? data.id),
    ruleToHide: (data) => !showDeleted || !data.deletedAt,
  },
  {
    id: 5,
    label: '',
    tooltip: 'Eliminar Permanentemente',
    Icon: MdDeleteForever,
    onClick: (data) => onHardDelete(data._id ?? data.id),
    ruleToHide: (data) => !showDeleted || !data.deletedAt,
  },
];

const getColumns = (showDeleted) => [
  {
    title: 'Estado',
    field: 'status',
    render: (rowData) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          rowData.deletedAt
            ? 'bg-red-100 text-red-800'
            : 'bg-green-100 text-green-800'
        }`}
      >
        {rowData.deletedAt ? 'Eliminado' : 'Activo'}
      </span>
    ),
  },
  {
    title: 'Nombre',
    field: 'name',
    render: (rowData) => (
      <span className={rowData.deletedAt ? 'text-red-500 line-through' : ''}>
        {rowData.name}
      </span>
    ),
  },
  {
    title: 'Facultades',
    field: 'faculties',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
    render: (rowData) => {
      if (!rowData.faculties || rowData.faculties.length === 0) {
        return <span className="text-gray-400 text-xs italic">Sin facultades</span>;
      }
      return (
        <span className={`text-sm ${rowData.deletedAt ? 'text-red-400' : 'text-gray-600'}`}>
          {rowData.faculties.length} facultad(es)
        </span>
      );
    },
  },
  {
    title: 'Enlace de registro',
    field: 'registrationLink',
    stackedColumn: true,
    className: 'hidden xl:table-cell',
    render: (rowData) => {
      if (rowData.deletedAt) return '-';
      const id = rowData._id ?? rowData.id;
      return (
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
          {`/registro/${id}`}
        </span>
      );
    },
  },
  {
    title: 'Fecha de creación',
    field: 'createdAt',
    stackedColumn: true,
    className: 'hidden xl:table-cell',
    render: (rowData) => {
      const date = new Date(rowData.createdAt);
      return (
        <span className={rowData.deletedAt ? 'text-red-500' : ''}>
          {date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      );
    },
  },
  {
    title: 'Fecha de eliminación',
    field: 'deletedAt',
    stackedColumn: true,
    className: 'hidden xl:table-cell',
    render: (rowData) => {
      if (!rowData.deletedAt) return '-';
      const date = new Date(rowData.deletedAt);
      return (
        <span className="text-red-500">
          {date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      );
    },
  },
];

export default TargetAudience;