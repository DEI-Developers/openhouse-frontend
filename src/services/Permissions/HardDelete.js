import apiInstance from '@utils/instances/ApiInstance';

const hardDeletePermission = async (id) => {
  const response = await apiInstance.delete(`/permissions/${id}/hard`);
  return response.data;
};

export default hardDeletePermission;