import { useState } from 'react';
import useBooleanBox from '@hooks/useBooleanBox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createCareer, 
  deleteCareer, 
  updateCareer,
  hardDeleteCareer,
  restoreCareer
} from '@services/Careers';

const useCareers = () => {
  const queryClient = useQueryClient();
  const { isOpen, onToggleBox, onClose } = useBooleanBox();
  const [currentData, setCurrentCareer] = useState(initialData);
  const [showDeleted, setShowDeleted] = useState(false);

  // Función para invalidar todas las queries de carreras
  const invalidateAllCareerQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['careers'] });
    queryClient.invalidateQueries({ queryKey: ['careers-with-deleted'] });
  };

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
      invalidateAllCareerQueries();
      onClose();
    },
  });

  const onUpdate = useMutation({
    mutationFn: updateCareer,
    onSuccess: () => {
      invalidateAllCareerQueries();
      onClose();
    },
  });

  const onDelete = useMutation({
    mutationFn: deleteCareer,
    onSuccess: () => {
      invalidateAllCareerQueries();
    },
  });

  const onHardDelete = useMutation({
    mutationFn: hardDeleteCareer,
    onSuccess: () => {
      invalidateAllCareerQueries();
    },
  });

  const onRestore = useMutation({
    mutationFn: restoreCareer,
    onSuccess: () => {
      invalidateAllCareerQueries();
    },
  });

  const toggleShowDeleted = () => {
    setShowDeleted(prev => !prev);
    invalidateAllCareerQueries();
  };

  return {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onHardDelete,
    onRestore,
    onToggleForm,
    onCloseForm: onClose,
    isOpenForm: isOpen,
    currentData,
    showDeleted,
    toggleShowDeleted,
  };
};

const initialData = {
  id: null,
  name: '',
};

export default useCareers;