import {useState} from 'react';
import useBooleanBox from '@hooks/useBooleanBox';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createEvent, deleteEvent, updateEvent} from '@services/Events';

const useEvents = () => {
  const queryClient = useQueryClient();
  const {isOpen, onToggleBox, onClose} = useBooleanBox();
  const [currentData, setCurrentUser] = useState(initialData);

  const onToggleForm = (data) => {
    setCurrentUser(initialData);
    onToggleBox();
  };

  const onEdit = (data) => {
    setCurrentUser(data);
    onToggleBox();
  };

  const onCreate = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['events']});
      onClose();
    },
  });

  const onUpdate = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['events']});
      onClose();
    },
  });

  const onDelete = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['events']});
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
  startDate: '',
  endDate: '',
  capacity: '',
  faculties: [],
  enabled: true,
};

export default useEvents;
