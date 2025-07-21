import {useState, useCallback} from 'react';
import Toast from './Toast';

/**
 * Contenedor de toasts que maneja múltiples toasts
 * @param {Object} props - Props del componente
 * @param {Array} props.toasts - Array de toasts a mostrar
 * @param {Function} props.onRemoveToast - Función para remover un toast
 * @param {string} props.position - Posición de los toasts: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
 */
const ToastContainer = ({
  toasts = [],
  onRemoveToast,
  position = 'top-right',
}) => {
  const getPositionClasses = () => {
    const baseClasses = 'fixed z-[9999] flex flex-col gap-2 p-4 pointer-events-none';
    
    switch (position) {
      case 'top-left':
        return `${baseClasses} top-0 left-0`;
      case 'top-right':
        return `${baseClasses} top-0 right-0`;
      case 'bottom-left':
        return `${baseClasses} bottom-0 left-0`;
      case 'bottom-right':
        return `${baseClasses} bottom-0 right-0`;
      default:
        return `${baseClasses} bottom-0 right-0`;
    }
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={getPositionClasses()}>
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemoveToast(toast.id)}
            duration={toast.duration}
            autoClose={toast.autoClose}
          />
        </div>
      ))}
    </div>
  );
};

/**
 * Hook personalizado para manejar toasts
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', options = {}) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type,
      duration: options.duration || 5000,
      autoClose: options.autoClose !== false,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, options) => {
    return addToast(message, 'success', options);
  }, [addToast]);

  const showError = useCallback((message, options) => {
    return addToast(message, 'error', options);
  }, [addToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    clearAll,
  };
};

export default ToastContainer;