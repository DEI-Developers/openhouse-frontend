import {empty} from '@utils/helpers';
import Event from './Event';

const Events = ({events, subscribed, currentCareer, onEnrollment}) => {
  if (empty(currentCareer)) {
    return (
      <>
        <p className="my-3 italic font-bold">
          De acuerdo a tu selección, estos son los días que podrás vivir la
          experiencia de la UCA. Por favor, escogé el día en que nos visitarás.
        </p>
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
        <p className="my-3 italic font-bold">
          De acuerdo a tu selección, estos son los días que podrás vivir la
          experiencia de la UCA. Por favor, escogé el día en que nos visitarás.
        </p>
        <div className="border border-gray-200 flex justify-center items-center h-32 rounded-lg">
          <p className="text-sm text-gray-400">No hay eventos disponibles.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="my-3 italic font-bold">
        De acuerdo a tu selección, estos son los días que podrás vivir la
        experiencia de la UCA. Por favor, escogé el día en que nos visitarás.
      </p>
      <div className="flex flex-wrap justify-center items-center space-x-4">
        {events.map((event) => (
          <Event
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

export default Events;
