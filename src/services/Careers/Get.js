import {empty, parseUrlParams} from '@utils/helpers';
import apiInstance from '@utils/instances/ApiInstance';

const getCareers = async (
  pageNumber,
  pageSize,
  searchedWord,
  filters = null,
  includeDeleted = false
) => {
  const params = {
    pageNumber,
    pageSize,
    sortColumn: 'createdAt',
    sortOrder: 'desc',
    searchWord: !empty(searchedWord) ? searchedWord : undefined,
    includeDeleted,
  };

  const queryParams = parseUrlParams(params, []);
  const response = await apiInstance.get(`/carrers?${queryParams}`);

  return {
    rows: response.data.data.map((career) => ({
      ...career,
      id: career._id,
    })),
    nRows: response.data.nItems,
    nPages: response.data.nPages,
    currentPage: response.data.currentPage,
  };
};

export default getCareers;
