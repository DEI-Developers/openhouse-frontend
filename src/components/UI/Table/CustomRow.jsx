import {useMemo} from 'react';
import {empty} from '@utils/helpers';
import Tooltip from '@components/UI/Tooltip';

const CustomRow = ({data, rowIdx, columns, customActions}) => {
  const fields = useMemo(
    () => columns.map((column) => column.field),
    [columns]
  );

  const stackedFields = useMemo(
    () =>
      columns
        .filter((column) => column.stackedColumn)
        .map((column) => column.field),
    [columns]
  );

  return (
    <tr>
      {fields.map((field, colIdx) => (
        <td
          key={colIdx}
          className={`
            px-3 py-4 text-sm
            ${colIdx === 0 ? 'font-medium text-gray-900' : 'text-gray-500'}
            ${getClassNameByField(columns, field)}
          `}
        >
          {getFieldData(data, field, columns)}
          {colIdx === 0 && (
            <dl className="font-normal lg:hidden">
              {stackedFields.map((stakedField) => (
                <dd key={stakedField} className="mt-1 truncate text-gray-700">
                  {getFieldData(data, stakedField, columns)}
                </dd>
              ))}
            </dl>
          )}
        </td>
      ))}
      {!empty(customActions) && (
        <td>
          <div className="flex flex-row items-center justify-end md:space-x-1 py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
            {customActions?.map((action) => (
              <Tooltip key={action.id} message={action.tooltip}>
                <button
                  type="button"
                  onClick={() => action.onClick(data, rowIdx)}
                  className={`flex justify-center items-center text-xs text-primary hover:text-secondary underline focus:outline-hidden font-medium px-1 my-2 md:my-0 ${verifyActionClassName(action, data)}`}
                >
                  {action.label}
                  {action.Icon && <action.Icon className="w-6 h-6" />}
                </button>
              </Tooltip>
            ))}
          </div>
        </td>
      )}
    </tr>
  );
};

const getClassNameByField = (columns, field) =>
  columns.find((column) => column.field === field)?.className ?? '';

const getFieldData = (row, field, columns) => {
  const currentColumn = columns.find((column) => column.field === field);

  if (currentColumn?.render) {
    return currentColumn.render(row);
  }

  return Object.prototype.hasOwnProperty.call(row, field) ? row[field] : '';
};

const verifyActionClassName = (action, data) => {
  if (action.ruleToHide) {
    return action.ruleToHide(data) ? 'hidden' : '';
  }

  return '';
};

export default CustomRow;
