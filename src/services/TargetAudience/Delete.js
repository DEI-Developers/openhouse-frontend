import apiInstance from "@utils/instances/ApiInstance";

const deleteTargetAudience = async (id) => {
  const response = await apiInstance.delete(`/target-audiences/${id}/soft`);
  return response.data;
};

export default deleteTargetAudience;