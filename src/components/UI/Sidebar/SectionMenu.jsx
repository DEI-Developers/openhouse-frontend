import {Link, useLocation} from 'react-router-dom';
import {GoHome} from 'react-icons/go';
import {PiHandshake} from 'react-icons/pi';
import {HiOutlineUsers} from 'react-icons/hi2';
import {IoLockOpenOutline} from 'react-icons/io5';
import {IoCalendarClearOutline} from 'react-icons/io5';

const MenuItem = ({item, isActive, onClick}) => {
  const Icon = getIconByName(item.Icon);
  const containerClassName = `group flex gap-x-3 rounded-md p-2.5 text-sm/6 font-semibold ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-primary'}`;
  const iconClassName = `size-6 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`;
  return (
    <li key={item.name}>
      <Link
        to={'/plataforma/' + item.href}
        className={containerClassName}
        onClick={onClick}
      >
        <Icon aria-hidden="true" className={iconClassName} />
        {item.name}
      </Link>
    </li>
  );
};

const SectionMenu = ({label, menu, onClick}) => {
  const {pathname} = useLocation();

  return (
    <li>
      <p className="text-xs/6 font-semibold text-gray-400">{label}</p>
      <ul role="list" className="-mx-2 space-y-1">
        {menu.map((item) => (
          <MenuItem
            key={item.name}
            item={item}
            onClick={onClick}
            isActive={isActiveMenu(pathname, item.href)}
          />
        ))}
      </ul>
    </li>
  );
};

const getIconByName = (name) => {
  switch (name) {
    case 'GoHome':
      return GoHome;
    case 'PiHandshake':
      return PiHandshake;
    case 'HiOutlineUsers':
      return HiOutlineUsers;
    case 'IoLockOpenOutline':
      return IoLockOpenOutline;
    case 'IoCalendarClearOutline':
      return IoCalendarClearOutline;
    default:
      return GoHome;
  }
};

const isActiveMenu = (pathname, href) => {
  if (href === '') {
    return pathname === '/plataforma';
  }
  return pathname.includes(href);
};

export default SectionMenu;
