import apiInstance from '@utils/instances/ApiInstance';

const getStadistics = async (eventId) => {
  const response = await apiInstance.get(`/stadistics/${eventId}`);

  return response.data?.data;
};

export default getStadistics;
