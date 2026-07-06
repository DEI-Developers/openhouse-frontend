import apiInstance from '@utils/instances/ApiInstance'

const checkEnrollment = async (phoneNumber, eventId) => {
  const response = await apiInstance.get(
    `/participants/check/${phoneNumber}/${eventId}`
  )
  return response?.data
}

export default checkEnrollment
