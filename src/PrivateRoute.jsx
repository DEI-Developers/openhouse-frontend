import {useAuth} from '@context/AuthContext';
import {Navigate, Outlet} from 'react-router-dom';

const PrivateRoute = () => {
  const {isAuthenticated, loading} = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/iniciar-sesion" />;
  return <Outlet />;
};

export default PrivateRoute;
