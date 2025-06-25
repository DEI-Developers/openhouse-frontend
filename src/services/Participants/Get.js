import {empty, parseUrlParams} from '@utils/helpers';
import apiInstance from '@utils/instances/ApiInstance';
import Permissions from '@utils/Permissions';

const getParticipants = async (
  pageNumber,
  pageSize,
  searchedWord,
  filters = {},
  permissions = []
) => {
  console.log(permissions);
  const isAdmin = permissions.includes(Permissions.MANAGE_PARTICIPANTS);
  console.log(isAdmin);
  const params = {
    pageNumber,
    pageSize,
    sortColumn: 'createdAt',
    sortOrder: 'desc',
    searchWord: !empty(searchedWord) ? searchedWord : undefined,
    ...filters,
  };

  const queryParams = parseUrlParams(params, []);
  const response = await apiInstance.get(`/participants?${queryParams}`);

  return {
    rows: response.data.data.map((participant) => {
      const {email, phoneNumber, ...restParticipant} = participant;
      console.log(participant);
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

export default getParticipants;
