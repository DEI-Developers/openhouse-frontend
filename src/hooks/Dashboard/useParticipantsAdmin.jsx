// @ts-nocheck
import {useState} from 'react';
import useBooleanBox from '@hooks/useBooleanBox';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  createParticipantWithAttendance,
  updateParticipantWithAttendance,
  deleteParticipant,
} from '@services/Participants';

const useParticipantsAdmin = (
  initialData,
  onSuccess = (code) => {},
  onError = () => {}
) => {
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
    mutationFn: createParticipantWithAttendance,
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
    mutationFn: updateParticipantWithAttendance,
    onSuccess: (response) => {
      queryClient.invalidateQueries({queryKey: ['participants']});
      onClose();
      onSuccess(response.code);
    },
    onError: (error) => {
      onError(
        error?.response?.data?.errors ??
          'Opss! Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.'
      );
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

export default useParticipantsAdmin;