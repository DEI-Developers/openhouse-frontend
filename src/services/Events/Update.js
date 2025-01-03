import apiInstance from '@utils/instances/ApiInstance';

const updateEvent = async (formData) => {
  const response = await apiInstance.put(`/events/${formData.id}`, formData);

  return response.data;
};

export default updateEvent;
