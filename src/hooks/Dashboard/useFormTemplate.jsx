import {useState} from 'react';
import useBooleanBox from '@hooks/useBooleanBox';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  createFormTemplate,
  updateFormTemplate,
  deleteFormTemplate,
  toggleFormTemplateActive,
} from '@services/FormTemplates';

const useFormTemplate = () => {
  const queryClient = useQueryClient();
  const {isOpen, onToggleBox, onClose} = useBooleanBox();
  const [currentData, setCurrentTemplate] = useState(initialData);

  const onToggleForm = (data) => {
    setCurrentTemplate(initialData);
    onToggleBox();
  };

  const onEdit = (data) => {
    setCurrentTemplate({
      id: data.id,
      name: data.name,
      description: data.description ?? '',
      isActive: data.isActive,
      fields: data.fields ?? [],
    });
    onToggleBox();
  };

  const onCreate = useMutation({
    mutationFn: createFormTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['formTemplates']});
      onClose();
    },
  });

  const onUpdate = useMutation({
    mutationFn: updateFormTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['formTemplates']});
      onClose();
    },
  });

  const onDelete = useMutation({
    mutationFn: deleteFormTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['formTemplates']});
    },
  });

  const onToggleActive = useMutation({
    mutationFn: toggleFormTemplateActive,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['formTemplates']});
    },
  });

  return {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onToggleActive,
    onToggleForm,
    onCloseForm: onClose,
    isOpenForm: isOpen,
    currentData,
  };
};

const initialData = {
  id: null,
  name: '',
  description: '',
  isActive: true,
  fields: [],
};

export default useFormTemplate;
