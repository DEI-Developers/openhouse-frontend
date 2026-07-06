// @ts-nocheck
import {useParams} from 'react-router-dom'
import {useQuery} from '@tanstack/react-query'
import {BASE_PATH_URL} from '@config/index'
import EventDayParticipationForm from '@components/Home/EventDayParticipationForm'
import getPublicEvent from '@services/Events/getPublicEvent'

const EventDayRegistration = () => {
  const {id: eventId} = useParams()

  const {data: event, isLoading, isError} = useQuery({
    queryKey: ['publicEvent', eventId],
    queryFn: () => getPublicEvent(eventId),
    enabled: !!eventId,
    refetchOnWindowFocus: false,
  })

  // Determinar estado del día del evento usando fecha original
  const eventStatus = (() => {
    if (!event?.date) return 'loading'

    const today = new Date()
    const eventDate = new Date(event.date)

    // Comparar solo fecha (sin hora)
    const todayStr = today.toISOString().split('T')[0]
    const eventDateStr = eventDate.toISOString().split('T')[0]

    if (eventDateStr < todayStr) return 'past'
    if (eventDateStr > todayStr) return 'future'
    return 'today'
  })()

  if (isLoading || eventStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <img
          src={`${BASE_PATH_URL}/uca-header.webp`}
          className="w-full"
          alt="UCA"
        />
        <div className="flex-1 flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <img
          src={`${BASE_PATH_URL}/uca-header.webp`}
          className="w-full"
          alt="UCA"
        />
        <div className="flex-1 flex justify-center items-center px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
            <div className="text-5xl mb-4">📅</div>
            <h1 className="font-bold text-xl text-gray-800 mb-2">
              Evento no disponible
            </h1>
            <p className="text-gray-500">
              No se encontró el evento. Verificá el enlace o contactá a los
              organizadores.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (eventStatus === 'future') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <img
          src={`${BASE_PATH_URL}/uca-header.webp`}
          className="w-full"
          alt="UCA"
        />
        <div className="flex-1 flex justify-center items-center px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
            <div className="text-5xl mb-4">⏳</div>
            <h1 className="font-bold text-xl text-gray-800 mb-2">
              Aún no está disponible
            </h1>
            <p className="text-gray-500">
              El formulario de registro estará disponible únicamente el día del
              evento. ¡Te esperamos!
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (eventStatus === 'past') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <img
          src={`${BASE_PATH_URL}/uca-header.webp`}
          className="w-full"
          alt="UCA"
        />
        <div className="flex-1 flex justify-center items-center px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="font-bold text-xl text-gray-800 mb-2">
              Evento finalizado
            </h1>
            <p className="text-gray-500">
              El registro del día del evento ya cerró. ¡Gracias por participar!
            </p>
          </div>
        </div>
      </div>
    )
  }

  // eventStatus === 'today': mostrar formulario
  return (
    <div className="min-h-screen bg-gray-50">
      <img
        src={`${BASE_PATH_URL}/uca-header.webp`}
        className="w-full"
        alt="UCA"
      />
      <EventDayParticipationForm event={event} />
    </div>
  )
}

export default EventDayRegistration
