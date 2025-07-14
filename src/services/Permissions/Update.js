import apiInstance from '@utils/instances/ApiInstance';

const updatePermission = async (data) => {
  const response = await apiInstance.put(`/permissions/${data.id}`, data);
  return response.data;
};

export default updatePermission;