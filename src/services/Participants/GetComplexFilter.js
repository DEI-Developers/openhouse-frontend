import apiInstance from '@utils/instances/ApiInstance';
import Permissions from '@utils/Permissions';

const getParticipantsWithComplexFilter = async (
  permissions,
  filterGroups = [],
  globalOperator = 'AND',
  pageNumber = 1,
  pageSize = 10,
  sortColumn = 'createdAt',
  sortOrder = 'desc'
) => {
  const isAdmin = permissions.includes(Permissions.VIEW_ALL_PARTICIPANTS);
  
  const params = new URLSearchParams({
    globalOperator,
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
    sortColumn,
    sortOrder,
  });

  const response = await apiInstance.post(
    `/participants/complex-filter?${params.toString()}`,
    { filterGroups }
  );

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

export default getParticipantsWithComplexFilter;