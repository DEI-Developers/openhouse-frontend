import apiInstance from '@utils/instances/ApiInstance';

const deleteEvent = async (id) => {
  const response = await apiInstance.delete(`/events/${id}`);

  return response.data;
};

export default deleteEvent;
