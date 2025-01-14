import apiInstance from '@utils/instances/ApiInstance';

const login = async (formData) => {
  try {
    const response = await apiInstance.post('/login', formData);
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

export default login;
