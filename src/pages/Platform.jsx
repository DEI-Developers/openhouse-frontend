import {Suspense, useState} from 'react';
import {useAuth} from '@context/AuthContext';
import {Navigate, Route, Routes} from 'react-router-dom';
import MobileNavbar from '@components/UI/Sidebar/MobileNavbar';
import MobileSidebar from '@components/UI/Sidebar/MobileSidebar';
import DesktopSidebar from '@components/UI/Sidebar/DesktopSidebar';
import {Stadistics, Roles, Users, Events, Participants} from './dashboard';

const Platform = () => {
  const {menu, user, onLogout} = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const flatMenu = flattenMenu(menu);

  return (
    <>
      <div>
        <DesktopSidebar menu={menu} user={user} onLogout={onLogout} />

        <MobileSidebar
          menu={menu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <MobileNavbar
          customMenu={menu}
          onOpenMenu={() => setSidebarOpen(true)}
        />

        <main className="py-10 lg:pl-72 bg-background min-h-screen">
          <div className="px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                {flatMenu.includes('Inicio') && (
                  <Route path="/" element={<Stadistics />} />
                )}
                {flatMenu.includes('Roles') && (
                  <Route path="/roles" element={<Roles />} />
                )}
                {flatMenu.includes('Usuarios') && (
                  <Route path="/usuarios" element={<Users />} />
                )}
                {flatMenu.includes('Eventos') && (
                  <Route path="/eventos" element={<Events />} />
                )}
                {flatMenu.includes('Participantes') && (
                  <Route path="/participantes" element={<Participants />} />
                )}
                <Route path="*" element={<Navigate replace to="/404" />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
};

const flattenMenu = (menuObj) => {
  return Object.values(menuObj)
    .flat()
    .map((item) => item.name);
};

export default Platform;
