// @ts-nocheck
import {useParams} from 'react-router-dom'
import {useQuery} from '@tanstack/react-query'
import {BASE_PATH_URL} from '@config/index'
import EventDayParticipationForm from '@components/Home/EventDayParticipationForm'
import getPublicEvent from '@services/Events/getPublicEvent'

const REGISTER_URL = 'https://vivelauca.uca.edu.sv/'

const PageLayout = ({children}) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <img src={`${BASE_PATH_URL}/uca-header.webp`} className="w-full" alt="UCA" />
    <div className="flex-1 flex justify-center items-center px-4">{children}</div>
  </div>
)

const InfoCard = ({icon, children}) => (
  <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
    <div className="text-5xl mb-4">{icon}</div>
    <h1 className="font-bold text-xl text-gray-800 mb-2">{children}</h1>
  </div>
)

const NotAvailableMessage = () => (
  <InfoCard icon="⏳">
    Para registrarte, ingresá a{' '}
    <a
      href={REGISTER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline"
    >
      {REGISTER_URL}
    </a>
  </InfoCard>
)

const EventDayRegistration = () => {
  const {id: eventId} = useParams()

  const {data: event, isLoading, isError} = useQuery({
    queryKey: ['publicEvent', eventId],
    queryFn: () => getPublicEvent(eventId),
    enabled: !!eventId,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return (
      <PageLayout>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </PageLayout>
    )
  }

  if (isError || !event) {
    return (
      <PageLayout>
        <InfoCard icon="📅">
          Evento no disponible
          <p className="text-gray-500 font-normal text-base mt-2">
            No se encontró el evento. Verificá el enlace o contactá a los
            organizadores.
          </p>
        </InfoCard>
      </PageLayout>
    )
  }

  if (!event.eventDayRegistrationEnabled) {
    return (
      <PageLayout>
        <NotAvailableMessage />
      </PageLayout>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <img src={`${BASE_PATH_URL}/uca-header.webp`} className="w-full" alt="UCA" />
      <EventDayParticipationForm event={event} />
    </div>
  )
}

export default EventDayRegistration