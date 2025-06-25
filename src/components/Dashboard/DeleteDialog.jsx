import {useEffect} from 'react';
import {BsExclamationTriangle} from 'react-icons/bs';
import CustomModal from '@components/UI/Modal/CustomModal';
import SubmitButton from '@components/UI/Form/SubmitButton';

const DeleteDialog = ({
  isOpen,
  isLoading = false,
  isSuccess = false,
  onDelete,
  onClose,
}) => {
  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

  return (
    <CustomModal
      isOpen={isOpen}
      onToggleModal={onClose}
      className="p-0 pt-4 sm:w-full sm:max-w-lg"
    >
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <BsExclamationTriangle
              aria-hidden="true"
              className="h-5 w-5 text-red-600"
            />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Eliminar registro
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                ¿Estás seguro de que deseas eliminar este registro? Esta acción
                es irreversible y no podrás recuperar la información.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <SubmitButton
          type="button"
          label="Eliminar"
          loading={isLoading}
          onClick={onDelete}
          className={`${buttonClassName} border-transparent bg-red-600 text-white shadow-xs hover:bg-red-700  focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm`}
        />

        <button
          type="button"
          onClick={onClose}
          className={`${buttonClassName} mt-3 border-gray-300 bg-white text-gray-700 shadow-xs hover:bg-gray-50 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
        >
          Cancelar
        </button>
      </div>
    </CustomModal>
  );
};

const buttonClassName =
  'inline-flex w-full justify-center rounded-md border px-4 py-2 text-base font-medium focus:outline-hidden focus:ring-2 focus:ring-offset-2';

export default DeleteDialog;
