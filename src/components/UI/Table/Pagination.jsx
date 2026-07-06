import React from 'react';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';

const Pagination = ({
  nRows,
  rowsPerPage,
  rowsPerPageOptions = [5, 10, 20, 50],
  onRowsPerPageChange,
  currentPage,
  onChangePage,
  nextPage,
  previusPage,
}) => {
  const totalPages = Math.ceil(nRows / rowsPerPage);
  const pages = Array.from(Array(totalPages).keys());
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, nRows);

  // Generar array de páginas a mostrar con elipsis
  const getPagesToShow = () => {
    if (totalPages <= 7) {
      return pages.map((p) => ({type: 'page', value: p}));
    }

    const result = [];
    // Siempre mostrar primera página
    result.push({type: 'page', value: 0});

    if (currentPage <= 4) {
      // Mostrar páginas 2, 3, 4, 5
      for (let i = 1; i <= 4; i++) {
        if (i < totalPages - 1) {
          result.push({type: 'page', value: i});
        }
      }
    } else if (currentPage >= totalPages - 3) {
      // Mostrar páginas del medio cerca del final
      for (let i = totalPages - 5; i < totalPages - 1; i++) {
        if (i > 0) {
          result.push({type: 'page', value: i});
        }
      }
    } else {
      // Mostrar páginas alrededor de la página actual
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 0 && i < totalPages - 1) {
          result.push({type: 'page', value: i});
        }
      }
    }

    // Siempre mostrar última página
    result.push({type: 'page', value: totalPages - 1});

    return result;
  };

  const pagesToShow = getPagesToShow();

  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <CustomButton label="Anterior" onClick={previusPage} />
        <CustomButton label="Siguiente" onClick={nextPage} />
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Mostrar</label>
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              className="block rounded-md border-0 py-1.5 pl-2 pr-6 text-sm text-gray-900 ring-inset ring-gray-300 focus:ring-inset focus:ring-primary"
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">filas</span>
          </div>
          <p className="text-sm text-gray-700">
            | Mostrando <span className="font-medium">{startIndex}</span>
            {' - '}
            <span className="font-medium">{endIndex}</span> de{' '}
            <span className="font-medium">{nRows}</span> resultados
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-xs"
            aria-label="Pagination"
          >
            <button
              type="button"
              onClick={previusPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BsChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs pl-1 font-bold">Prev</span>
            </button>
            {pagesToShow.map((item, index) => {
              if (item.type === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-inset ring-gray-300 focus:outline-offset-0"
                  >
                    ...
                  </span>
                );
              }
              // Detectar si hay salto entre páginas (necesita elipsis)
              const prevItem = pagesToShow[index - 1];
              const showEllipsis =
                prevItem &&
                prevItem.type === 'page' &&
                item.value - prevItem.value > 1;

              return (
                <React.Fragment key={item.value}>
                  {showEllipsis && (
                    <span
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-inset ring-gray-300 focus:outline-offset-0"
                    >
                      ...
                    </span>
                  )}
                  <CustomPage
                    label={item.value + 1}
                    isActive={currentPage === item.value + 1}
                    onClick={() => onChangePage(item.value + 1)}
                  />
                </React.Fragment>
              );
            })}
            <button
              type="button"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-xs pr-1 font-bold">Next</span>
              <BsChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

const CustomButton = ({label, onClick}) => (
  <button
    type="button"
    onClick={onClick}
    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
  >
    {label}
  </button>
);

const CustomPage = ({label, onClick, isActive}) => {
  const customClassName = isActive
    ? 'relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    : 'relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-400  ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex';
  return (
    <button type="button" onClick={onClick} className={customClassName}>
      {label}
    </button>
  );
};

export default Pagination;
