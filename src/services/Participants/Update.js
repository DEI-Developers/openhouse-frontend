import apiInstance from '@utils/instances/ApiInstance';

const updateParticipant = async (formData) => {
  const response = await apiInstance.put(
    `/participants/${formData.id}`,
    formData
  );

  return response.data;
};

export default updateParticipant;
