import apiInstance from '@utils/instances/ApiInstance';

const deleteParticipant = async (id) => {
  const response = await apiInstance.delete(`/participants/${id}`);

  return response.data;
};

export default deleteParticipant;
