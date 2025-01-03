import apiInstance from '@utils/instances/ApiInstance';

const createEvent = async (formData) => {
  const response = await apiInstance.post('/events', formData);

  return response.data;
};

export default createEvent;
