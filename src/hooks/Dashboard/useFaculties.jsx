import { useState } from 'react';
import useBooleanBox from '@hooks/useBooleanBox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFaculty, deleteFaculty, updateFaculty, removeCareerFromFaculty } from '@services/Faculties';

const useFaculties = () => {
  const queryClient = useQueryClient();
  const { isOpen, onToggleBox, onClose } = useBooleanBox();
  const [currentData, setCurrentFaculty] = useState(initialData);

  const onToggleForm = (data) => {
    setCurrentFaculty(initialData);
    onToggleBox();
  };

  const onEdit = (data) => {
    setCurrentFaculty({
      ...data,
      careers: data.careers || [],
    });
    onToggleBox();
  };

  const onCreate = useMutation({
    mutationFn: createFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      onClose();
    },
  });

  const onUpdate = useMutation({
    mutationFn: updateFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
      onClose();
    },
  });

  const onDelete = useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
    },
  });

  const onRemoveCareer = useMutation({
    mutationFn: removeCareerFromFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculties'] });
    },
  });

  return {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onRemoveCareer,
    onToggleForm,
    onCloseForm: onClose,
    isOpenForm: isOpen,
    currentData,
  };
};

const initialData = {
  id: null,
  name: '',
  careers: [],
};

export default useFaculties;