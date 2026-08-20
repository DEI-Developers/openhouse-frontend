import apiInstance from '@utils/instances/ApiInstance';

const toggleFormTemplateActive = async ({id, isActive}) => {
  const response = await apiInstance.patch(`/form-templates/${id}/toggle`, {isActive});

  return {
    success: true,
    data: response.data.data,
  };
};

export default toggleFormTemplateActive;
