import {useEffect} from 'react';
import {VscClose} from 'react-icons/vsc';
import {BsFillXCircleFill, BsFillCheckCircleFill} from 'react-icons/bs';

/**
 * Componente Toast reutilizable para mostrar mensajes de éxito y error
 * @param {Object} props - Props del componente
 * @param {string} props.message - Mensaje a mostrar
 * @param {string} props.type - Tipo de toast: 'success' | 'error'
 * @param {Function} props.onClose - Función para cerrar el toast
 * @param {number} props.duration - Duración en ms antes de auto-cerrar (default: 5000)
 * @param {boolean} props.autoClose - Si debe cerrarse automáticamente (default: true)
 */
const Toast = ({
  message,
  type = 'success',
  onClose,
  duration = 5000,
  autoClose = true,
}) => {
  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const isSuccess = type === 'success';
  const isError = type === 'error';

  const getStyles = () => {
    if (isSuccess) {
      return {
        container:
          'rounded-md bg-green-50 p-4 shadow-lg border border-green-200',
        icon: 'size-5 text-green-400',
        text: 'text-sm font-medium text-green-800',
        button:
          'inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-hidden focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50',
      };
    }

    if (isError) {
      return {
        container: 'rounded-md bg-red-50 p-4 shadow-lg border border-red-200',
        icon: 'size-5 text-red-400',
        text: 'text-sm font-medium text-red-800',
        button:
          'inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50',
      };
    }

    return {};
  };

  const styles = getStyles();
  const IconComponent = isSuccess ? BsFillCheckCircleFill : BsFillXCircleFill;

  return (
    <div className={styles.container}>
      <div className="flex">
        <div className="shrink-0">
          <IconComponent aria-hidden="true" className={styles.icon} />
        </div>
        <div className="ml-3 flex-1">
          <p className={styles.text}>{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={() => onClose()}
              className={styles.button}
            >
              <span className="sr-only">Cerrar</span>
              <VscClose aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
