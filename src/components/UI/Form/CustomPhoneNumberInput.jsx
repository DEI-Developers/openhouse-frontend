import {PhoneInput} from 'react-international-phone';
import {Controller} from 'react-hook-form';
import 'react-international-phone/style.css';

const CustomPhoneNumberInput = ({
  containerClassName,
  control,
  name,
  label,
  defaultValue,
  required = false,
  error,
  onCustomBlur,
  // Controlled mode props
  value,
  onChange,
}) => {
  // If value/onChange provided, use controlled mode (no RHF)
  if (value !== undefined && onChange !== undefined) {
    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <PhoneInput
          defaultCountry="sv"
          value={value}
          onChange={onChange}
          onBlur={() => {
            if (onCustomBlur) onCustomBlur(value);
          }}
          inputClassName={`w-full ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
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
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({field: {onChange: onChangeField, value: fieldValue, onBlur}}) => (
          <PhoneInput
            defaultCountry="sv"
            value={fieldValue}
            onChange={onChangeField}
            onBlur={() => {
              onBlur();
              if (onCustomBlur) {
                onCustomBlur(fieldValue);
              }
            }}
            inputClassName={`w-full ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
        )}
      />
      {error && <span className="text-red-500 text-xs">{error.message}</span>}
    </div>
  );
};

export default CustomPhoneNumberInput;
