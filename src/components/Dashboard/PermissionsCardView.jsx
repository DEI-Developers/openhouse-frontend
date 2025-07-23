import React, {useState, useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
  HiOutlineKey,
  HiOutlineTag,
  HiOutlineCalendar,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi';
import {getPermissions} from '@services/Permissions';
import {BiEditAlt} from 'react-icons/bi';
import {MdDeleteForever, MdRestore} from 'react-icons/md';
import {HiOutlineTrash} from 'react-icons/hi2';

const PermissionsCardView = ({
  onEdit,
  onDelete,
  onHardDelete,
  onRestore,
  showDeleted,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Función para obtener permisos
  const fetchPermissionsData = async (
    pageNumber,
    pageSize,
    searchedWord,
    filters = null
  ) => {
    if (showDeleted) {
      const result = await getPermissions(
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
      return getPermissions(pageNumber, pageSize, searchedWord, filters, false);
    }
  };

  const customActions = [
    {
      id: 1,
      label: '',
      tooltip: 'Editar',
      Icon: BiEditAlt,
      onClick: onEdit,
      ruleToHide: (permission) => permission.deletedAt,
    },
    {
      id: 2,
      label: '',
      tooltip: showDeleted ? 'Restaurar' : 'Eliminar',
      Icon: showDeleted ? MdRestore : HiOutlineTrash,
      onClick: showDeleted ? onRestore : onDelete,
    },
    ...(showDeleted
      ? [
          {
            id: 3,
            label: '',
            tooltip: 'Eliminar permanentemente',
            Icon: MdDeleteForever,
            onClick: onHardDelete,
          },
        ]
      : []),
  ];

  const {data, isLoading, refetch} = useQuery({
    queryKey: [
      showDeleted ? 'permissions-with-deleted' : 'permissions',
      'cards',
      currentPage,
    ],
    queryFn: () => fetchPermissionsData(currentPage, pageSize, '', null),
  });

  const permissions = data?.rows || [];
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
    <div className="space-y-6">
      {/* Información de paginación */}
      <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <div>
          Página {currentPage} de {totalPages} | Mostrando {permissions.length}{' '}
          de {totalItems} permisos
        </div>
        <div className="text-gray-500">
          {totalItems} {totalItems === 1 ? 'permiso' : 'permisos'}{' '}
          {showDeleted ? 'eliminados' : 'activos'}
        </div>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {permissions.map((permission) => (
          <div
            key={permission.id}
            className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 group relative flex flex-col h-full ${
              permission.deletedAt
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <div className="p-6 flex-grow">
              {/* Header con estado y acciones */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        permission.deletedAt
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {permission.deletedAt ? 'Eliminado' : 'Activo'}
                    </span>
                  </div>
                  <div className="relative group/tooltip pb-3">
                    <h3
                      className={`text-lg font-semibold truncate cursor-help ${
                        permission.deletedAt
                          ? 'text-red-600 line-through'
                          : 'text-gray-900'
                      }`}
                    >
                      {permission.name}
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
                      {permission.name}
                    </div>
                  </div>
                </div>

                {customActions.length > 0 && (
                  <div className="flex space-x-1 flex-shrink-0">
                    {customActions
                      .filter(
                        (action) =>
                          !action.ruleToHide || !action.ruleToHide(permission)
                      )
                      .map((action) => (
                        <button
                          key={action.id}
                          onClick={() => action.onClick(permission)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                          title={action.tooltip}
                        >
                          <action.Icon className="w-4 h-4" />
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Información del permiso */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <HiOutlineKey className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">Valor:</span>
                  <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                    {permission.value}
                  </span>
                </div>

                {permission.description && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Descripción:</span>
                    <p className="mt-1 text-gray-500">
                      {permission.description}
                    </p>
                  </div>
                )}

                {permission.createdAt && (
                  <div className="flex items-center text-xs text-gray-500">
                    <HiOutlineCalendar className="w-3 h-3 mr-1" />
                    Creado:{' '}
                    {new Date(permission.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <div className="flex items-center">{renderPaginationButtons()}</div>
        </div>
      )}

      {/* Mensaje cuando no hay datos */}
      {!isLoading && permissions.length === 0 && (
        <div className="text-center py-12">
          <HiOutlineKey className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {showDeleted
              ? 'No hay permisos eliminados'
              : 'No se encontraron permisos'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {showDeleted
              ? 'No hay permisos eliminados para mostrar.'
              : 'Comienza creando un nuevo permiso.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PermissionsCardView;
