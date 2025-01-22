import {formatDate} from 'date-fns';

const Event = ({event, isSubscribed, onClick}) => {
  return (
    <div className="px-4 py-2 border rounded-md shadow-md flex flex-col items-center w-96">
      <h1 className="font-bold italic text-lg text-primary">{event.name}</h1>
      <p className="text-gray-600 py-1">
        Fecha inicio:{' '}
        <span className="font-bold">
          {formatDate(new Date(event.startDate), 'dd/MM/yyyy')}
        </span>
      </p>
      <p className="text-gray-600 py-1">
        Fecha fin:{' '}
        <span className="font-bold">
          {formatDate(new Date(event.endDate), 'dd/MM/yyyy')}
        </span>
      </p>

      <CustomButton
        isFull={event.isFull}
        isSubscribed={isSubscribed}
        onClick={onClick}
      />
    </div>
  );
};

const CustomButton = ({isFull, isSubscribed, onClick}) => {
  if (isSubscribed) {
    return (
      <p className="bg-primary w-60 text-white p-2 rounded-md text-center opacity-90 cursor-not-allowed">
        Ya estás inscrito
      </p>
    );
  }

  if (isFull) {
    return (
      <p className="bg-primary w-60 text-white p-2 rounded-md text-center opacity-70 cursor-not-allowed">
        Evento lleno
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-primary w-60 text-primary p-2 rounded-md"
    >
      Asistiré
    </button>
  );
};

export default Event;
