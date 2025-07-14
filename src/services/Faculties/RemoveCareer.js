import apiInstance from '@utils/instances/ApiInstance';

const removeCareerFromFaculty = async ({facultyId, careerId}) => {
  const response = await apiInstance.delete(
    `/faculties/${facultyId}/careers/${careerId}`
  );
  return response.data;
};

export default removeCareerFromFaculty;
