import {empty} from '@utils/helpers';
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';

const Pagination = ({
  nRows,
  rowsPerPage,
  currentPage,
  onChangePage,
  nextPage,
  previusPage,
}) => {
  const totalPages = Math.ceil(nRows / rowsPerPage);
  const pages = Array.from(Array(totalPages).keys());
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, nRows);
  const firstPages = pages.length > 6 ? pages.slice(0, 3) : pages;
  const endPages = pages.length > 6 ? pages.slice(-3) : [];

  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <CustomButton label="Anterior" onClick={previusPage} />
        <CustomButton label="Siguiente" onClick={nextPage} />
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{startIndex}</span>
            {' - '}
            <span className="font-medium">{endIndex}</span> de{' '}
            <span className="font-medium">{nRows}</span> resultados
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              type="button"
              onClick={previusPage}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <BsChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs pl-1 font-bold">Prev</span>
            </button>
            {firstPages.map((page) => (
              <CustomPage
                key={page}
                label={page + 1}
                isActive={currentPage === page + 1}
                onClick={() => onChangePage(page + 1)}
              />
            ))}
            {!empty(endPages) && (
              <>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                  ...
                </span>
                {endPages.map((page) => (
                  <CustomPage
                    key={page}
                    label={page + 1}
                    isActive={currentPage === page + 1}
                    onClick={() => onChangePage(page + 1)}
                  />
                ))}
              </>
            )}
            <button
              type="button"
              onClick={nextPage}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
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
    ? 'relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    : 'relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex';
  return (
    <button type="button" onClick={onClick} className={customClassName}>
      {label}
    </button>
  );
};

export default Pagination;
