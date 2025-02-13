import useCatalogs from '@hooks/Dashboard/useCatalogs';
import SearchInput from '../Table/SearchInput';
import SelectFilter from './SelectFilter';

const ParticipantsFilters = ({onSearchAction, onApplyFilters}) => {
  const {faculties, careers, events} = useCatalogs();

  const handleApplyFilters = (field, selectedOption) => {
    onApplyFilters((prevFilters) => ({
      ...prevFilters,
      [field]: selectedOption?.value,
    }));
  };

  return (
    <div className="bg-white rounded-lg px-2 py-4 shadow ring-1 ring-black ring-opacity-5 md:flex justify-between space-x-4">
      <SearchInput
        onCustomAction={onSearchAction}
        customContainerClassName="w-full md:flex-1"
      />

      <SelectFilter
        isSearchable
        isClearable
        closeMenuOnSelect
        options={events}
        placeholder="Eventos"
        customClassName="w-full md:flex-1"
        onChange={(option) => handleApplyFilters('eventId', option)}
      />

      <SelectFilter
        isSearchable
        isClearable
        closeMenuOnSelect
        options={faculties}
        placeholder="Facultad"
        customClassName="w-full md:flex-1"
        onChange={(option) => handleApplyFilters('facultyId', option)}
      />

      <SelectFilter
        isSearchable
        isClearable
        closeMenuOnSelect
        options={careers}
        placeholder="Carrera"
        customClassName="w-full md:flex-1"
        onChange={(option) => handleApplyFilters('careerId', option)}
      />
    </div>
  );
};

export default ParticipantsFilters;
