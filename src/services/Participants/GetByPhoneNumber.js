import {empty} from '@utils/helpers';
import apiInstance from '@utils/instances/ApiInstance';

const getParticipantByPhoneNumber = async (phoneNumber) => {
  try {
    const cPhoneNumber = phoneNumber
      .replaceAll(/ /g, '')
      .replaceAll('+', '')
      .replaceAll('-', '');

    const {data} = await apiInstance.get(`/participants/${cPhoneNumber}`);

    if (empty(data?.data)) {
      throw new Error();
    }

    console.log(data);

    return {
      participant: {
        id: data?.data._id,
        name: data?.data.name,
        email: data?.data.email,
        phoneNumber: data?.data.phoneNumber,
        institute: data?.data.institute,
        networks: {
          value: data?.data.networks,
          label: data?.data.networks,
        },
        medio: data?.data.medio,
      },
      subscribedTo: data?.data.subscribedTo?.map((e) => e.event),
    };
  } catch (error) {
    return {
      participant: null,
      subscribedTo: [],
    };
  }
};

export default getParticipantByPhoneNumber;
