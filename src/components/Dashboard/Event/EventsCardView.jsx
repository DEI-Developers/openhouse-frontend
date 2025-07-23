import React, {useState, useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineOfficeBuilding,
  HiX,
} from 'react-icons/hi';
import {BiEditAlt} from 'react-icons/bi';
import {HiOutlineExclamationTriangle, HiOutlineTrash} from 'react-icons/hi2';
import {getEvents} from '@services/Events';
import EventsFilters from '@components/UI/Filters/EventsFilters';

const EventsCardView = ({customActions, onEdit, onDelete}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState(null);
  const [searchWord, setSearchWord] = useState('');
  const [showFacultiesDialog, setShowFacultiesDialog] = useState(false);
  const [showCareersDialog, setShowCareersDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const pageSize = 12;

  const fetchEventsData = async (
    pageNumber,
    pageSize,
    searchedWord,
    filters = {}
  ) => {
    return getEvents(pageNumber, pageSize, searchedWord, filters);
  };

  const {data, isLoading, refetch} = useQuery({
    queryKey: ['events', 'cards', currentPage, searchWord, currentFilters],
    queryFn: () =>
      fetchEventsData(currentPage, pageSize, searchWord, currentFilters || {}),
  });

  const events = data?.rows || [];
  const totalPages = data?.nPages || 0;
  const totalItems = data?.nRows || 0;

  // Reset cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [currentFilters, searchWord]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  const handleSearchAction = (searchTerm) => {
    setSearchWord(searchTerm);
  };

  const handleApplyFilters = (filters) => {
    setCurrentFilters(filters);
  };

  // Bloquear scroll del fondo cuando se abren diálogos
  useEffect(() => {
    if (showFacultiesDialog || showCareersDialog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFacultiesDialog, showCareersDialog]);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Botón anterior
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <HiChevronLeft className="w-4 h-4" />
      </button>
    );

    // Botones de páginas
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border-t border-b border-r border-gray-300 ${
            i === currentPage
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Botón siguiente
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <HiChevronRight className="w-4 h-4" />
      </button>
    );

    return buttons;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Filtros skeleton */}
        <div className="bg-gray-200 rounded-lg h-16 animate-pulse"></div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
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
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <EventsFilters
        onSearchAction={handleSearchAction}
        onApplyFilters={handleApplyFilters}
      />

      {/* Información de paginación */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Mostrando {events.length} de {totalItems} eventos
        </span>
        <span>
          Página {currentPage} de {totalPages}
        </span>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200"
          >
            {/* Header de la tarjeta */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {event.name}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <HiOutlineCalendar className="w-4 h-4 mr-1" />
                  <span>{event.formatDate}</span>
                </div>
              </div>

              {/* Estado */}
              <div className="ml-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    event.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {event.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            {/* Información principal */}
            <div className="space-y-3 mb-4">
              {/* Capacidad e información compacta */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  {/* Capacidad */}
                  <div
                    className="flex items-center text-gray-600"
                    title={`Capacidad: ${event.subscribed?.length || 0}/${event.capacity}`}
                  >
                    <HiOutlineUsers className="w-4 h-4 mr-1" />
                    <span className="font-semibold text-xs">
                      {event.subscribed?.length || 0}/{event.capacity}
                    </span>
                  </div>

                  {/* Deserción */}
                  {event.desertionRate !== undefined &&
                    event.desertionRate !== null && (
                      <div
                        className="flex items-center text-gray-600"
                        title={`Tasa de deserción: ${event.desertionRate}%`}
                      >
                        <HiOutlineExclamationTriangle className="w-4 h-4 mr-1" />
                        <span className="font-semibold text-xs">
                          {event.desertionRate}%
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {/* Facultades */}
              {event.faculties && event.faculties.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <HiOutlineOfficeBuilding className="w-4 h-4 mr-2" />
                    <span className="font-medium">Facultades:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {event.faculties.slice(0, 2).map((faculty) => (
                      <span
                        key={faculty.value}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {faculty.name}
                      </span>
                    ))}
                    {event.faculties.length > 2 && (
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowFacultiesDialog(true);
                        }}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        +{event.faculties.length - 2} más
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Carreras */}
              {event.careerLabels && event.careerLabels.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <HiOutlineAcademicCap className="w-4 h-4 mr-2" />
                    <span className="font-medium">Carreras:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {event.careerLabels.slice(0, 3).map((career, index) => (
                      <span
                        key={career.value || index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {career.name || career}
                      </span>
                    ))}
                    {event.careerLabels.length > 3 && (
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowCareersDialog(true);
                        }}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        +{event.careerLabels.length - 3} más
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Acciones */}
            {customActions && customActions.length > 0 && (
              <div className="flex justify-end space-x-1 pt-3 border-t border-gray-100">
                {customActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => action.onClick(event)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    title={action.tooltip}
                  >
                    <action.Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <div className="flex rounded-md shadow-sm">
            {renderPaginationButtons()}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay eventos */}
      {events.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No hay eventos disponibles
        </div>
      )}

      {/* Diálogo de Facultades */}
      {showFacultiesDialog && selectedEvent && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowFacultiesDialog(false);
            }
          }}
        >
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Facultades - {selectedEvent.name}
              </h3>
              <button
                onClick={() => setShowFacultiesDialog(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
              <div className="space-y-3">
                {selectedEvent.faculties.map((faculty, index) => (
                  <div
                    key={faculty.value}
                    className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    <HiOutlineOfficeBuilding className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-blue-800">
                      {faculty.name}
                    </span>
                  </div>
                ))}
              </div>
              {/* Padding extra al final */}
              <div className="h-4"></div>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de Carreras */}
      {showCareersDialog && selectedEvent && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCareersDialog(false);
            }
          }}
        >
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Carreras - {selectedEvent.name}
              </h3>
              <button
                onClick={() => setShowCareersDialog(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
              <div className="space-y-3">
                {selectedEvent.careerLabels.map((career, index) => (
                  <div
                    key={career.value || index}
                    className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors"
                  >
                    <HiOutlineAcademicCap className="w-5 h-5 mr-3 text-purple-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-purple-800">
                      {career.name || career}
                    </span>
                  </div>
                ))}
              </div>
              {/* Padding extra al final */}
              <div className="h-4"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsCardView;
