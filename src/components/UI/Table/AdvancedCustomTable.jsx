/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
import {groupBy} from 'lodash';
import {empty} from '@utils/helpers';
import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
  getParticipants,
  getParticipantsWithAdvancedFilter,
  getParticipantsWithComplexFilter,
} from '@services/Participants';

import Loader from '../Loader';
import CustomRow from './CustomRow';
import Pagination from './Pagination';
import AdvancedParticipantsFilters from '../Filters/AdvancedParticipantsFilters';

const AdvancedCustomTable = ({
  columns,
  queryKey,
  fetchData,
  groupByField = null,
  customActions,
  defaultRowsPerPage = 5,
  customHeaderClassName = 'text-left text-sm text-gray-900 text-wrap',
  customContainerClassName = '',
  CustomFilters = null,
  permissions = [],
  useAdvancedFiltering = false,
}) => {
  const [page, setPage] = useState(1);
  const [nRows, setNRows] = useState(0);
  const [filters, setFilters] = useState({});
  const [searchedWord, setSearchedWord] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [advancedFilters, setAdvancedFilters] = useState(null);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  const fetchDataWithFilters = async () => {
    if (useAdvancedFiltering && advancedFilters) {
      if (advancedFilters.type === 'simple') {
        return await getParticipantsWithAdvancedFilter(
          permissions,
          advancedFilters.filters,
          advancedFilters.operator,
          page,
          rowsPerPage
        );
      } else if (advancedFilters.type === 'complex') {
        return await getParticipantsWithComplexFilter(
          permissions,
          advancedFilters.filterGroups,
          advancedFilters.globalOperator,
          page,
          rowsPerPage
        );
      }
    }

    // Fallback al método original
    return permissions.length > 0
      ? fetchData(permissions, page, rowsPerPage, searchedWord, filters)
      : fetchData(page, rowsPerPage, searchedWord, filters);
  };

  const {isLoading, isError, error, data, refetch} = useQuery({
    queryKey: [
      queryKey,
      searchedWord,
      page,
      JSON.stringify(filters),
      JSON.stringify(advancedFilters),
    ],
    queryFn: fetchDataWithFilters,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!empty(data?.nRows)) {
      setNRows(data?.nRows);
    }
  }, [data]);

  const handleApplyAdvancedFilters = (newAdvancedFilters) => {
    setAdvancedFilters(newAdvancedFilters);
    setPage(1); // Reset to first page when applying new filters
  };

  const handleClearAdvancedFilters = () => {
    setAdvancedFilters(null);
    setPage(1);
  };

  return (
    <div className="my-4 px-4">
      {/* Filtros tradicionales */}
      {CustomFilters && !useAdvancedFiltering && (
        <CustomFilters
          onSearchAction={(newWord) => setSearchedWord(newWord)}
          onApplyFilters={setFilters}
        />
      )}

      {/* Filtros avanzados */}
      {useAdvancedFiltering && (
        <div className="space-y-4 mb-6">
          {/* Filtros generales siempre visibles cuando se usa filtrado avanzado */}
          {CustomFilters && (
            <CustomFilters
              onSearchAction={(newWord) => setSearchedWord(newWord)}
              onApplyFilters={handleApplyAdvancedFilters}
              onClearFilters={handleClearAdvancedFilters}
            />
          )}

          <button
            onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
            className="flex items-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            {isAdvancedFiltersOpen ? 'Ocultar' : 'Mostrar'} filtros avanzados
          </button>

          {isAdvancedFiltersOpen && (
            <AdvancedParticipantsFilters
              onApplyAdvancedFilters={handleApplyAdvancedFilters}
              onClearFilters={handleClearAdvancedFilters}
              currentFilters={advancedFilters}
            />
          )}
        </div>
      )}

      <div
        className={`bg-white -mx-4 my-6 overflow-x-auto shadow-sm ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg p-2 box-content ${customContainerClassName}`}
      >
        <table className="min-w-full divide-y divide-gray-300 px-2">
          <thead className="">
            <tr className={customHeaderClassName}>
              {columns.map((column) => (
                <th
                  scope="col"
                  key={column.field}
                  className={`${column.className} py-3.5 md:px-3 font-semibold`}
                >
                  {column.title}
                </th>
              ))}
              {!empty(customActions) && (
                <th
                  scope="col"
                  className="relative py-3.5 pl-3 pr-4 sm:pr-6 w-[1fr]"
                >
                  <span className="sr-only">Edit</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white text-wrap">
            {empty(groupByField) ? (
              <>
                {(data?.rows ?? []).map((row, rowIdx) => (
                  <CustomRow
                    data={row}
                    key={row.id}
                    rowIdx={rowIdx}
                    columns={columns}
                    customActions={customActions}
                  />
                ))}
              </>
            ) : (
              <>
                {Object.entries(groupBy(data, groupByField)).map(
                  ([label, dataset]) => (
                    <GroupingRows
                      key={label}
                      label={label}
                      dataset={dataset}
                      columns={columns}
                      customActions={customActions}
                    />
                  )
                )}
              </>
            )}
          </tbody>
        </table>
        {isLoading && (
          <div className="w-full flex justify-center items-center py-4 bg-white">
            <Loader className="w-5 h-5 text-black" />
            <p className="text-black">Cargando...</p>
          </div>
        )}
        {isError && !data?.rows && (
          <div className="flex flex-col justify-center items-center py-8">
            <p className="text-center font-bold">Oops! Algo salio mal</p>
            <p className="text-sm mb-4">
              Su petición no ha podido ser procesada, por favor intente de nuevo
              más tarde.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:outline-hidden text-sm"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Mensaje cuando no hay resultados */}
        {!isLoading && !isError && (data?.rows ?? []).length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg font-medium">
                No se encontraron participantes
              </p>
              <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </div>
        )}
      </div>

      <Pagination
        nRows={nRows}
        currentPage={page}
        rowsPerPage={rowsPerPage}
        onChangePage={(newPage) => setPage(newPage)}
        nextPage={() => setPage((old) => old + 1)}
        previusPage={() => setPage((old) => Math.max(old - 1, 1))}
      />
    </div>
  );
};

const GroupingRows = ({label, dataset, columns, customActions}) => (
  <>
    <tr className="border-t border-gray-200">
      <th
        colSpan={columns.length + 1}
        scope="colgroup"
        className="bg-gray-50 sm:py-2 pl-4 sm:pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3 text-wrap"
      >
        {label}
      </th>
    </tr>

    {dataset.map((row, rowIdx) => (
      <CustomRow
        data={row}
        key={row.id}
        rowIdx={rowIdx}
        columns={columns}
        customActions={customActions}
      />
    ))}
  </>
);

export default AdvancedCustomTable;
