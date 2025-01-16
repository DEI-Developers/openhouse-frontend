import {empty, parseUrlParams} from '@utils/helpers';
import apiInstance from '@utils/instances/ApiInstance';
import { format, formatDate } from 'date-fns';

const getEvents = async (pageNumber, pageSize, searchedWord) => {
  const params = {
    pageNumber,
    pageSize,
    sortColumn: 'createdAt',
    sortOrder: 'desc',
    search: !empty(searchedWord) ? searchedWord : undefined,
  };

  const queryParams = parseUrlParams(params, []);
  const response = await apiInstance.get(`/events?${queryParams}`);

  return {
    rows: response.data.data.map((event) => ({
      ...event,
      startDate: format(new Date(event.startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(event.endDate), 'yyyy-MM-dd'),
      formatStartDate: formatDate(new Date(event.startDate), 'dd/MM/yyyy'),
      formatEndDate: formatDate(new Date(event.endDate), 'dd/MM/yyyy'),
      id: event._id,
    })),
    nRows: response.data.nItems,
    nPages: response.data.nPages,
    currentPage: response.data.currentPage,
  };
};

export default getEvents;
