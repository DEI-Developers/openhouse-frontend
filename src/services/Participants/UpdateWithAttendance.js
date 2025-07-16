import apiInstance from '@utils/instances/ApiInstance';

const updateParticipantWithAttendance = async (formData) => {
  try {
    const response = await apiInstance.put(
      `/participants/admin/update-with-attendance/${formData.id}`,
      Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          // Convert any "true"/"false" strings to actual booleans
          value === 'true' ? true : value === 'false' ? false : value,
        ])
      )
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default updateParticipantWithAttendance;
