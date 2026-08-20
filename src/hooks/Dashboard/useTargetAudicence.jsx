import {useState} from 'react';
import {
  createTargetAudience,
  deleteTargetAudience,
  hardDeleteTargetAudience,
  restoreTargetAudience,
  updateTargetAudience,
} from '@services/TargetAudience';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import useBooleanBox from '@hooks/useBooleanBox';

const useTargetAudience = () => {
  const {isOpen, onToggleBox, onClose} = useBooleanBox();
  const [currentData, setCurrentData] = useState(initialData);
  const [showDeleted, setShowDeleted] = useState(false);
  const queryClient = useQueryClient();

  const invalidateAllTargetAudienceQueries = () => {
    queryClient.invalidateQueries({queryKey: ['target-audiences']});
    queryClient.invalidateQueries({
      queryKey: ['target-audiences-with-deleted'],
    });
  };

  const onToggleForm = () => {
    setCurrentData(initialData);
    onToggleBox();
  };

  const onCreate = useMutation({
    mutationFn: createTargetAudience,
    onSuccess: () => {
      invalidateAllTargetAudienceQueries();
      onClose();
    },
  });

  const onEdit = (data) => {
    // Mongo devuelve `_id`; el form y el servicio Update esperan `id`.
    // Sin esta normalización, `data.id` queda undefined y el form cae en
    // onCreate (POST) en lugar de onUpdate (PUT), creando un duplicado.
    const id = data._id ?? data.id ?? null;

    // El listado del backend ahora popula faculties, que pueden llegar como
    // ObjectId-string o como { _id, name }. Los mapeamos al formato
    // { value, label, name } que matchea con las options del CustomMultiSelect
    // para que aparezcan preseleccionadas al editar.
    const faculties = (data.faculties || [])
      .filter((f) => f != null) // populate devuelve null si la facultad fue hard-deleted
      .map((f) => {
        if (typeof f === 'string') {
          return { value: f, label: f, name: f };
        }
        const value = f._id ?? f.value;
        const name = f.name ?? f.label ?? String(value);
        return { value, label: name, name };
      });

    setCurrentData({
      id,
      name: data.name ?? '',
      image: data.image ?? '',
      faculties,
      formTemplateId: data.formTemplateId ?? '',
    });
    onToggleBox();
  };

  const onUpdate = useMutation({
    mutationFn: updateTargetAudience,
    onSuccess: () => {
      invalidateAllTargetAudienceQueries();
      onClose();
    },
  });

  const onDelete = useMutation({
    mutationFn: deleteTargetAudience,
    onSuccess: () => {
      invalidateAllTargetAudienceQueries();
    },
  });

  const onHardDelete = useMutation({
    mutationFn: hardDeleteTargetAudience,
    onSuccess: () => {
      invalidateAllTargetAudienceQueries();
    },
  });

  const onRestore = useMutation({
    mutationFn: restoreTargetAudience,
    onSuccess: () => {
      invalidateAllTargetAudienceQueries();
    },
  });

  const toogleShowDeleted = () => {
    setShowDeleted((prev) => !prev);
    invalidateAllTargetAudienceQueries();
  };

  return {
    onEdit,
    onCreate,
    onUpdate,
    onDelete,
    onHardDelete,
    onRestore,
    toogleShowDeleted,
    showDeleted,
    onToggleForm,
    onCloseForm: onClose,
    isOpenForm: isOpen,
    currentData,
  };
};

const initialData = {
  id: null,
  name: '',
  image: '',
  faculties: [],
};

export default useTargetAudience;
