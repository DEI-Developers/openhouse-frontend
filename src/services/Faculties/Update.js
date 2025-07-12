import apiInstance from '@utils/instances/ApiInstance';

const updateFaculty = async (data) => {
  const { id, ...updateData } = data;
  const response = await apiInstance.put(`/faculties/${id}`, updateData);
  return response.data;
};

export default updateFaculty;