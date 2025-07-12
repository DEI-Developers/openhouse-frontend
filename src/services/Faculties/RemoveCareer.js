const removeCareerFromFaculty = async ({facultyId, careerId}) => {
  const response = await instance.delete(
    `/faculties/${facultyId}/careers/${careerId}`
  );
  return response.data;
};

export default removeCareerFromFaculty;
