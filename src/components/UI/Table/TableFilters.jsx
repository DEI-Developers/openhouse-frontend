import SearchInput from './SearchInput';

const TableFilters = ({searchAction}) => {
  const onSearch = (searchedWord) => {
    searchAction(searchedWord);
  };

  return (
    <div className="bg-gray-50 px-2 py-4 md:flex justify-between">
      <div>
        <p className="hidden">Filtros</p>
      </div>
      <div className="w-full md:w-96">
        <SearchInput onCustomAction={onSearch} />
      </div>
    </div>
  );
};

export default TableFilters;
