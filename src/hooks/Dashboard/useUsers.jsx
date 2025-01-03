import {useState} from 'react';
import useBooleanBox from '@hooks/useBooleanBox';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createUser, deleteUser, updateUser} from '@services/Users';

const useUsers = () => {
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
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users']});
      onClose();
    },
  });

  const onUpdate = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users']});
      onClose();
    },
  });

  const onDelete = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users']});
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
  lastname: '',
  birthdate: '',
  email: '',
  rol: '',
  institute: '',
  isActive: true,
  password: '12345678',
};

export default useUsers;
