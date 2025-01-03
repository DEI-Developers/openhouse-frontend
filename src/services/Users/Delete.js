import apiInstance from '@utils/instances/ApiInstance';

const deleteUser = async (id) => {
  const response = await apiInstance.delete(`/users/${id}`);

  return response.data;
};

export default deleteUser;
