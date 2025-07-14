import apiInstance from '@utils/instances/ApiInstance';

const deleteCareer = async (id) => {
  const response = await apiInstance.delete(`/carrers/${id}`);
  return response.data;
};

export default deleteCareer;