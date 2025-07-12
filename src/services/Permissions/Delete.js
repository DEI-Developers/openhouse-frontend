import apiInstance from '@utils/instances/ApiInstance';

const deletePermission = async (id) => {
  const response = await apiInstance.delete(`/permissions/${id}`);
  return response.data;
};

export default deletePermission;