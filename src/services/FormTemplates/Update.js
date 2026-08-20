import apiInstance from '@utils/instances/ApiInstance';

const updateFormTemplate = async ({id, ...formData}) => {
  const response = await apiInstance.put(`/form-templates/${id}`, formData);

  return {
    success: true,
    data: response.data.data,
  };
};

export default updateFormTemplate;
