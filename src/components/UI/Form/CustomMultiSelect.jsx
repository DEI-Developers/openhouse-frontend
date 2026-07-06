/* eslint-disable react/jsx-props-no-spreading */
import {Controller} from 'react-hook-form';
import makeAnimated from 'react-select/animated';
import Select, {createFilter} from 'react-select';

const CustomMultiSelect = ({
  name,
  label,
  options,
  error,
  control,
  required = false,
  disabled,
  isMulti = false,
  containerClassName,
  isClearable = false,
  isSearchable = false,
  closeMenuOnSelect = false,
  defaultValue = isMulti ? [] : null,
  placeholder = 'Elige una o varias opciones...',
  // Controlled mode props
  value,
  onChange,
}) => {
  const animatedComponents = makeAnimated();
  const inputClassName =
    'appearance-none border border-gray-300 w-full rounded-md shadow-xs text-sm';

  // Controlled mode (no RHF)
  if (value !== undefined && onChange !== undefined) {
    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700"
            {...(required && {'aria-required': true})}
          >
            {label}
          </label>
        )}
        <div className="mt-2">
          <Select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            options={options}
            isMulti={isMulti}
            closeMenuOnScroll={false}
            isDisabled={disabled}
            isClearable={isClearable}
            isSearchable={isSearchable}
            placeholder={placeholder}
            closeMenuOnSelect={closeMenuOnSelect}
            filterOption={createFilter({ignoreAccents: false})}
            classNames={{
              control: (state) =>
                `border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white ${state.isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}`,
              input: () => inputClassName,
            }}
          />
        </div>
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    );
  }

  // Default: use Controller (RHF mode)
  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
          {...(required && {'aria-required': true})}
        >
          {label}
        </label>
      )}
      <div className="mt-2 flex">
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({field}) => (
            <Select
              {...field}
              components={animatedComponents}
              isMulti={isMulti}
              options={options}
              closeMenuOnScroll={false}
              isDisabled={disabled}
              isClearable={isClearable}
              isSearchable={isSearchable}
              placeholder={placeholder}
              closeMenuOnSelect={closeMenuOnSelect}
              filterOption={createFilter({ignoreAccents: false})}
              classNames={{
                control: (state) =>
                  `border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white ${state.isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}`,
                input: () => inputClassName,
              }}
            />
          )}
        />
      </div>
      {error && <span className="text-red-500 text-xs">{error.message}</span>}
    </div>
  );
};

export default CustomMultiSelect;
