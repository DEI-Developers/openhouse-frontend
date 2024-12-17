import {useState} from 'react';
import {empty} from '@utils/helpers';
import {BsSearch} from 'react-icons/bs';
import {IoCloseCircle} from 'react-icons/io5';

const SearchInput = ({onCustomAction}) => {
  const [value, setValue] = useState('');

  const onClear = () => {
    setValue('');
    onCustomAction('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onCustomAction(value);
    }
  };

  return (
    <div className="flex rounded-md shadow-sm">
      <div className="relative flex flex-grow items-stretch focus-within:z-10">
        <input
          type="text"
          value={value}
          placeholder="Buscar..."
          onKeyDown={handleKeyDown}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full text-sm rounded-none rounded-l-md border-0 py-1.5 px-4 text-gray-600 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary"
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
      <button
        type="button"
        onClick={() => onCustomAction(value)}
        className="relative -ml-px rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:ring-primary"
      >
        <BsSearch aria-hidden="true" className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  );
};

export default SearchInput;
