import {useState, useEffect} from 'react';
import makeAnimated from 'react-select/animated';
import Select, {createFilter} from 'react-select';

const SelectFilter = ({
  isMulti = false,
  disabled = false,
  isClearable = false,
  isSearchable = false,
  closeMenuOnSelect = false,
  setDefaultValue = null,
  placeholder = 'Elige una opción...',
  customClassName = '',
  options = [],
  onChange = (value) => {},
}) => {
  const [value, setValue] = useState(null);
  const animatedComponents = makeAnimated();
  const inputClassName = `appearance-none block w-full rounded-md shadow-sm text-sm`;

  const onChangeValue = (selectedOption) => {
    setValue(selectedOption);
    onChange(selectedOption);
  };

  useEffect(() => {
    console.log('setDefaultValue', setDefaultValue);
    if (setDefaultValue) {
      setValue(setDefaultValue);
    }
  }, [setDefaultValue]);

  return (
    <div className={customClassName}>
      <Select
        isMulti={isMulti}
        options={options}
        closeMenuOnScroll
        isDisabled={disabled}
        isClearable={isClearable}
        placeholder={placeholder}
        isSearchable={isSearchable}
        components={animatedComponents}
        closeMenuOnSelect={closeMenuOnSelect}
        value={value}
        onChange={onChangeValue}
        filterOption={createFilter({ignoreAccents: false})}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            paddingTop: '0.10rem',
            paddingBottom: '0.10rem',
            backgroundColor: state.isFocused ? '#fff' : '#F8FAFC',
            color: '#003C71',
          }),
        }}
        className={inputClassName}
      />
    </div>
  );
};

export default SelectFilter;
