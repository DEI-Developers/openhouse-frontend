import apiInstance from "@utils/instances/ApiInstance";

const restoreTargetAudience = async (id) => {
  const response = await apiInstance.post(`/target-audiences/${id}/restore`);
  return response.data;
};

export default restoreTargetAudience;