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
  onBlur,
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
        render={({field: {onChange, value}}) => (
          <PhoneInput
            defaultCountry="sv"
            value={value}
            onChange={onChange}
            inputClassName="w-full"
            onBlur={onBlur}
          />
        )}
      />
      {error && <span className="text-red-500 text-xs">{error.message}</span>}
    </div>
  );
};

export default CustomPhoneNumberInput;
