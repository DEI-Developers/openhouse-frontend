import apiInstance from '@utils/instances/ApiInstance';

/**
 * Obtiene la lista de proveedores OIDC disponibles
 * @returns {Promise<Object>} Respuesta con los proveedores disponibles
 */
const getOIDCProviders = async () => {
  try {
    const response = await apiInstance.get('/oidc/providers');
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error('Error al obtener proveedores OIDC:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Error al obtener proveedores OIDC',
      data: [],
    };
  }
};

export default getOIDCProviders;