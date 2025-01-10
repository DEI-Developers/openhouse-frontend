import apiInstance from '@utils/instances/ApiInstance';

const deleteRole = async (id) => {
  const response = await apiInstance.delete(`/roles/${id}`);

  return response.data;
};

export default deleteRole;
