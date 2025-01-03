import {HiMiniBars3} from 'react-icons/hi2';
import {useLocation} from 'react-router-dom';
import UserButton from './UserButton';

const MobileNavbar = ({customMenu, onOpenMenu}) => {
  const {pathname} = useLocation();
  const currentMenuName = getCurrentMenuName(pathname, customMenu);

  return (
    <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <button
        type="button"
        onClick={onOpenMenu}
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
      >
        <HiMiniBars3 aria-hidden="true" className="size-6" />
      </button>
      <h1 className="flex-1 text-sm font-semibold text-gray-900">
        {currentMenuName}
      </h1>

      <UserButton />
    </div>
  );
};

const flattenMenu = (menuObj) => {
  return Object.values(menuObj).flat();
};

const getCurrentMenuName = (pathname, menu) => {
  const flatMenu = flattenMenu(menu);
  const currentMenu = flatMenu.find(
    (item) => item.href !== '' && pathname.includes(item.href)
  );
  return currentMenu ? currentMenu.name : 'Inicio';
};

export default MobileNavbar;
