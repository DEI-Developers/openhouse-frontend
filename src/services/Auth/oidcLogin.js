import apiInstance from '@utils/instances/ApiInstance';

/**
 * Inicia el proceso de autenticación OIDC con un proveedor específico
 * @param {string} provider - Nombre del proveedor (google, microsoft, github)
 * @returns {Promise<void>} Redirige al endpoint de autenticación del proveedor
 */
const oidcLogin = async (provider) => {
  if (!provider) {
    throw new Error('Provider es requerido para la autenticación OIDC');
  }

  try {
    // Guardar el estado actual para poder regresar después del login
    const currentPath = window.location.pathname;
    localStorage.setItem('oidc_return_path', currentPath);
    
    // Obtener la URL de autorización del backend
    const response = await apiInstance.get(`/oidc/${provider}`);
    
    if (response.data.success && response.data.data.authUrl) {
      // Redirigir a la URL de autorización del proveedor
      window.location.href = response.data.data.authUrl;
    } else {
      throw new Error('No se pudo obtener la URL de autorización');
    }
  } catch (error) {
    console.error('Error al iniciar autenticación OIDC:', error);
    throw new Error('Error al iniciar el proceso de autenticación OIDC');
  }
};

export default oidcLogin;
