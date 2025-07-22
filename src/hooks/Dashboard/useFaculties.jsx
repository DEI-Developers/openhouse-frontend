import { useState } from 'react';
import useBooleanBox from '@hooks/useBooleanBox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  createFaculty, 
  deleteFaculty, 
  updateFaculty, 
  removeCareerFromFaculty,
  hardDeleteFaculty,
  restoreFaculty
} from '@services/Faculties';

const useFaculties = () => {
  const queryClient = useQueryClient();
  const { isOpen, onToggleBox, onClose } = useBooleanBox();
  const [currentData, setCurrentFaculty] = useState(initialData);
  const [showDeleted, setShowDeleted] = useState(false);

  // Función para invalidar todas las queries de facultades
  const invalidateAllFacultyQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['faculties'] });
    queryClient.invalidateQueries({ queryKey: ['faculties-with-deleted'] });
  };

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
      invalidateAllFacultyQueries();
      onClose();
    },
  });

  const onUpdate = useMutation({
    mutationFn: updateFaculty,
    onSuccess: () => {
      invalidateAllFacultyQueries();
      onClose();
    },
  });

  const onDelete = useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      invalidateAllFacultyQueries();
    },
  });

  const onHardDelete = useMutation({
    mutationFn: hardDeleteFaculty,
    onSuccess: () => {
      invalidateAllFacultyQueries();
    },
  });

  const onRestore = useMutation({
    mutationFn: restoreFaculty,
    onSuccess: () => {
      invalidateAllFacultyQueries();
    },
  });

  const onRemoveCareer = useMutation({
    mutationFn: removeCareerFromFaculty,
    onSuccess: () => {
      invalidateAllFacultyQueries();
      console.log('Carrera eliminada exitosamente de la facultad');
    },
    onError: (error) => {
      console.error('Error al eliminar la carrera de la facultad:', error);
    },
  });

  const toggleShowDeleted = () => {
    setShowDeleted(prev => !prev);
    invalidateAllFacultyQueries();
  };

  return {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onHardDelete,
    onRestore,
    onRemoveCareer,
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
  careers: [],
};

export default useFaculties;