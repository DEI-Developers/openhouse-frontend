import {useState} from 'react';
import useBooleanBox from '@hooks/useBooleanBox';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  createPermission,
  deletePermission,
  updatePermission,
  hardDeletePermission,
  restorePermission,
} from '@services/Permissions';
import useFormWithToast from '@hooks/useFormWithToast';

const usePermission = () => {
  const queryClient = useQueryClient();
  const {isOpen, onToggleBox, onClose} = useBooleanBox();
  const [currentData, setCurrentPermission] = useState(initialData);
  const [showDeleted, setShowDeleted] = useState(false);
  const {createMutationConfig} = useFormWithToast();

  const onToggleForm = (data = initialData) => {
    setCurrentPermission(data);
    onToggleBox();
  };

  const onEdit = (data) => {
    setCurrentPermission(data);
    onToggleBox();
  };

  const onCreate = useMutation(
    createMutationConfig(
      createPermission,
      'Permiso creado exitosamente',
      'Error al crear el permiso',
      () => {
        queryClient.invalidateQueries({queryKey: ['permissions']});
        onClose();
      }
    )
  );

  const onUpdate = useMutation(
    createMutationConfig(
      updatePermission,
      'Permiso actualizado exitosamente',
      'Error al actualizar el permiso',
      () => {
        queryClient.invalidateQueries({queryKey: ['permissions']});
        onClose();
      }
    )
  );

  const onDelete = useMutation(
    createMutationConfig(
      deletePermission,
      'Permiso eliminado exitosamente',
      'Error al eliminar el permiso',
      () => {
        queryClient.invalidateQueries({queryKey: ['permissions']});
      }
    )
  );

  const onHardDelete = useMutation(
    createMutationConfig(
      hardDeletePermission,
      'Permiso eliminado permanentemente',
      'Error al eliminar permanentemente el permiso',
      () => {
        queryClient.invalidateQueries({queryKey: ['permissions']});
      }
    )
  );

  const onRestore = useMutation(
    createMutationConfig(
      restorePermission,
      'Permiso restaurado exitosamente',
      'Error al restaurar el permiso',
      () => {
        queryClient.invalidateQueries({queryKey: ['permissions']});
      }
    )
  );

  const toggleShowDeleted = () => {
    setShowDeleted(!showDeleted);
    queryClient.invalidateQueries({queryKey: ['permissions']});
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
  value: '',
  name: '',
  type: '',
};

export default usePermission;
