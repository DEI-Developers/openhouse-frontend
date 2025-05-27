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
}) => {
  return (
    <div className={containerClassName}>
      <label
        aria-required={required}
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({field: {onChange, value, onBlur}}) => (
          <PhoneInput
            defaultCountry="sv"
            value={value}
            onChange={onChange}
            onBlur={() => {
              onBlur();
              if (onCustomBlur) {
                onCustomBlur(value);
              }
            }}
            inputClassName={`w-full ${error ? 'border-red-500' : 'border-sgray-300'}`}
          />
        )}
      />
      {error && <span className="text-red-500 text-xs">{error.message}</span>}
    </div>
  );
};

export default CustomPhoneNumberInput;
