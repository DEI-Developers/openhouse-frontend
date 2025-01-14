import getLoggedUser from '@services/Auth/getLoggedUser';
import {createContext, useState, useContext, useEffect} from 'react';

const initialData = {
  user: null,
  token: null,
  menu: [],
  permissions: [],
  isAuthenticated: false,
};

const AuthContext = createContext({
  authState: initialData,
  loading: true,
  onLogin: (user) => {},
  onLogout: () => {},
});

export const AuthProvider = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState(initialData);

  useEffect(() => {
    const token = localStorage.getItem('appToken');

    if (token) {
      getLoggedUser()
        .then((response) => {
          if (response.success) {
            setAuthState({
              user: response.data.user,
              menu: response.data.menu,
              token: token,
              permissions: response.data.permissions,
              isAuthenticated: true,
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const onLogin = (appState) => {
    localStorage.setItem('appToken', appState.token);
    setAuthState({
      user: appState.user,
      menu: appState.menu,
      token: appState.token,
      permissions: appState.permissions,
      isAuthenticated: true,
    });
  };

  const onLogout = () => {
    localStorage.removeItem('appToken');
    setAuthState(initialData);
  };

  return (
    <AuthContext.Provider value={{authState, loading, onLogin, onLogout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    ...context,
    loading: context.loading,
    user: context.authState.user,
    menu: context.authState.menu,
    token: context.authState.token,
    isAuthenticated: context.authState.isAuthenticated,
    permissions: context.authState.permissions,
  };
};
