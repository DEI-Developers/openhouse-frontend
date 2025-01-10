import apiInstance from '@utils/instances/ApiInstance';

const updateRole = async (formData) => {
  const response = await apiInstance.put(`/roles/${formData.id}`, formData);

  return response.data;
};

export default updateRole;
