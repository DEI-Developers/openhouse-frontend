import {useAuth} from '@context/AuthContext';
import {Navigate, Outlet} from 'react-router-dom';

const AuthRoute = () => {
  const {isAuthenticated, loading} = useAuth();

  if (loading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/plataforma" />;
  return <Outlet />;
};

export default AuthRoute;
