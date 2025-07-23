import apiInstance from '@utils/instances/ApiInstance';

const hardDeleteCareer = async (id) => {
  const response = await apiInstance.delete(`/carrers/${id}/hard`);
  return response.data;
};

export default hardDeleteCareer;