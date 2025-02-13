import {empty} from '@utils/helpers';
import apiInstance from '@utils/instances/ApiInstance';

const getStadistics = async (eventId) => {
  if (empty(eventId)) {
    return [];
  }

  const response = await apiInstance.get(`/stadistics/${eventId}`);

  return response.data?.data;
};

export default getStadistics;
