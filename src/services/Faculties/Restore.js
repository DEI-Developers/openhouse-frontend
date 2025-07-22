import apiInstance from '@utils/instances/ApiInstance';

const restoreFaculty = async (id) => {
  const response = await apiInstance.patch(`/faculties/${id}/restore`);
  return response.data;
};

export default restoreFaculty;