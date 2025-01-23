import {formatDate} from 'date-fns';

const Event = ({event, isSubscribed, onClick}) => {
  return (
    <div
      className="px-4 py-2 border rounded-md shadow-md flex items-start w-96 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-center py-2 pr-2">
        <CheckIcon
          className="h-9 w-9 flex-shrink-0 cursor-pointer"
          activeColor="#003C71"
          checked={isSubscribed}
        />
      </div>
      <div className="">
        <h1 className="font-bold italic text-lg text-primary">{event.name}</h1>
        {event.isFull ? (
          <p className="text-red-600 italic pb-1">Evento lleno</p>
        ) : (
          <p className="text-green-600 italic pb-1">Cupos disponibles</p>
        )}
        <p className="text-gray-600 pb-1">
          Fecha inicio:{' '}
          <span className="font-bold">
            {formatDate(new Date(event.startDate), 'dd/MM/yyyy')}
          </span>
        </p>
        <p className="text-gray-600 pb-1">
          Fecha fin:{' '}
          <span className="font-bold">
            {formatDate(new Date(event.endDate), 'dd/MM/yyyy')}
          </span>
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
