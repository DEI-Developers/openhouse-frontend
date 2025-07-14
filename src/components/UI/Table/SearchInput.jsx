import {useState} from 'react';
import {empty} from '@utils/helpers';
import {IoCloseCircle} from 'react-icons/io5';

const SearchInput = ({onCustomAction, customContainerClassName}) => {
  const [value, setValue] = useState('');

  const onClear = () => {
    setValue('');
    onCustomAction('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onCustomAction(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCustomAction(value);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex rounded-md shadow-xs ${customContainerClassName}`}>
      <div className="relative flex grow items-stretch focus-within:z-10">
        <input
          type="text"
          value={value}
          placeholder="Buscar..."
          onKeyDown={handleKeyDown}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full text-sm rounded-md border-0 py-1.5 px-4 bg-background text-primary  ring-inset ring-gray-300 placeholder:text-gray-400 focus: focus:ring-inset focus:ring-primary"
        />
        {!empty(value) && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <IoCloseCircle
              aria-hidden="true"
              className="h-6 w-6 text-gray-400"
            />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchInput;
