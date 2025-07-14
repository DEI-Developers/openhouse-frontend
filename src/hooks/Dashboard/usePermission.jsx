import {useState} from 'react';
import useBooleanBox from '@hooks/useBooleanBox';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createPermission, deletePermission, updatePermission} from '@services/Permissions';

const usePermission = () => {
  const queryClient = useQueryClient();
  const {isOpen, onToggleBox, onClose} = useBooleanBox();
  const [currentData, setCurrentPermission] = useState(initialData);

  const onToggleForm = (data = initialData) => {
    setCurrentPermission(data);
    onToggleBox();
  };

  const onEdit = (data) => {
    setCurrentPermission(data);
    onToggleBox();
  };

  const onCreate = useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['permissions']});
      onClose();
    },
  });

  const onUpdate = useMutation({
    mutationFn: updatePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['permissions']});
      onClose();
    },
  });

  const onDelete = useMutation({
    mutationFn: deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['permissions']});
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
  value: '',
  name: '',
  type: '',
};

export default usePermission;