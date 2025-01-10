import apiInstance from '@utils/instances/ApiInstance';

const getCatalogs = async () => {
  const response = await apiInstance.get(`/catalogs?`);

  return response?.data?.data;
};

export default getCatalogs;
