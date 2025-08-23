import getLoggedUser from '@services/Auth/getLoggedUser';
import {createContext, useState, useContext, useEffect} from 'react';

const initialData = {
  user: null,
  token: null,
  menu: [],
  permissions: [],
  isAuthenticated: false,
  authMethod: null, // 'local' | 'oidc'
  oidcProviders: [], // Array de proveedores OIDC del usuario
};

const AuthContext = createContext({
  authState: initialData,
  loading: true,
  onLogin: (user) => {},
  onLogout: () => {},
  onOIDCLogin: (userData) => {},
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
              authMethod: response.data.user?.authMethod || 'local',
              oidcProviders: response.data.user?.oidcProviders || [],
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
      authMethod: appState.user?.authMethod || 'local',
      oidcProviders: appState.user?.oidcProviders || [],
    });
  };

  const onOIDCLogin = (userData) => {
    localStorage.setItem('appToken', userData.token);
    setAuthState({
      user: userData.user,
      menu: userData.menu,
      token: userData.token,
      permissions: userData.permissions,
      isAuthenticated: true,
      authMethod: 'oidc',
      oidcProviders: userData.user?.oidcProviders || [],
    });
  };

  const onLogout = () => {
    localStorage.removeItem('appToken');
    setAuthState(initialData);
  };

  return (
    <AuthContext.Provider value={{authState, loading, onLogin, onLogout, onOIDCLogin}}>
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
    authMethod: context.authState.authMethod,
    oidcProviders: context.authState.oidcProviders,
  };
};
