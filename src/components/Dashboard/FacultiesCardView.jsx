import React, {useState, useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
  HiOutlineCalendar,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineOfficeBuilding,
  HiOutlineTrash,
} from 'react-icons/hi';
import {BiEditAlt} from 'react-icons/bi';
import {MdDeleteForever, MdRestore} from 'react-icons/md';
import {getFaculties} from '@services/Faculties';

const FacultiesCardView = ({
  onEdit,
  onDelete,
  onHardDelete,
  onRestore,
  showDeleted,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Función para obtener facultades
  const fetchFacultiesData = async (
    pageNumber,
    pageSize,
    searchedWord,
    filters = null
  ) => {
    if (showDeleted) {
      const result = await getFaculties(
        pageNumber,
        pageSize,
        searchedWord,
        filters,
        true
      );
      const deletedRows = result.rows.filter((row) => row.deletedAt);
      return {
        ...result,
        rows: deletedRows,
        nRows: deletedRows.length,
        nPages: Math.ceil(deletedRows.length / pageSize),
      };
    } else {
      return getFaculties(pageNumber, pageSize, searchedWord, filters, false);
    }
  };

  const customActions = [
    {
      id: 1,
      label: '',
      tooltip: 'Editar',
      Icon: BiEditAlt,
      onClick: onEdit,
      ruleToHide: (faculty) => showDeleted && faculty.deletedAt,
    },
    {
      id: 2,
      label: '',
      tooltip: 'Eliminar',
      Icon: HiOutlineTrash,
      onClick: (faculty) => onDelete(faculty.id),
      ruleToHide: (faculty) => showDeleted && faculty.deletedAt,
    },
    {
      id: 3,
      label: '',
      tooltip: 'Restaurar',
      Icon: MdRestore,
      onClick: (faculty) => onRestore(faculty.id),
      ruleToHide: (faculty) => !showDeleted || !faculty.deletedAt,
    },
    {
      id: 4,
      label: '',
      tooltip: 'Eliminar permanentemente',
      Icon: MdDeleteForever,
      onClick: (faculty) => onHardDelete(faculty.id),
      ruleToHide: (faculty) => !showDeleted || !faculty.deletedAt,
    },
  ];

  const {data, isLoading, refetch} = useQuery({
    queryKey: [
      showDeleted ? 'faculties-with-deleted' : 'faculties',
      'cards',
      currentPage,
    ],
    queryFn: () => fetchFacultiesData(currentPage, pageSize, '', null),
  });

  const faculties = data?.rows || [];
  const totalPages = data?.nPages || 0;
  const totalItems = data?.nRows || 0;

  // Reset cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [showDeleted]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

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
    <div className="space-y-4">
      {/* Información de paginación */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Mostrando {faculties.length} de {totalItems} facultades
        </span>
        <span>
          Página {currentPage} de {totalPages}
        </span>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {faculties.map((faculty) => (
          <div
            key={faculty.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200"
          >
            {/* Header de la tarjeta */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {faculty.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {faculty.description || 'Sin descripción'}
                </p>
              </div>

              {/* Acciones */}
              <div className="flex space-x-1 ml-2">
                {customActions.map((action) => {
                  if (action.ruleToHide && action.ruleToHide(faculty)) {
                    return null;
                  }

                  return (
                    <button
                      key={action.id}
                      onClick={() => action.onClick(faculty)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                      title={action.tooltip}
                    >
                      <action.Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <HiOutlineOfficeBuilding className="w-4 h-4 mr-2" />
                <span className="font-medium">ID:</span>
                <span className="ml-1">{faculty.id}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <HiOutlineOfficeBuilding className="w-4 h-4 mr-2" />
                <span className="font-medium">Tipo:</span>
                <span className="ml-1">Facultad</span>
              </div>

              <div className="flex items-center text-gray-600">
                <HiOutlineCalendar className="w-4 h-4 mr-2" />
                <span className="font-medium">Creado:</span>
                <span className="ml-1">
                  {new Date(faculty.createdAt).toLocaleDateString()}
                </span>
              </div>

              {faculty.deletedAt && (
                <div className="flex items-center text-red-600">
                  <HiOutlineCalendar className="w-4 h-4 mr-2" />
                  <span className="font-medium">Eliminado:</span>
                  <span className="ml-1">
                    {new Date(faculty.deletedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
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

      {/* Mensaje cuando no hay facultades */}
      {faculties.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          {showDeleted
            ? 'No hay facultades eliminadas'
            : 'No hay facultades disponibles'}
        </div>
      )}
    </div>
  );
};

export default FacultiesCardView;
