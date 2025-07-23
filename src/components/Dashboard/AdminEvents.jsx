import {empty} from '@utils/helpers';
import AdminEvent from './AdminEvent';

const AdminEvents = ({
  events,
  subscribed,
  currentCareer,
  onEnrollment,
  onRefreshEvents,
}) => {

  // Componente del botón de recarga más sutil
  const RefreshButton = () =>
    onRefreshEvents && (
      <button
        type="button"
        onClick={onRefreshEvents}
        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 ml-2 p-1 rounded hover:bg-gray-100"
        title="Recargar eventos"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    );

  if (empty(currentCareer)) {
    return (
      <>
        <div className="flex items-center my-3">
          <p className="italic font-bold">
            De acuerdo a tu selección, estos son los días que podrás vivir la
            experiencia de la UCA. Por favor, escogé el día en que nos
            visitarás.
          </p>
          <RefreshButton />
        </div>
        <div className="border border-gray-200 flex justify-center items-center h-32 rounded-lg">
          <p className="text-sm text-gray-400">
            Selecciona una carrera para poder ver los eventos disponibles.
          </p>
        </div>
      </>
    );
  }

  if (empty(events)) {
    return (
      <>
        <div className="flex items-center my-3">
          <p className="italic font-bold">
            De acuerdo a tu selección, estos son los días que podrás vivir la
            experiencia de la UCA. Por favor, escogé el día en que nos
            visitarás.
          </p>
          <RefreshButton />
        </div>
        <div className="border border-gray-200 flex justify-center items-center h-32 rounded-lg">
          <p className="text-sm text-gray-400">No hay eventos disponibles.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center my-3">
        <p className="italic font-bold">
          De acuerdo a tu selección, estos son los días que podrás vivir la
          experiencia de la UCA. Por favor, escogé el día en que nos visitarás.
        </p>
        <RefreshButton />
      </div>
      <p className="text-sm text-blue-600 italic mb-3">
        <strong>Modo Administrador:</strong> Puedes inscribir participantes aún
        en eventos llenos.
      </p>
      <div className="flex flex-wrap justify-center items-center space-x-4">
        {events.map((event) => (
          <AdminEvent
            key={event.value}
            event={event}
            currentCareer={currentCareer}
            isSubscribed={subscribed.includes(event.value)}
            onClick={() => onEnrollment(event.value)}
          />
        ))}
      </div>
    </>
  );
};

export default AdminEvents;
