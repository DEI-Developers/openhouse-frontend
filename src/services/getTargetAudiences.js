import apiInstance from "@utils/instances/ApiInstance";

const getTargetAudiences = async () => {
  const response = await apiInstance.get(`/target-audiences`);

  return response?.data?.data;
};

export default getTargetAudiences;
