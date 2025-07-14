import { useState } from 'react';
import useBooleanBox from '@hooks/useBooleanBox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCareer, deleteCareer, updateCareer } from '@services/Careers';

const useCareers = () => {
  const queryClient = useQueryClient();
  const { isOpen, onToggleBox, onClose } = useBooleanBox();
  const [currentData, setCurrentCareer] = useState(initialData);

  const onToggleForm = (data) => {
    setCurrentCareer(initialData);
    onToggleBox();
  };

  const onEdit = (data) => {
    setCurrentCareer(data);
    onToggleBox();
  };

  const onCreate = useMutation({
    mutationFn: createCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careers'] });
      onClose();
    },
  });

  const onUpdate = useMutation({
    mutationFn: updateCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careers'] });
      onClose();
    },
  });

  const onDelete = useMutation({
    mutationFn: deleteCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careers'] });
    },
  });

  return {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onToggleForm,
    onCloseForm: onClose,
    isOpenForm: isOpen,
    currentData,
  };
};

const initialData = {
  id: null,
  name: '',
};

export default useCareers;