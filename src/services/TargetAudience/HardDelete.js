import apiInstance from '@utils/instances/ApiInstance';

const hardDeleteTargetAudience = async (id) => {
  const response = await apiInstance.delete(`/target-audiences/${id}`);
  return response.data;
};

export default hardDeleteTargetAudience;
