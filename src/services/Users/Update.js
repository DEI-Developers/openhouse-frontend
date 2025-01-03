import apiInstance from '@utils/instances/ApiInstance';

const updateUser = async (formData) => {
  const response = await apiInstance.put(`/users/${formData.id}`, formData);

  return response.data;
};

export default updateUser;
