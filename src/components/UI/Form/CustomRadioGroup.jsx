const CustomRadioGroup = ({
  name,
  label,
  register,
  required = false,
  options = [],
  containerClassName = '',
}) => {
  return (
    <fieldset className={containerClassName}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
          {...(required && {'aria-required': true})}
        >
          {label}
        </label>
      )}
      <div className="mt-4 space-y-6 sm:flex sm:items-center sm:space-x-6 sm:space-y-0">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              {...register(name)}
              id={`${name}-${option.value}`}
              value={option.value}
              type="radio"
              className="relative min-w-4 size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="ml-3 block text-sm/6 font-medium text-gray-900 cursor-pointer text-ellipsis overflow-hidden"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default CustomRadioGroup;
