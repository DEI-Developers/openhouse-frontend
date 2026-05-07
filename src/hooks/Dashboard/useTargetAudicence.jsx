import { useState } from 'react';
import {
    createTargetAudience,
    deleteTargetAudience,
    hardDeleteTargetAudience,
    restoreTargetAudience,
    updateTargetAudience
} from '@services/TargetAudience';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useBooleanBox from '@hooks/useBooleanBox';

const useTargetAudience = () => {
    const {isOpen, onToggleBox, onClose} = useBooleanBox();
    const [currentData, setCurrentData] = useState(initialData);
    const [showDeleted, setShowDeleted] = useState(false);
    const queryClient = useQueryClient();

    const invalidateAllTargetAudienceQueries = () => {
        queryClient.invalidateQueries({queryKey: ['target-audiences']});
        queryClient.invalidateQueries({queryKey: ['target-audiences-with-deleted']});
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
        setCurrentData({
            ...data,
            faculties: data.faculties || [],
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
    faculties: [],
};

export default useTargetAudience;