import apiInstance from '@utils/instances/ApiInstance';

const getLoggedUser = async () => {
  try {
    const response = await apiInstance.get('/me');
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

export default getLoggedUser;
