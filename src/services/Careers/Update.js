import apiInstance from '@utils/instances/ApiInstance';

const updateCareer = async (data) => {
  const { id, ...updateData } = data;
  const response = await apiInstance.put(`/carrers/${id}`, updateData);
  return response.data;
};

export default updateCareer;