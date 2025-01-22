import apiInstance from '@utils/instances/ApiInstance';

const getPublicCatalogs = async () => {
  const response = await apiInstance.get(`/catalogs/enrollment-form`);

  return response?.data?.data;
};

export default getPublicCatalogs;
