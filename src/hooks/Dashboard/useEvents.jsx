import {useState} from 'react';
import useBooleanBox from '@hooks/useBooleanBox';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createEvent, deleteEvent, updateEvent} from '@services/Events';

const useEvents = () => {
  const queryClient = useQueryClient();
  const {isOpen, onToggleBox, onClose} = useBooleanBox();
  const [currentData, setCurrentEvent] = useState(initialData);

  const onToggleForm = (data) => {
    setCurrentEvent(initialData);
    onToggleBox();
  };

  const onEdit = (data) => {
    setCurrentEvent(data);
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
  date: '',
  capacity: '',
  faculties: [],
  careers: [],
  isActive: true,
};

export default useEvents;
