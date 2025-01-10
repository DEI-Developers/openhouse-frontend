import apiInstance from '@utils/instances/ApiInstance';

const createRole = async (formData) => {
  const response = await apiInstance.post('/roles', formData);

  return response.data;
};

export default createRole;
