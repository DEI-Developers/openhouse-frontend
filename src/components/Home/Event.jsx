const Event = ({event, isSubscribed, currentCareer, onClick}) => {
  const carrerNotFound = !event?.careers.includes(currentCareer);
  const disableEvent = event.isFull || carrerNotFound;

  const onVerifyDisponibility = () => {
    if (event.isFull || !event?.careers.includes(currentCareer)) {
      return;
    }
    onClick();
  };
  return (
    <div
      className={`px-4 py-2 border rounded-md shadow-md flex items-start w-96 ${disableEvent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={onVerifyDisponibility}
    >
      <div className="flex justify-center py-2 pr-2">
        <CheckIcon
          className={`h-9 w-9 flex-shrink-0 ${disableEvent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          activeColor="#003C71"
          checked={isSubscribed}
        />
      </div>
      <div>
        <h1 className="font-bold italic text-lg text-primary h-12">
          {event.name}
        </h1>
        {disableEvent ? (
          carrerNotFound ? (
            <p className="text-red-600 italic pb-1 text-wrap mr-10">
              El cupo para esta carrera se ha agotado. Por favor, escogé otra.
            </p>
          ) : (
            <p className="text-red-600 italic pb-1 pt-2">Evento lleno</p>
          )
        ) : (
          <p className="text-green-600 italic pb-1 pt-2">Cupos disponibles</p>
        )}
        <p className="text-gray-600 pb-1">
          Fecha: <span className="font-bold">{event.formatDate}</span>
        </p>
      </div>
    </div>
  );
};

const CheckIcon = ({activeColor, className, checked}) => {
  const circleFill = checked ? activeColor : 'none';
  const circleStroke = checked ? 'none' : '#E6E8EC';

  return (
    <svg viewBox="0 0 25 25" fill="none" className={className}>
      <circle
        cx={12.5}
        cy={12.5}
        r={12}
        fill={circleFill}
        strokeWidth={1.2}
        stroke={circleStroke}
      />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Event;
