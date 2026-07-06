import apiInstance from '@utils/instances/ApiInstance'

const getPublicEvent = async (eventId) => {
  const response = await apiInstance.get(`/events/public/${eventId}`)
  return response?.data?.data
}

export default getPublicEvent
