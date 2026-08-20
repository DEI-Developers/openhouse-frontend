import {empty, parseUrlParams} from '@utils/helpers';
import apiInstance from '@utils/instances/ApiInstance';

const getFormTemplates = async (pageNumber, pageSize, searchWord, filters = null) => {
  const includeInactive = filters?.includeInactive ?? false;
  const params = {
    pageNumber,
    pageSize,
    sortColumn: 'createdAt',
    sortOrder: 'desc',
    searchWord: !empty(searchWord) ? searchWord : undefined,
    includeInactive,
  };

  const queryParams = parseUrlParams(params, []);
  const response = await apiInstance.get(`/form-templates?${queryParams}`);

  return {
    rows: response.data.data.map((template) => ({
      ...template,
      id: template._id,
    })),
    nRows: response.data.nItems,
    nPages: response.data.nPages,
    currentPage: response.data.currentPage,
  };
};

export default getFormTemplates;
