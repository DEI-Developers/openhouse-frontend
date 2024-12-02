import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  TransitionChild,
} from '@headlessui/react';
import {IoCloseOutline} from 'react-icons/io5';
import Logo from '../Logo';
import SectionMenu from './SectionMenu';

const MobileSidebar = ({menu, sidebarOpen, setSidebarOpen}) => {
  return (
    <Dialog
      open={sidebarOpen}
      onClose={setSidebarOpen}
      className="relative z-50 lg:hidden"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex">
        <DialogPanel
          transition
          className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
        >
          <TransitionChild>
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="-m-2.5 p-2.5"
              >
                <IoCloseOutline
                  aria-hidden="true"
                  className="size-6 text-white"
                />
              </button>
            </div>
          </TransitionChild>
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
            <div className="flex h-16 shrink-0 items-center mt-3">
              <Logo />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                {Object.keys(menu).map((key) => (
                  <SectionMenu
                    key={key}
                    label={key}
                    menu={menu[key]}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}
              </ul>
            </nav>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default MobileSidebar;
