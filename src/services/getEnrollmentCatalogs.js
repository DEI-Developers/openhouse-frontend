import apiInstance from "@utils/instances/ApiInstance";

const getEnrollmentCatalogs = async (id) => {
  const response = await apiInstance.get(
    `/target-audiences/${id}/enrollment-form`
  );

  return response?.data?.data;
};

export default getEnrollmentCatalogs;