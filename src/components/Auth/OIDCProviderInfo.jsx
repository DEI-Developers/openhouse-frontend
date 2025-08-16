import {useAuth} from '@context/AuthContext';
import { FaGoogle, FaMicrosoft, FaGithub } from 'react-icons/fa';

const OIDCProviderInfo = ({showTitle = true, className = ''}) => {
  const {user, authMethod, oidcProviders} = useAuth();

  // Solo mostrar si el usuario está autenticado con OIDC
  if (authMethod !== 'oidc' || !oidcProviders || oidcProviders.length === 0) {
    return null;
  }

  const getProviderIcon = (providerId) => {
    const iconProps = { className: "w-4 h-4" };
    const icons = {
      google: <FaGoogle {...iconProps} className="w-4 h-4 text-red-500" />,
      microsoft: <FaMicrosoft {...iconProps} className="w-4 h-4 text-blue-500" />,
      github: <FaGithub {...iconProps} className="w-4 h-4 text-gray-800" />
    };
    return icons[providerId] || <FaGoogle {...iconProps} className="w-4 h-4 text-gray-500" />;
  };

  const getProviderName = (providerId) => {
    const names = {
      google: 'Google',
      microsoft: 'Microsoft',
      github: 'GitHub',
    };
    return (
      names[providerId] ||
      providerId.charAt(0).toUpperCase() + providerId.slice(1)
    );
  };

  const getProviderColor = (providerId) => {
    const colors = {
      google: 'bg-red-50 text-red-700 border-red-200',
      microsoft: 'bg-blue-50 text-blue-700 border-blue-200',
      github: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return colors[providerId] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className={`${className}`}>
      {showTitle && (
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Conectado con:
        </h3>
      )}

      <div className="space-y-2">
        {oidcProviders.map((provider, index) => (
          <div
            key={`${provider.id}-${index}`}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${getProviderColor(
              provider.id
            )}`}
          >
            {getProviderIcon(provider.id)}
            <span>{getProviderName(provider.id)}</span>
            {provider.email && (
              <span className="text-gray-500">({provider.email})</span>
            )}
          </div>
        ))}
      </div>

      {user?.avatar && (
        <div className="mt-3 flex items-center gap-2">
          <img
            src={user.avatar}
            alt="Avatar del usuario"
            className="w-8 h-8 rounded-full border border-gray-200"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="text-sm text-gray-600">
            {user.name || user.email}
          </span>
        </div>
      )}
    </div>
  );
};

export default OIDCProviderInfo;
