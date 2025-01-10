import {useState} from 'react';
import useBooleanBox from '@hooks/useBooleanBox';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createRole, deleteRole, updateRole} from '@services/Roles';

const useRole = () => {
  const queryClient = useQueryClient();
  const {isOpen, onToggleBox, onClose} = useBooleanBox();
  const [currentData, setCurrentRole] = useState(initialData);

  const onToggleForm = (data) => {
    setCurrentRole(initialData);
    onToggleBox();
  };

  const onEdit = (data) => {
    setCurrentRole(data);
    onToggleBox();
  };

  const onCreate = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['roles']});
      onClose();
    },
  });

  const onUpdate = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['roles']});
      onClose();
    },
  });

  const onDelete = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['roles']});
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
  description: '',
  permissions: [],
};

export default useRole;
