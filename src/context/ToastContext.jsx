import React, {createContext, useContext} from 'react';
import {useToast, ToastContainer} from '@components/UI/Toast';

const ToastContext = createContext(null);

/**
 * Proveedor de contexto para toasts
 * Permite usar toasts desde cualquier componente hijo
 */
export const ToastProvider = ({children}) => {
  const toastMethods = useToast();

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastContainer
        toasts={toastMethods.toasts}
        onRemoveToast={toastMethods.removeToast}
        position="bottom-right"
      />
    </ToastContext.Provider>
  );
};

/**
 * Hook para usar el contexto de toasts
 * @returns {Object} Métodos para manejar toasts
 */
export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(
      'useToastContext debe ser usado dentro de un ToastProvider'
    );
  }
  return context;
};

export default ToastProvider;
