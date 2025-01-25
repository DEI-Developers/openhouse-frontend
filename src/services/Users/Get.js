import {empty, parseUrlParams} from '@utils/helpers';
import apiInstance from '@utils/instances/ApiInstance';
// import users from '../../../dummy_data/usuarios.json';

// const getUsers = (page, rowsPerPage, filter) => {
//   console.log('Proccess', import.meta.env.VITE_BASE_URL);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const response = {
//         rows: users,
//         nRows: 100,
//         nPages: 10,
//         currentPage: 1,
//       };
//       resolve(response);
//       // reject(new Error("Error fetching users"));
//     }, 3000);
//   });
// };

const getUsers = async (pageNumber, pageSize, searchedWord) => {
  const params = {
    pageNumber,
    pageSize,
    sortColumn: 'createdAt',
    sortOrder: 'desc',
    search: !empty(searchedWord) ? searchedWord : undefined,
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
