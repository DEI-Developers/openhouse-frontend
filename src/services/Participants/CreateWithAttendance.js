import apiInstance from '@utils/instances/ApiInstance';

const createParticipantWithAttendance = async (formData) => {
  try {
    const response = await apiInstance.post(
      '/participants/admin/create-with-attendance',
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

export default createParticipantWithAttendance;