import apiInstance from "@utils/instances/ApiInstance";

const createTargetAudience = async (data) => {
  const response = await apiInstance.post('/target-audiences', data);
  return response.data;
};

export default createTargetAudience;