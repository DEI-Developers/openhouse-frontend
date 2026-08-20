/* eslint-disable prettier/prettier */
import {empty} from '@utils/helpers';
import React, {useState} from 'react';
import {BiEditAlt} from 'react-icons/bi';
import {getFormTemplates} from '@services/FormTemplates';
import {AiOutlinePlus} from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi';
import useFormTemplate from '@hooks/Dashboard/useFormTemplate';
import CustomHeader from '@components/UI/CustomHeader';
import Breadcrumb from '@components/Dashboard/Breadcrumb';
import CustomModal from '@components/UI/Modal/CustomModal';
import FormTemplateForm from '@components/Dashboard/FormTemplate/FormTemplateForm';
import CustomTable from '@components/UI/Table/CustomTable';
import DeleteDialog from '@components/Dashboard/DeleteDialog';

const FormTemplates = () => {
  const [templateIdToDelete, setTemplateIdToDelete] = useState(null);
  const {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onCloseForm,
    onToggleForm,
    isOpenForm,
    currentData,
  } = useFormTemplate();

  const customActions = getCustomActions(onEdit, setTemplateIdToDelete);

  return (
    <div>
      <CustomHeader title="Plantillas de formulario" />

      <Breadcrumb pageName="Plantillas de formulario" />

      <div className="flex justify-between items-center mb-4 mt-1 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-primary text-3xl font-bold">Plantillas de formulario</h1>
        </div>
        <button
          type="button"
          onClick={onToggleForm}
          className="btn flex justify-center items-center bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-secondary"
        >
          <AiOutlinePlus className="mr-2" />
          <span>Agregar plantilla</span>
        </button>
      </div>

      <CustomTable
        columns={getColumns()}
        queryKey="formTemplates"
        customActions={customActions}
        fetchData={getFormTemplates}
        CustomFilters={InactiveFilter}
      />

      <DeleteDialog
        isOpen={!empty(templateIdToDelete)}
        isLoading={onDelete.isPending}
        isSuccess={onDelete.isSuccess}
        onClose={() => setTemplateIdToDelete(null)}
        onDelete={() => onDelete.mutate(templateIdToDelete)}
      />

      <CustomModal
        isOpen={isOpenForm}
        onToggleModal={onCloseForm}
        className="p-0 w-full sm:max-w-4xl lg:max-w-5xl"
      >
        <FormTemplateForm
          initialData={currentData}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onClose={onCloseForm}
        />
      </CustomModal>
    </div>
  );
};

const getCustomActions = (onEdit, setTemplateIdToDelete) => [
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
    onClick: (data) => setTemplateIdToDelete(data.id),
  },
];

const getColumns = () => [
  {
    title: 'Nombre',
    field: 'name',
  },
  {
    title: 'Descripcion',
    field: 'description',
    stackedColumn: true,
    className: 'hidden lg:table-cell',
  },
  {
    title: 'Estado',
    field: 'isActive',
    render: (rowData) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          rowData.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {rowData.isActive ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
  {
    title: 'Campos',
    field: 'fields',
    render: (rowData) => (
      <span className="text-sm text-gray-600">
        {rowData.fields?.length ?? 0} campo(s)
      </span>
    ),
  },
];

const InactiveFilter = ({onApplyFilters}) => {
  const [showInactive, setShowInactive] = useState(false);

  const handleChange = (e) => {
    const checked = e.target.checked;
    setShowInactive(checked);
    onApplyFilters({includeInactive: checked});
  };

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center text-sm text-gray-600">
        <input
          type="checkbox"
          checked={showInactive}
          onChange={handleChange}
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        Mostrar inactivas
      </label>
    </div>
  );
};

export default FormTemplates;
