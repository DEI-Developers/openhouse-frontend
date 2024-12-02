import {Routes, Route} from 'react-router-dom';
import {
  Home,
  Login,
  NotFound,
  Dashboard,
  ResetPassword,
  ForgotPassword,
} from './pages';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/iniciar-sesion" element={<Login />} />
      <Route path="/restablecer-contraseña" element={<ResetPassword />} />
      <Route path="/recuperar-contraseña" element={<ForgotPassword />} />

      <Route path="/plataforma/*" element={<Dashboard />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
