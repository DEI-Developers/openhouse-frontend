const CustomSelect = ({
  label,
  name,
  error,
  register,
  options = [],
  required = false,
  containerClassName = '',
  selectClassName = 'appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-xs',
  ...rest
}) => (
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
      <select
        name={name}
        className={`${selectClassName} ${error ? 'border-red-500' : ''} disabled:cursor-not-allowed focus:outline-hidden focus:ring-primary focus:border-primary sm:text-sm`}
        {...(register && register(name, {required}))}
        {...rest}
      >
        <option value="">Seleccionar...</option>
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
    {error && <span className="text-red-500 text-xs">{error.message}</span>}
  </div>
);

export default CustomSelect;
