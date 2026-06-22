import SearchInput from '../Table/SearchInput';

const TableFilters = ({onSearchAction, onApplyFilters}) => {
  return (
    <div className="bg-white rounded-lg px-2 py-4 shadow-sm ring-black ring-opacity-5 md:flex justify-between space-x-4">
      <SearchInput
        onCustomAction={onSearchAction}
        customContainerClassName="w-full md:flex-1"
      />
    </div>
  );
};

export default TableFilters;
