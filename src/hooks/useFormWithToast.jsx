import {useToastContext} from '@context/ToastContext';

/**
 * Hook reutilizable para formularios con notificaciones toast
 * Proporciona funciones para mostrar toasts de éxito y error
 * y manejar respuestas de mutaciones de API
 */
const useFormWithToast = () => {
  const {showSuccess, showError} = useToastContext();

  /**
   * Maneja la respuesta exitosa de una mutación
   * @param {Object} response - Respuesta de la API
   * @param {string} successMessage - Mensaje de éxito personalizado
   * @param {Function} onSuccess - Callback adicional en caso de éxito
   */
  const handleMutationSuccess = (response, successMessage, onSuccess) => {
    if (response?.success === false) {
      showError(response.errors || 'Error en la operación');
    } else {
      showSuccess(successMessage);
      if (onSuccess) onSuccess(response);
    }
  };

  /**
   * Maneja errores de mutación
   * @param {Object} error - Error de la API
   * @param {string} defaultErrorMessage - Mensaje de error por defecto
   * @param {Function} onError - Callback adicional en caso de error
   */
  const handleMutationError = (error, defaultErrorMessage, onError) => {
    console.error('Error en mutación:', error);
    
    let errorMessage = defaultErrorMessage;
    
    if (error?.response?.data?.errors) {
      errorMessage = error.response.data.errors;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    showError(errorMessage);
    if (onError) onError(error);
  };

  /**
   * Crea configuración de mutación con manejo de toasts
   * @param {Function} mutationFn - Función de mutación
   * @param {string} successMessage - Mensaje de éxito
   * @param {string} errorMessage - Mensaje de error por defecto
   * @param {Function} onSuccess - Callback adicional en caso de éxito
   * @param {Function} onError - Callback adicional en caso de error (opcional)
   */
  const createMutationConfig = (
    mutationFn,
    successMessage,
    errorMessage,
    onSuccess = null,
    onError = null
  ) => ({
    mutationFn: (variables) => mutationFn(variables),
    onSuccess: (response) => handleMutationSuccess(response, successMessage, onSuccess),
    onError: (error) => handleMutationError(error, errorMessage, onError),
  });

  return {
    showSuccess,
    showError,
    handleMutationSuccess,
    handleMutationError,
    createMutationConfig,
  };
};

export default useFormWithToast;