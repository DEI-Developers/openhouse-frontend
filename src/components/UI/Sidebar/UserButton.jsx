import {IoChevronDownOutline} from 'react-icons/io5';
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/react';

const UserButton = () => {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="-m-1.5 flex items-center justify-start p-1.5">
        <img
          alt=""
          src="/uca-logo.png"
          className="size-10 rounded-full border p-1"
        />
        <span className="hidden lg:flex lg:items-center justify-start">
          <span
            aria-hidden="true"
            className="ml-2 text-sm font-semibold leading-6 text-gray-900"
          >
            Usuario UCA
          </span>
          <IoChevronDownOutline
            aria-hidden="true"
            className="ml-2 h-5 w-5 text-gray-400"
          />
        </span>
      </MenuButton>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <MenuItem>
          <button
            onClick={() => {}}
            className="block w-full px-3 py-1 text-sm text-left leading-6 text-gray-900 data-[focus]:bg-gray-50"
          >
            Cerrar sesión
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

export default UserButton;
