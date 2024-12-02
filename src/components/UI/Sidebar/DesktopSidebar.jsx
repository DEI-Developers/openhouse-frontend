import {CiLogout} from 'react-icons/ci';
import Logo from '../Logo';
import SectionMenu from './SectionMenu';

const DesktopSidebar = ({menu}) => {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-3 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <div className="flex h-16 shrink-0 items-center mt-3">
          <Logo />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-2">
            {Object.keys(menu).map((key) => (
              <SectionMenu
                key={key}
                label={key}
                menu={menu[key]}
                onClick={() => {}}
              />
            ))}
            <li className="-mx-6 mt-auto">
              <ul>
                <li className="w-full flex items-center px-4 pb-4">
                  <img
                    alt=""
                    src="/uca-logo.png"
                    className="size-10 rounded-full border p-1"
                  />
                  <span className="hidden lg:flex lg:items-center flex-1 justify-start">
                    <span
                      aria-hidden="true"
                      className="ml-2 text-sm font-semibold leading-6 text-gray-900"
                    >
                      Usuario UCA
                    </span>
                  </span>
                  <button
                    onClick={() => {}}
                    className="p-2.5 text-sm text-left leading-6 hover:bg-gray-50"
                  >
                    <CiLogout
                      aria-hidden="true"
                      className="size-6 text-gray-500"
                    />
                  </button>
                </li>
                {/* <li>
                  <div className="px-4 pb-3">
                    <button
                      onClick={() => {}}
                      className="w-full flex justify-start p-2.5 pl-4 text-sm text-left leading-6 hover:bg-gray-50"
                    >
                      <CiLogout
                        aria-hidden="true"
                        className="size-6 text-gray-500"
                      />
                      <span className="ml-2 text-gray-500">Cerrar sesión</span>
                    </button>
                  </div>
                </li> */}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DesktopSidebar;
