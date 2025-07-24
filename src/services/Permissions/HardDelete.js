import apiInstance from '@utils/instances/ApiInstance';

const hardDeletePermission = async (id) => {
  const response = await apiInstance.delete(`/permissions/${id}/hard?confirm=true`);
  return response.data;
};

export default hardDeletePermission;