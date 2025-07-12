import apiInstance from '@utils/instances/ApiInstance';

const createCareer = async (data) => {
  const response = await apiInstance.post('/carrers', data);
  return response.data;
};

export default createCareer;