import apiInstance from '@utils/instances/ApiInstance';

const createUser = async (formData) => {
  const response = await apiInstance.post('/users', formData);

  return response.data;
};

export default createUser;
