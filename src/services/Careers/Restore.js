import apiInstance from '@utils/instances/ApiInstance';

const restoreCareer = async (id) => {
  const response = await apiInstance.patch(`/carrers/${id}/restore`);
  return response.data;
};

export default restoreCareer;