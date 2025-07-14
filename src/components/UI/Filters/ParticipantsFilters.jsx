import React from 'react';
import useCatalogs from '@hooks/Dashboard/useCatalogs';
import SearchInput from '../Table/SearchInput';
import SelectFilter from './SelectFilter';
import {HiOutlineX} from 'react-icons/hi';

const ParticipantsFilters = ({
  onSearchAction,
  onApplyFilters,
  onClearFilters,
}) => {
  const {faculties, careers, events} = useCatalogs();
  const [localFilters, setLocalFilters] = React.useState({});

  const handleApplyFilters = (field, selectedOption) => {
    const newFilters = {
      ...localFilters,
      [field]: selectedOption?.value,
    };
    setLocalFilters(newFilters);

    // Crear filterGroups para el sistema complex-filter
    const activeFilters = Object.entries(newFilters)
      .filter(
        ([key, value]) => value !== null && value !== undefined && value !== ''
      )
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    if (Object.keys(activeFilters).length > 0) {
      const filterObject = {
        type: 'complex',
        filterGroups: [
          {
            id: 'general',
            filters: activeFilters,
            operator: 'AND',
          },
        ],
        globalOperator: 'AND',
      };

      onApplyFilters(filterObject);
    } else {
      // Si no hay filtros activos, limpiar
      onClearFilters && onClearFilters();
    }
  };

  return (
    <div className="bg-white rounded-lg px-2 py-4 shadow-sm ring-black ring-opacity-5">
      <div className="md:flex justify-between space-x-4">
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

      {/* Botón de limpiar filtros generales */}
      {onClearFilters && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => {
              setLocalFilters({});
              onClearFilters();
            }}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <HiOutlineX className="mr-1 w-4 h-4" />
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantsFilters;
