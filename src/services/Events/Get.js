import {empty, parseUrlParams} from '@utils/helpers';
import apiInstance from '@utils/instances/ApiInstance';
import {format, formatDate, parseISO} from 'date-fns';

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
      careerLabels: event?.careers ?? [],
      careers: event?.careers?.map((career) => career.value),
      id: event._id,
    })),
    nRows: response.data.nItems,
    nPages: response.data.nPages,
    currentPage: response.data.currentPage,
  };
};

export default getEvents;
