import React, {useState, useEffect} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import {HiOutlineUser, HiOutlineMail, HiOutlinePhone} from 'react-icons/hi';
import {BiEditAlt} from 'react-icons/bi';
import {HiOutlineTrash} from 'react-icons/hi';
import {empty} from '@utils/helpers';
import {
  getParticipants,
  getParticipantsWithAdvancedFilter,
  getParticipantsWithComplexFilter,
} from '@services/Participants';
import AdvancedParticipantsFilters from '@components/UI/Filters/AdvancedParticipantsFilters';
import {useAuth} from '@context/AuthContext';

const ParticipantsCardView = ({customActions, permissions}) => {
  const {permissions: userPermissions} = useAuth();
  const [currentFilters, setCurrentFilters] = useState(null);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  const fetchParticipants = async ({pageParam = 1}) => {
    if (currentFilters) {
      if (currentFilters.type === 'simple') {
        return await getParticipantsWithAdvancedFilter(
          userPermissions,
          currentFilters.filters,
          currentFilters.operator,
          pageParam,
          12 // pageSize para cards
        );
      } else if (currentFilters.type === 'complex') {
        return await getParticipantsWithComplexFilter(
          userPermissions,
          currentFilters.filterGroups,
          currentFilters.globalOperator,
          pageParam,
          12
        );
      }
    }

    return await getParticipants(userPermissions, pageParam, 12, '', {});
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['participants-cards', currentFilters],
    queryFn: fetchParticipants,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.nPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const handleApplyAdvancedFilters = (filters) => {
    setCurrentFilters(filters);
  };

  const handleClearFilters = () => {
    setCurrentFilters(null);
  };

  const allParticipants = data?.pages?.flatMap((page) => page.rows) || [];

  const formatPhoneNumber = (phone) => {
    if (!phone) return '-';
    const match = phone.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      const [, countryCode, firstPart, secondPart] = match;
      return `+${countryCode} ${firstPart}-${secondPart}`;
    }
    return phone;
  };

  const BadgeMedio = ({medio}) => {
    const customClassName =
      medio === 'WhatsApp'
        ? 'bg-green-100 text-green-600'
        : medio === 'Formulario'
          ? 'bg-blue-100 text-blue-600'
          : 'bg-red-100 text-red-600';

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${customClassName}`}
      >
        {medio}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros avanzados */}
      <div className="space-y-4">
        <button
          onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
          className="flex items-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
        >
          {isAdvancedFiltersOpen ? 'Ocultar' : 'Mostrar'} filtros avanzados
        </button>

        {isAdvancedFiltersOpen && (
          <AdvancedParticipantsFilters
            onApplyAdvancedFilters={handleApplyAdvancedFilters}
            onClearFilters={handleClearFilters}
          />
        )}
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allParticipants.map((participant) => (
          <div
            key={participant.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              {/* Header con acciones */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold text-gray-900 truncate"
                    title={participant.name}
                  >
                    {participant.name}
                  </h3>
                  <BadgeMedio medio={participant.medio} />
                </div>

                {customActions.length > 0 && (
                  <div className="flex space-x-1 ml-2">
                    {customActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => action.onClick(participant)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title={action.tooltip}
                      >
                        <action.Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Información de contacto */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <HiOutlineMail className="text-gray-400 w-4 h-4 flex-shrink-0" />
                  <a
                    href={`mailto:${participant.email}`}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors truncate"
                    title={participant.email}
                  >
                    {participant.email}
                  </a>
                </div>

                <div className="flex items-center space-x-2">
                  <HiOutlinePhone className="text-gray-400 w-4 h-4 flex-shrink-0" />
                  <div className="flex space-x-2 text-sm">
                    <a
                      href={`tel:+${participant.phoneNumber}`}
                      className="text-blue-600 hover:underline"
                    >
                      {formatPhoneNumber(participant.phoneNumber)}
                    </a>
                    <span className="text-gray-400">|</span>
                    <a
                      href={`https://wa.me/+${participant.phoneNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Instituto */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Instituto:</span>{' '}
                  {participant.institute}
                </p>
                {participant.networksLabel && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Se enteró por:</span>{' '}
                    {participant.networksLabel}
                  </p>
                )}
              </div>

              {/* Inscripciones */}
              {participant.subscribedTo &&
                participant.subscribedTo.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Inscripciones ({participant.subscribedTo.length})
                    </p>
                    <div className="space-y-2">
                      {participant.subscribedTo
                        .slice(0, 2)
                        .map((subscription, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            <div className="font-medium">
                              {subscription.faculty?.name || 'N/A'}
                            </div>
                            {subscription.career && (
                              <div className="text-blue-600">
                                {subscription.career.name}
                              </div>
                            )}
                          </div>
                        ))}
                      {participant.subscribedTo.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{participant.subscribedTo.length - 2} más
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Fecha de registro */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Registrado:{' '}
                  {new Date(participant.createdAt).toLocaleDateString('es-SV', {
                    timeZone: 'America/El_Salvador',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón cargar más */}
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}

      {/* Mensaje cuando no hay resultados */}
      {allParticipants.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <HiOutlineUser className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg font-medium">
              No se encontraron participantes
            </p>
            <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantsCardView;
