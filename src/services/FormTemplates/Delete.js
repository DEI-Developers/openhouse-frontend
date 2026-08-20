import apiInstance from '@utils/instances/ApiInstance';

const deleteFormTemplate = async (id) => {
  const response = await apiInstance.delete(`/form-templates/${id}`);

  return {
    success: true,
    message: response.data.message,
  };
};

export default deleteFormTemplate;
