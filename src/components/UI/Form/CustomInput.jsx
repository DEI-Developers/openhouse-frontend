const CustomInput = ({
  label,
  name,
  error,
  register,
  required = false,
  containerClassName = '',
  inputClassName = 'appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm',
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
      <input
        name={name}
        className={`${inputClassName} ${error ? 'border-red-500' : ''} disabled:cursor-not-allowed placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
        {...(register && register(name, {required}))}
        {...rest}
        onCopy={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
      />
    </div>
    {error && <span className="text-red-500 text-xs">{error.message}</span>}
  </div>
);

export default CustomInput;
