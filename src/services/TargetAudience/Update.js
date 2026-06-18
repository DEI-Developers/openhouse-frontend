import apiInstance from "@utils/instances/ApiInstance";

const updateTargetAudience = async (data) => {
  const { id, ...updateData } = data;
  const response = await apiInstance.put(`/target-audiences/${id}`, updateData);
  return response.data;
};

export default updateTargetAudience;    