import {empty, parseUrlParams} from '@utils/helpers';
import apiInstance from '@utils/instances/ApiInstance';

const getFaculties = async (
  pageNumber,
  pageSize,
  searchedWord,
  filters = null
) => {
  const params = {
    pageNumber,
    pageSize,
    sortColumn: 'createdAt',
    sortOrder: 'desc',
    searchWord: !empty(searchedWord) ? searchedWord : undefined,
  };

  const queryParams = parseUrlParams(params, []);
  const response = await apiInstance.get(`/faculties?${queryParams}`);

  return {
    rows: response.data.data.map((faculty) => ({
      ...faculty,
      id: faculty._id,
    })),
    nRows: response.data.nItems,
    nPages: response.data.nPages,
    currentPage: response.data.currentPage,
  };
};

export default getFaculties;
