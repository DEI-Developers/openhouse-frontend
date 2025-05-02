import apiInstance from '@utils/instances/ApiInstance';

const passwordReset = async (formData) => {
  try {
    const response = await apiInstance.post('/password-reset', formData);
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

export default passwordReset;
