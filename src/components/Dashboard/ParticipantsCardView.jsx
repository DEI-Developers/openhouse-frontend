import React, {useState, useEffect, useCallback} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineAcademicCap,
  HiOutlineGlobeAlt,
} from 'react-icons/hi';
import {empty} from '@utils/helpers';
import {
  getParticipants,
  getParticipantsWithAdvancedFilter,
  getParticipantsWithComplexFilter,
} from '@services/Participants';
import AdvancedParticipantsFilters from '@components/UI/Filters/AdvancedParticipantsFilters';
import ParticipantsFilters from '@components/UI/Filters/ParticipantsFilters';
import CustomModal from '@components/UI/Modal/CustomModal';
import {useAuth} from '@context/AuthContext';
import BadgeMedio from '@components/UI/Badges/BadgeMedio';
import {formatPhoneNumber} from '@utils/helpers/formatters';
import Permissions from '@utils/Permissions';

const ParticipantsCardView = ({
  customActions,
  permissions,
  onDeleteAttendance,
}) => {
  const {permissions: userPermissions} = useAuth();
  const [currentFilters, setCurrentFilters] = useState(null);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [showInscriptionsModal, setShowInscriptionsModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // Verificar si el usuario tiene permisos para ver toda la información de contacto
  const canViewAllParticipants = userPermissions.includes(
    Permissions.VIEW_ALL_PARTICIPANTS
  );

  const fetchParticipants = async ({pageParam = 1}) => {
    if (currentFilters) {
      if (currentFilters.type === 'simple') {
        return await getParticipantsWithAdvancedFilter(
          userPermissions,
          currentFilters.filters,
          currentFilters.operator,
          pageParam,
          15 // pageSize para cards - máximo 15 por bloque
        );
      } else if (currentFilters.type === 'complex') {
        return await getParticipantsWithComplexFilter(
          userPermissions,
          currentFilters.filterGroups,
          currentFilters.globalOperator,
          pageParam,
          15
        );
      }
    }

    return await getParticipants(userPermissions, pageParam, 15, '', {});
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
        return Number(lastPage.currentPage) + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (lastPage) => {
      if (lastPage.currentPage > 1) {
        return Number(lastPage.currentPage) - 1;
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

  // Hook para scroll infinito automático
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Cargar más datos cuando esté cerca del final (200px antes)
    if (scrollTop + windowHeight >= documentHeight - 200) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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
      {/* Filtros generales siempre visibles */}
      <div className="space-y-4">
        <ParticipantsFilters
          onSearchAction={refetch}
          onApplyFilters={handleApplyAdvancedFilters}
          onClearFilters={handleClearFilters}
        />

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
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 group relative flex flex-col h-full"
          >
            <div className="p-6 flex-grow">
              {/* Header con acciones */}
              <div className="flex justify-between items-start mb-4 min-w-0">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="relative group/tooltip pb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate cursor-help">
                      {participant.name}
                    </h3>
                    {/* Tooltip con nombre completo en hover */}
                    <div
                      className="invisible group-hover/tooltip:visible absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full 
                                  px-3 py-2 bg-gray-900 text-white text-sm rounded-md shadow-lg 
                                  opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300
                                  whitespace-nowrap z-50 after:content-[''] after:absolute after:left-1/2 
                                  after:-translate-x-1/2 after:top-full after:border-8 after:border-x-transparent 
                                  after:border-b-transparent after:border-t-gray-900"
                    >
                      {participant.name}
                    </div>
                  </div>
                  <BadgeMedio medio={participant.medio} compact />
                </div>

                {customActions.length > 0 && (
                  <div className="flex space-x-1 flex-shrink-0">
                    {customActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => action.onClick(participant)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        title={action.tooltip}
                      >
                        <action.Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Información de contacto */}
              {canViewAllParticipants && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Contacto
                    </h4>
                    <div className="space-y-2">
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
                  </div>
                </div>
              )}

              {/* Información académica */}
              <div
                className={`space-y-4 ${canViewAllParticipants ? 'pt-3 border-t border-gray-100' : ''}`}
              >
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Información Académica
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <HiOutlineAcademicCap className="text-gray-400 w-4 h-4 flex-shrink-0" />
                      <span
                        className="text-sm text-gray-600 truncate"
                        title={participant.institute}
                      >
                        {participant.institute}
                      </span>
                    </div>
                    {participant.networksLabel && (
                      <div className="flex items-center space-x-2">
                        <HiOutlineGlobeAlt className="text-gray-400 w-4 h-4 flex-shrink-0" />
                        <span
                          className="text-sm text-gray-600 truncate"
                          title={participant.networksLabel}
                        >
                          {participant.networksLabel}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Inscripciones */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Inscripciones
                </h4>
                {participant.subscribedTo &&
                participant.subscribedTo.length > 0 ? (
                  <InscriptionsSection
                    participant={participant}
                    onShowAll={() => {
                      setSelectedParticipant(participant);
                      setShowInscriptionsModal(true);
                    }}
                    permissions={permissions}
                    onDeleteAttendance={onDeleteAttendance}
                  />
                ) : (
                  <p className="text-sm text-gray-500">Sin inscripciones</p>
                )}
              </div>
            </div>

            {/* Footer con fecha de registro */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg mt-auto">
              <p className="text-xs text-gray-500 text-center">
                Registrado el{' '}
                {new Date(participant.createdAt).toLocaleDateString('es-SV', {
                  timeZone: 'America/El_Salvador',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Indicador de carga para scroll infinito */}
      {isFetchingNextPage && (
        <div className="flex justify-center mt-8 mb-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-sm">Cargando más participantes...</span>
          </div>
        </div>
      )}

      {/* Mensaje cuando se han cargado todos los datos */}
      {!hasNextPage && allParticipants.length > 0 && (
        <div className="flex justify-center mt-8 mb-8">
          <div className="text-gray-500 text-sm">
            Has visto todos los participantes ({allParticipants.length} en
            total)
          </div>
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

      {/* Modal de inscripciones */}
      {showInscriptionsModal && selectedParticipant && (
        <CustomModal
          isOpen={showInscriptionsModal}
          onToggleModal={() => {
            setShowInscriptionsModal(false);
            setSelectedParticipant(null);
          }}
          className="p-6 w-full sm:max-w-4xl"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Todas las inscripciones de {selectedParticipant.name}
            </h3>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedParticipant.subscribedTo.map((item, index) => (
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
                  <AccompanimentBadges
                    item={item}
                    participant={selectedParticipant}
                    permissions={permissions}
                    onDeleteAttendance={onDeleteAttendance}
                    showDeleteButton={true}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                setShowInscriptionsModal(false);
                setSelectedParticipant(null);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

// Componente para mostrar las inscripciones en las fichas
const InscriptionsSection = ({
  participant,
  onShowAll,
  permissions,
  onDeleteAttendance,
}) => {
  const subscribedTo = participant?.subscribedTo ?? [];

  if (subscribedTo.length === 0) {
    return <div className="text-gray-500 text-sm">Sin inscripciones</div>;
  }

  const firstItem = subscribedTo[0];
  const additionalCount = subscribedTo.length - 1;

  return (
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
          <AccompanimentBadges
            item={firstItem}
            participant={participant}
            permissions={permissions}
            onDeleteAttendance={onDeleteAttendance}
            showDeleteButton={true}
          />
        </div>
      </div>

      {additionalCount > 0 && (
        <button
          onClick={onShowAll}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
        >
          +{additionalCount} más
        </button>
      )}
    </div>
  );
};

// Componente para mostrar badges de acompañamiento
const AccompanimentBadges = ({
  item,
  participant,
  permissions,
  onDeleteAttendance,
  showDeleteButton = false,
}) => {
  const withParent = item.withParent;
  const parentStudiedAtUCA = item.parentStudiedAtUCA;
  const attended = item.attended;

  const handleDeleteAttendance = () => {
    if (onDeleteAttendance && participant && item.event) {
      onDeleteAttendance({
        participantId: participant.id,
        participantName: participant.name,
        eventId: item.event.id,
        eventDate: item.event.date,
        facultyName: item.faculty?.name || 'N/A',
      });
    }
  };

  const canDeleteAttendance =
    showDeleteButton &&
    attended &&
    permissions?.includes(Permissions.DELETE_PARTICIPANT_ATTENDANCE);

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {/* Badge de asistencia con X para eliminar */}
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          attended
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {attended ? 'Asistió' : 'No asistió'}
        {canDeleteAttendance && (
          <button
            onClick={handleDeleteAttendance}
            className="ml-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-200 rounded-full p-0.5 transition-colors duration-200"
            title="Eliminar asistencia"
          >
            ×
          </button>
        )}
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

export default ParticipantsCardView;
