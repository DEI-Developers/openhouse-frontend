import apiInstance from '@utils/instances/ApiInstance';

const restorePermission = async (id) => {
  const response = await apiInstance.patch(`/permissions/${id}/restore`);
  return response.data;
};

export default restorePermission;