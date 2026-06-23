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
    const transformedData = {
      ...data,
      career: data.careerIds?.map((id, i) => ({
        value: id,
        label: data.careerNames?.[i] ?? '',
      })) ?? [],
    };
    setCurrentUser(transformedData);
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
  email: '',
  password: '',
  role: null,
  faculty: null,
  career: null,
  isActive: true,
};

export default useUsers;
