import {Routes, Route} from 'react-router-dom';
import {Home, Login, Dashboard} from './pages';

const AppRouter = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/iniciar-sesion" element={<Login />} />
      <Route exact path="/plataforma/*" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRouter;
