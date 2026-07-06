import apiInstance from '@utils/instances/ApiInstance'

const createEventDayRegistration = async (formData) => {
  const payload = {
    ...formData,
    subscribedTo: formData.subscribedTo ?? [],
    // Normalizar booleans
    withParent:
      formData.withParent === true ||
      formData.withParent === 'true',
    parentStudiedAtUCA:
      formData.parentStudiedAtUCA === true ||
      formData.parentStudiedAtUCA === 'true',
  }

  const response = await apiInstance.post(
    '/participants/public/event-day',
    payload
  )
  return response.data
}

export default createEventDayRegistration
