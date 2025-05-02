import apiInstance from '@utils/instances/ApiInstance';

const forgotPassword = async (formData) => {
  try {
    const response = await apiInstance.post('/forgot-password', formData);
    return {
      success: true,
      data: {
        ...response.data.data,
      },
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};

export default forgotPassword;
