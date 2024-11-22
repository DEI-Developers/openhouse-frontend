import {Routes, Route} from 'react-router-dom';
import {Home, Login, ResetPassword, ForgotPassword, Dashboard} from './pages';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/iniciar-sesion" element={<Login />} />
      <Route path="/restablecer-contraseña" element={<ResetPassword />} />
      <Route path="/recuperar-contraseña" element={<ForgotPassword />} />

      <Route path="/plataforma/*" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRouter;
