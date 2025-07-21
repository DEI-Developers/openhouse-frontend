import React, {useState} from 'react';
import {empty} from '@utils/helpers';
import CustomModal from '@components/UI/Modal/CustomModal';

const ParticipantInscriptions = ({data}) => {
  const subscribedTo = data?.subscribedTo ?? [];
  const [showAllModal, setShowAllModal] = useState(false);

  if (subscribedTo.length === 0) {
    return <div className="text-gray-500 text-sm">Sin inscripciones</div>;
  }

  const firstItem = subscribedTo[0];
  const additionalCount = subscribedTo.length - 1;

  const renderAccompanimentBadges = (item) => {
    const withParent = item.withParent;
    const parentStudiedAtUCA = item.parentStudiedAtUCA;
    const attended = item.attended;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {/* Badge de asistencia */}
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            attended
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {attended ? 'Asistió' : 'No asistió'}
        </span>

        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            withParent
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {withParent ? 'Con acompañante' : 'Sin acompañante'}
        </span>

        {withParent && (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              parentStudiedAtUCA
                ? 'bg-blue-100 text-blue-800'
                : 'bg-orange-100 text-orange-800'
            }`}
          >
            {parentStudiedAtUCA
              ? 'Familiar estudió en UCA'
              : 'Familiar no estudió en UCA'}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-2">
        <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
          <div className="flex flex-col gap-1">
            <h4 className="font-semibold text-gray-900 text-sm">
              {firstItem.faculty?.name ?? 'N/A'}
            </h4>
            <p className="text-xs text-gray-500 font-medium">
              Evento:{' '}
              {new Date(firstItem.event?.date).toLocaleDateString('es-SV', {
                timeZone: 'UTC',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            {!empty(firstItem.career) && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {firstItem.career?.name}
                </span>
              </div>
            )}
            {renderAccompanimentBadges(firstItem)}
          </div>
        </div>

        {additionalCount > 0 && (
          <button
            onClick={() => setShowAllModal(true)}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
          >
            +{additionalCount} más
          </button>
        )}
      </div>

      {showAllModal && (
        <CustomModal
          isOpen={showAllModal}
          onToggleModal={() => setShowAllModal(false)}
          className="p-6 w-full sm:max-w-4xl"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Todas las inscripciones de {data.name}
            </h3>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {subscribedTo.map((item, index) => (
              <div
                key={index + new Date().getTime()}
                className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500"
              >
                <div className="flex flex-col gap-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {item.faculty?.name ?? 'N/A'}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Evento:{' '}
                    {new Date(item.event?.date).toLocaleDateString('es-SV', {
                      timeZone: 'UTC',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  {!empty(item.career) && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.career?.name}
                      </span>
                    </div>
                  )}
                  {renderAccompanimentBadges(item)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowAllModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>
        </CustomModal>
      )}
    </>
  );
};

export default ParticipantInscriptions;