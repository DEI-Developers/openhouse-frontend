import React, {Suspense} from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import {Stadistics, Roles, Users, Events, Participants} from './dashboard';

const Dashboard = () => {
  return (
    <div>
      <div className="flex">
        <div className="w-60">
          <p>Menu</p>
          <ul>
            <li>
              <Link to="roles">Roles</Link>
            </li>
            <li>
              <Link to="usuarios">Usuarios</Link>
            </li>
            <li>
              <Link to="eventos">Eventos</Link>
            </li>
            <li>
              <Link to="participantes">Participantes</Link>
            </li>
          </ul>
        </div>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route exact path="/" element={<Stadistics />} />
              <Route exact path="/roles" element={<Roles />} />
              <Route exact path="/usuarios" element={<Users />} />
              <Route exact path="/eventos" element={<Events />} />
              <Route exact path="/participantes" element={<Participants />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
