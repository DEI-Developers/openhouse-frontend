import apiInstance from '@utils/instances/ApiInstance';

const createParticipant = async (formData) => {
  const response = await apiInstance.post('/participants', formData);

  return response.data;
};

export default createParticipant;
