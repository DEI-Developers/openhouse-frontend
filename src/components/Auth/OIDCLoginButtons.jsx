import { useState, useEffect } from 'react';
import getOIDCProviders from '@services/Auth/getOIDCProviders';
import oidcLogin from '@services/Auth/oidcLogin';
import CustomButton from '@components/UI/Form/CustomButton';
import { FaGoogle, FaMicrosoft, FaGithub } from 'react-icons/fa';

const OIDCLoginButtons = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await getOIDCProviders();
        if (response.success) {
          // Filtrar solo los proveedores configurados
          const configuredProviders = (response.data.providers || []).filter(provider => provider.configured === true);
          setProviders(configuredProviders);
        } else {
          setError('Error al cargar proveedores OIDC');
        }
      } catch (err) {
        setError('Error al conectar con el servidor');
        console.error('Error fetching OIDC providers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleOIDCLogin = async (providerId) => {
    try {
      await oidcLogin(providerId);
    } catch (error) {
      console.error('Error en login OIDC:', error);
      setError('Error al iniciar sesión con ' + getProviderName(providerId));
    }
  };

  const getProviderIcon = (providerId) => {
    const iconProps = { className: "w-5 h-5" };
    const icons = {
      google: <FaGoogle {...iconProps} className="w-5 h-5 text-red-500" />,
      microsoft: <FaMicrosoft {...iconProps} className="w-5 h-5 text-blue-500" />,
      github: <FaGithub {...iconProps} className="w-5 h-5 text-gray-800" />
    };
    return icons[providerId] || <FaGoogle {...iconProps} className="w-5 h-5 text-gray-500" />;
  };

  const getProviderName = (providerId) => {
    if (!providerId || typeof providerId !== 'string') {
      return 'Proveedor desconocido';
    }
    const names = {
      google: 'Google',
      microsoft: 'Microsoft',
      github: 'GitHub'
    };
    return names[providerId] || providerId.charAt(0).toUpperCase() + providerId.slice(1);
  };

  if (loading) {
    return (
      <div className="w-full space-y-2">
        <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (error || providers.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">O continúa con</span>
        </div>
      </div>
      
      <div className="space-y-2">
        {providers.map((provider) => (
          <CustomButton
            key={provider.name || provider.id}
            onClick={() => handleOIDCLogin(provider.name || provider.id)}
            className="w-full flex justify-center items-center bg-white border border-gray-300 text-gray-700 text-sm font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
            loading={false}
            label={
              <span className="flex items-center gap-2">
                {getProviderIcon(provider.name || provider.id)}
                Continuar con {getProviderName(provider.displayName || provider.name || provider.id)}
              </span>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default OIDCLoginButtons;