import {empty, parseUrlParams} from '@utils/helpers';
import apiInstance from '@utils/instances/ApiInstance';
import Permissions from '@utils/Permissions';

const getParticipantsWithAdvancedFilter = async (
  permissions,
  filters = {},
  operator = 'AND',
  pageNumber = 1,
  pageSize = 10,
  sortColumn = 'createdAt',
  sortOrder = 'desc'
) => {
  const isAdmin = permissions.includes(Permissions.VIEW_ALL_PARTICIPANTS);
  
  const params = {
    pageNumber,
    pageSize,
    sortColumn,
    sortOrder,
    operator,
    ...filters,
  };

  const queryParams = parseUrlParams(params, []);
  const response = await apiInstance.get(`/participants/advanced-filter?${queryParams}`);

  return {
    rows: response.data.data.map((participant) => {
      const {email, phoneNumber, ...restParticipant} = participant;
      return {
        ...(isAdmin ? participant : restParticipant),
        networks: {value: participant.networks, label: participant.networks},
        networksLabel: participant.networks,
        id: participant._id,
      };
    }),
    nRows: response.data.nItems,
    nPages: response.data.nPages,
    currentPage: response.data.currentPage,
  };
};

export default getParticipantsWithAdvancedFilter;