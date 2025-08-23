import apiInstance from '@utils/instances/ApiInstance';

/**
 * Procesa el callback de autenticación OIDC
 * @param {string} provider - Nombre del proveedor
 * @param {URLSearchParams} searchParams - Parámetros de la URL del callback
 * @returns {Promise<Object>} Respuesta con los datos del usuario autenticado
 */
const oidcCallback = async (provider, searchParams) => {
  try {
    // Extraer parámetros del callback
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Verificar si hay errores en el callback
    if (error) {
      return {
        success: false,
        error: errorDescription || error,
      };
    }

    // Verificar que tenemos el código de autorización
    if (!code) {
      return {
        success: false,
        error: 'Código de autorización no recibido',
      };
    }

    // Construir la URL del callback
    let callbackUrl = `/oidc/${provider}/callback?code=${encodeURIComponent(code)}`;
    
    if (state) {
      callbackUrl += `&state=${encodeURIComponent(state)}`;
    }

    // Realizar la petición al backend
    const response = await apiInstance.get(callbackUrl);
    
    return {
      success: true,
      data: {
        ...response.data.data,
      },
    };
  } catch (error) {
    console.error('Error en callback OIDC:', error);
    return {
      success: false,
      error: error.response?.data?.errors || error.response?.data?.message || 'Error en el proceso de autenticación OIDC',
    };
  }
};

export default oidcCallback;