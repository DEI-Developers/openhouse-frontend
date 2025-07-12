import apiInstance from '@utils/instances/ApiInstance';

const createPermission = async (data) => {
  const response = await apiInstance.post('/permissions', data);
  return response.data;
};

export default createPermission;