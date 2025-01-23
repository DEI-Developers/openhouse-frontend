import {Fragment} from 'react';
import {VscClose} from 'react-icons/vsc';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';

import Portal from './Portal';

const CustomModal = ({
  children,
  onToggleModal,
  isOpen,
  className,
  overlayClassName = '',
  closeOnBackdropClick = true,
}) => {
  const onBackgroundClose = () => {
    if (closeOnBackdropClick) {
      onToggleModal();
    }
  };

  return (
    <Portal selector="body">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onBackgroundClose}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${overlayClassName}`}
            />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  className={`relative transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl ${className}`}
                >
                  {onToggleModal && (
                    <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                      <button
                        type="button"
                        onClick={onToggleModal}
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <span className="sr-only">Close</span>
                        <VscClose className="h-7 w-7" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                  <div>{children}</div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Portal>
  );
};

export default CustomModal;
