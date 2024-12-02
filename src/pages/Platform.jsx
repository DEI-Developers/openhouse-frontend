import {Suspense, useState} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import MobileNavbar from '@components/UI/Sidebar/MobileNavbar';
import MobileSidebar from '@components/UI/Sidebar/MobileSidebar';
import DesktopSidebar from '@components/UI/Sidebar/DesktopSidebar';

import {GoHome} from 'react-icons/go';
import {PiHandshake} from 'react-icons/pi';
import {HiOutlineUsers} from 'react-icons/hi2';
import {IoLockOpenOutline} from 'react-icons/io5';
import {IoCalendarClearOutline} from 'react-icons/io5';
import {Stadistics, Roles, Users, Events, Participants} from './dashboard';

const customMenu = {
  '': [
    {
      name: 'Inicio',
      href: '',
      Icon: GoHome,
    },
  ],
  'Usuarios y Seguridad': [
    {
      name: 'Usuarios',
      href: 'usuarios',
      Icon: HiOutlineUsers,
    },
    {
      name: 'Roles',
      href: 'roles',
      Icon: IoLockOpenOutline,
    },
  ],
  'Vive la UCA': [
    {
      name: 'Eventos',
      href: 'eventos',
      Icon: IoCalendarClearOutline,
    },
    {
      name: 'Participantes',
      href: 'participantes',
      Icon: PiHandshake,
    },
  ],
};

const Platform = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <DesktopSidebar menu={customMenu} />

        <MobileSidebar
          menu={customMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <MobileNavbar
          customMenu={customMenu}
          onOpenMenu={() => setSidebarOpen(true)}
        />

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Stadistics />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/usuarios" element={<Users />} />
                <Route path="/eventos" element={<Events />} />
                <Route path="/participantes" element={<Participants />} />

                <Route path="*" element={<Navigate replace to="/404" />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
};

export default Platform;
