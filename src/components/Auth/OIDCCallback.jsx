import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import oidcCallback from '@services/Auth/oidcCallback';

const OIDCCallback = () => {
  const navigate = useNavigate();
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const { onOIDCLogin } = useAuth();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Evitar múltiples ejecuciones
    if (hasProcessed.current) {
      return;
    }

    const handleCallback = async () => {
      try {
        hasProcessed.current = true;
        
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('Processing OIDC callback:', { code: code?.substring(0, 10) + '...', state, error });

        // Verificar si hay errores en la URL
        if (error) {
          setStatus('error');
          setError(errorDescription || `Error de autenticación: ${error}`);
          return;
        }

        // Verificar que tenemos los parámetros necesarios
        if (!code || !state) {
          setStatus('error');
          setError('Parámetros de autenticación faltantes');
          return;
        }

        // Procesar el callback
        console.log('Calling oidcCallback service...');
        const response = await oidcCallback(provider, searchParams);
        console.log('oidcCallback response:', response.success ? 'success' : 'error', response.error);
        
        if (response.success) {
          setStatus('success');
          onOIDCLogin(response.data);
          
          // Redirigir a la ruta guardada o a la plataforma
          const returnUrl = localStorage.getItem('oidc_return_url') || '/plataforma';
          localStorage.removeItem('oidc_return_url');
          
          setTimeout(() => {
            navigate(returnUrl, { replace: true });
          }, 1500);
        } else {
          setStatus('error');
          setError(response.error || 'Error al procesar la autenticación');
        }
      } catch (err) {
        setStatus('error');
        setError('Error de conexión con el servidor');
        console.error('OIDC Callback Error:', err);
      }
    };

    handleCallback();
  }, [provider, searchParams, onOIDCLogin, navigate]);

  const getProviderName = (providerId) => {
    const names = {
      google: 'Google',
      microsoft: 'Microsoft',
      github: 'GitHub'
    };
    return names[providerId] || providerId;
  };

  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Procesando autenticación...</h2>
        <p className="text-gray-600">Completando el inicio de sesión con {getProviderName(provider)}</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h2 className="text-xl font-semibold mb-2">¡Autenticación exitosa!</h2>
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-screen max-w-md mx-auto px-4">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h2 className="text-xl font-semibold mb-2">Error de autenticación</h2>
        <p className="text-gray-600 text-center mb-6">{error}</p>
        <button
          onClick={() => navigate('/iniciar-sesion', { replace: true })}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return null;
};

export default OIDCCallback;