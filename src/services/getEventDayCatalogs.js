import apiInstance from "@utils/instances/ApiInstance";

const getEventDayCatalogs = async (id) => {
  const response = await apiInstance.get(`/target-audiences/${id}/event-day-form`);
  return response?.data?.data;
};

export default getEventDayCatalogs;
