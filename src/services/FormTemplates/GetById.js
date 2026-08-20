import apiInstance from '@utils/instances/ApiInstance';

const getFormTemplateById = async (id) => {
  const response = await apiInstance.get(`/form-templates/${id}`);

  return {
    ...response.data.data,
    id: response.data.data._id,
  };
};

export default getFormTemplateById;
