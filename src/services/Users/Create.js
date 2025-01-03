import apiInstance from '@utils/instances/ApiInstance';

const createUser = async (formData) => {
  console.log('formData', formData);
  const response = await apiInstance.post('/users', formData);

  return response.data;
};

export default createUser;
