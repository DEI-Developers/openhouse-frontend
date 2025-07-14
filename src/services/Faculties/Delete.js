import apiInstance from '@utils/instances/ApiInstance';

const deleteFaculty = async (id) => {
  const response = await apiInstance.delete(`/faculties/${id}`);
  return response.data;
};

export default deleteFaculty;