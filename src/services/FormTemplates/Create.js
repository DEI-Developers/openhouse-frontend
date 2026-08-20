import apiInstance from '@utils/instances/ApiInstance';

const createFormTemplate = async (formData) => {
  // Defensive: remove any invalid id fields before creating
  const {id, ...cleanData} = formData;
  const response = await apiInstance.post('/form-templates', cleanData);

  return {
    success: true,
    data: response.data.data,
  };
};

export default createFormTemplate;
