import React, {useState, useEffect} from 'react';
import {HiOutlinePlus, HiOutlineTrash} from 'react-icons/hi';
import {BiSearch, BiTrash} from 'react-icons/bi';
import SelectFilter from './SelectFilter';

const AdvancedParticipantsFilters = ({
  onApplyAdvancedFilters,
  onClearFilters,
  currentFilters = null,
}) => {
  const [filterGroups, setFilterGroups] = useState([
    {
      id: Date.now(),
      filters: {},
      operator: 'AND',
      selectedField: '',
    },
  ]);
  const [globalOperator, setGlobalOperator] = useState('AND');
  const [generalFilters, setGeneralFilters] = useState({
    event: null,
    faculty: null,
    career: null,
  });

  // Campos disponibles para filtrado
  const filterFields = [
    {value: 'name', label: 'Nombre'},
    {value: 'email', label: 'Email'},
    {value: 'phoneNumber', label: 'Teléfono'},
    {value: 'institute', label: 'Instituto'},
  ];

  const operators = [
    {value: 'AND', label: 'Y (AND)'},
    {value: 'OR', label: 'O (OR)'},
  ];

  const addFilterGroup = () => {
    setFilterGroups((prev) => [
      ...prev,
      {
        id: Date.now(),
        filters: {},
        operator: 'AND',
        selectedField: '',
      },
    ]);
  };

  const removeFilterGroup = (groupId) => {
    if (filterGroups.length > 1) {
      setFilterGroups((prev) => prev.filter((group) => group.id !== groupId));
    }
  };

  const updateFilterGroup = (groupId, field, value) => {
    setFilterGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          if (field === 'operator') {
            return {...group, operator: value};
          } else if (field === 'selectedField') {
            return {...group, selectedField: value, filters: {}};
          } else {
            const newFilters = {...group.filters};
            if (value && value.trim() !== '') {
              newFilters[field] = value;
            } else {
              delete newFilters[field];
            }
            return {...group, filters: newFilters};
          }
        }
        return group;
      })
    );
  };

  const updateGeneralFilter = (field, value) => {
    setGeneralFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    // Filtrado complejo con filtros generales
    const validGroups = filterGroups.filter(
      (group) => Object.keys(group.filters).length > 0
    );

    // Agregar filtros generales como un grupo adicional si existen
    const activeGeneralFilters = Object.entries(generalFilters)
      .filter(([key, value]) => value !== null && value !== '')
      .reduce((acc, [key, value]) => {
        // Mapear los nombres de campos a los esperados por el backend
        const fieldMapping = {
          event: 'eventId',
          faculty: 'facultyId',
          career: 'careerId',
        };
        acc[fieldMapping[key] || key] = value;
        return acc;
      }, {});

    const allGroups = [...validGroups];

    if (Object.keys(activeGeneralFilters).length > 0) {
      allGroups.unshift({
        id: 0,
        filters: activeGeneralFilters,
        operator: 'AND',
        selectedField: '',
      });
    }

    if (allGroups.length > 0) {
      onApplyAdvancedFilters({
        type: 'complex',
        filterGroups: allGroups,
        globalOperator,
      });
    } else {
      // Si no hay filtros activos, limpiar
      onClearFilters();
    }
  };

  const handleClearFilters = () => {
    setFilterGroups([
      {
        id: Date.now(),
        filters: {},
        operator: 'AND',
        selectedField: '',
      },
    ]);
    setGlobalOperator('AND');
    setGeneralFilters({
      event: null,
      faculty: null,
      career: null,
    });
    onClearFilters();
  };

  // Sincronizar con filtros externos
  useEffect(() => {
    if (!currentFilters) {
      // Si no hay filtros externos, resetear el estado interno
      setFilterGroups([
        {
          id: Date.now(),
          filters: {},
          operator: 'AND',
          selectedField: '',
        },
      ]);
      setGlobalOperator('AND');
      setGeneralFilters({
        event: null,
        faculty: null,
        career: null,
      });
    }
  }, [currentFilters]);

  const hasActiveFilters =
    filterGroups.some((group) => Object.keys(group.filters).length > 0) ||
    Object.values(generalFilters).some(
      (value) => value !== null && value !== ''
    );

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Filtros Complejos</h3>

        <div className="flex space-x-2">
          <button
            onClick={handleClearFilters}
            className="px-3 flex items-center justify-center py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <BiTrash className="md:mr-2" />
            <span className="hidden md:inline">Limpiar</span>
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-secondary transition-colors"
          >
            <BiSearch className="md:mr-2" />
            <span className="hidden md:inline">Buscar</span>
          </button>
        </div>
      </div>

      {/* Operador global */}
      {filterGroups.length > 1 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            Operador global entre grupos:
          </span>
          <SelectFilter
            setDefaultValue={operators.find(
              (op) => op.value === globalOperator
            )}
            options={operators}
            onChange={(option) => setGlobalOperator(option?.value || 'AND')}
            customClassName="w-32 h-10"
            placeholder="Operador"
          />
        </div>
      )}

      {/* Grupos de filtros */}
      <div className="space-y-6">
        {filterGroups.map((group, groupIndex) => (
          <div key={group.id}>
            {/* Operador entre grupos */}
            {groupIndex > 0 && (
              <div className="flex justify-center mb-4">
                <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                  {globalOperator}
                </span>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Grupo {groupIndex + 1}
                </span>

                <div className="flex items-center space-x-2">
                  {filterGroups.length > 1 && (
                    <button
                      onClick={() => removeFilterGroup(group.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Selección de campo */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Campo a filtrar
                </label>
                <SelectFilter
                  setDefaultValue={filterFields.find(
                    (field) => field.value === group.selectedField
                  )}
                  options={filterFields}
                  onChange={(option) =>
                    updateFilterGroup(
                      group.id,
                      'selectedField',
                      option?.value || ''
                    )
                  }
                  placeholder="Seleccionar campo"
                  customClassName="h-10"
                />
              </div>

              {/* Campo de filtro */}
              {group.selectedField && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-3">
                    Valor a buscar
                  </label>
                  <input
                    type="text"
                    value={group.filters[group.selectedField] || ''}
                    onChange={(e) =>
                      updateFilterGroup(
                        group.id,
                        group.selectedField,
                        e.target.value
                      )
                    }
                    placeholder={`Buscar por ${filterFields.find((f) => f.value === group.selectedField)?.label.toLowerCase()}...`}
                    className="block w-full h-12 px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botón para agregar grupo */}
      <button
        onClick={addFilterGroup}
        className="flex items-center px-4 py-3 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
      >
        <HiOutlinePlus className="mr-2" />
        Agregar grupo de filtros
      </button>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
          <span className="font-medium">Filtros activos:</span>
          <span className="ml-2">
            {Object.values(generalFilters).filter((v) => v !== null && v !== '')
              .length > 0 && 'Filtros generales, '}
            {filterGroups.reduce(
              (count, group) => count + Object.keys(group.filters).length,
              0
            )}{' '}
            filtros de grupos
          </span>
        </div>
      )}
    </div>
  );
};

export default AdvancedParticipantsFilters;
