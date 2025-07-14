import {empty, parseUrlParams} from '@utils/helpers';
import apiInstance from '@utils/instances/ApiInstance';

const getUsers = async (pageNumber, pageSize, searchedWord, filters = null) => {
  const params = {
    pageNumber,
    pageSize,
    sortColumn: 'createdAt',
    sortOrder: 'desc',
    searchWord: !empty(searchedWord) ? searchedWord : undefined,
  };

  const queryParams = parseUrlParams(params, []);
  const response = await apiInstance.get(`/users?${queryParams}`);

  return {
    rows: response.data.data.map((user) => ({
      ...user,
      id: user._id,
      role: {
        label: user.roleName,
        value: user.roleId,
      },
      faculty: {
        label: user?.facultyName,
        value: user?.facultyId,
      },
      career: user.careerId
        ? {
            label: user?.careerName,
            value: user?.careerId,
          }
        : null,
    })),
    nRows: response.data.nItems,
    nPages: response.data.nPages,
    currentPage: response.data.currentPage,
  };
};

export default getUsers;
