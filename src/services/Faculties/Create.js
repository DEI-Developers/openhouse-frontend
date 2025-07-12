import apiInstance from '@utils/instances/ApiInstance';

const createFaculty = async (data) => {
  const response = await apiInstance.post('/faculties', data);
  return response.data;
};

export default createFaculty;