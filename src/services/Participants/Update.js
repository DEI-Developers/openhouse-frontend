import apiInstance from '@utils/instances/ApiInstance';

const updateParticipant = async (formData) => {
  const response = await apiInstance.put(
    `/participants/${formData.id}`,
    Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        // Convert any "true"/"false" strings to actual booleans
        value === 'true' ? true : value === 'false' ? false : value,
      ])
    )
  );

  return response.data;
};

export default updateParticipant;
