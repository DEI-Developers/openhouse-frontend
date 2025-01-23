// @ts-nocheck
import {useState} from 'react';
import useBooleanBox from '@hooks/useBooleanBox';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  createParticipant,
  deleteParticipant,
  updateParticipant,
} from '@services/Participants';

const useParticipants = (onSuccess = (code) => {}, onError = () => {}) => {
  const queryClient = useQueryClient();
  const {isOpen, onToggleBox, onClose} = useBooleanBox();
  const [currentData, setCurrentParticipant] = useState(initialData);

  const onToggleForm = (data) => {
    setCurrentParticipant(initialData);
    onToggleBox();
  };

  const onEdit = (data) => {
    setCurrentParticipant(data);
    onToggleBox();
  };

  const onCreate = useMutation({
    mutationFn: createParticipant,
    onSuccess: (response) => {
      onSuccess(response.code);
      queryClient.invalidateQueries({queryKey: ['participants']});
      onClose();
    },
    onError: (error) => {
      onError(
        error?.response?.data?.errors ??
          'Opss! Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.'
      );
    },
  });

  const onUpdate = useMutation({
    mutationFn: updateParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['participants']});
      onClose();
      onSuccess();
    },
  });

  const onDelete = useMutation({
    mutationFn: deleteParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['participants']});
    },
  });

  const onClean = () => {
    setCurrentParticipant(initialData);
  };

  return {
    onEdit,
    onClean,
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
  phoneNumber: '',
  name: '',
  institution: '',
  email: '',
  networks: '',
  faculty: '',
  grade: null,
  means: '1',
  parentUca: '1',
  medio: 'Formulario',
};

export default useParticipants;
