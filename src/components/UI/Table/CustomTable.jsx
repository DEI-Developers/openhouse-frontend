/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
import {groupBy} from 'lodash';
import {empty} from '@utils/helpers';
import {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';

import Loader from '../Loader';
import CustomRow from './CustomRow';
import Pagination from './Pagination';
import TableFilters from './TableFilters';

const CustomTable = ({
  columns,
  queryKey,
  fetchData,
  groupByField = null,
  customActions,
  customHeaderClassName = 'text-left text-sm text-gray-900',
  customContainerClassName = '',
}) => {
  const [page, setPage] = useState(1);
  const [nRows, setNRows] = useState(0);
  const [filter, setFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const {
    isLoading,
    isError,
    // error,
    data,
    refetch,
  } = useQuery({
    queryKey: [queryKey, filter, page],
    queryFn: () => fetchData(page, rowsPerPage, filter),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!empty(data?.nRows)) {
      setNRows(data?.nRows);
    }
  }, [data]);

  return (
    <div className="my-4">
      {/* <TableFilters searchAction={(newFilter) => setFilter(newFilter)} /> */}

      <div
        className={`bg-white -mx-4 my-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg p-2 ${customContainerClassName}`}
      >
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="">
            <tr className={customHeaderClassName}>
              {columns.map((column) => (
                <th
                  scope="col"
                  key={column.field}
                  className={`${column.className} py-3.5 px-3 font-semibold`}
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
          <tbody className="divide-y divide-gray-200 bg-white">
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
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none text-sm"
            >
              Reintentar
            </button>
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
        className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
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

export default CustomTable;
