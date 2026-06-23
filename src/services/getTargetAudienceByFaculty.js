import apiInstance from "@utils/instances/ApiInstance";

const getTargetAudienceByFaculty = async (facultyId) => {
  const response = await apiInstance.get(
    `/target-audiences/by-faculty/${facultyId}`
  );

  return response?.data?.data;
};

export default getTargetAudienceByFaculty;
