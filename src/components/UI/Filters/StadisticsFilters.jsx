import useCatalogs from '@hooks/Dashboard/useCatalogs';
import SelectFilter from './SelectFilter';
import { useEffect } from 'react';

const StadisticsFilters = ({onApplyFilters}) => {
  const {events, lastEvent} = useCatalogs();

  const handleApplyFilters = (selectedOption) => {
    onApplyFilters(selectedOption?.value);
  };

  useEffect(() => {
    onApplyFilters(lastEvent?.value);
  }, [lastEvent]);

  return (
    <div className="bg-white rounded-lg px-2 py-4 shadow ring-1 ring-black ring-opacity-5 md:flex justify-between space-x-4">
      <SelectFilter
        isSearchable
        isClearable
        closeMenuOnSelect
        options={events}
        placeholder="Eventos"
        setDefaultValue={lastEvent}
        customClassName="w-full md:w-96"
        onChange={handleApplyFilters}
      />
    </div>
  );
};

export default StadisticsFilters;
