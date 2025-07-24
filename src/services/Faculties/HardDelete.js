import apiInstance from '@utils/instances/ApiInstance';

const hardDeleteFaculty = async (id) => {
  const response = await apiInstance.delete(`/faculties/${id}/hard?confirm=true`);
  return response.data;
};

export default hardDeleteFaculty;