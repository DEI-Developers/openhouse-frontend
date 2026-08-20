import React, {useState} from 'react';
import {HiOutlineTrash} from 'react-icons/hi';
import CustomInput from '@components/UI/Form/CustomInput';
import CustomSelect from '@components/UI/Form/CustomSelect';
import CompoundBlockRow from './CompoundBlockRow';

const FIELD_TYPE_OPTIONS = [
  {value: 'TEXT', label: 'Texto'},
  {value: 'EMAIL', label: 'Email'},
  {value: 'TEL', label: 'Telefono'},
  {value: 'TEXTAREA', label: 'Area de texto'},
  {value: 'SELECT', label: 'Seleccion'},
  {value: 'RADIO', label: 'Radio'},
  {value: 'CHECKBOX', label: 'Checkbox'},
  {value: 'EVENT_DAY_REGISTRATION', label: 'Bloque evento (compuesto)'},
];

const ATOMIC_FIELD_TYPES = ['TEXT', 'EMAIL', 'TEL', 'TEXTAREA'];
const FIELDS_WITH_OPTIONS = ['SELECT', 'RADIO', 'CHECKBOX'];

/**
 * FieldRow renders a single field entry in the form builder.
 * When the field type is EVENT_DAY_REGISTRATION, it renders CompoundBlockRow instead.
 */
const FieldRow = ({field, index, register, errors, onRemove, control}) => {
  const [showOptions, setShowOptions] = useState(
    FIELDS_WITH_OPTIONS.includes(field.fieldType)
  );

  const isCompound = field.fieldType === 'EVENT_DAY_REGISTRATION';
  const hasOptions = FIELDS_WITH_OPTIONS.includes(field.fieldType);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setShowOptions(FIELDS_WITH_OPTIONS.includes(newType));
  };

  if (isCompound) {
    return (
      <CompoundBlockRow
        field={field}
        index={index}
        onRemove={onRemove}
      />
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3 bg-white">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-medium text-gray-500">Campo {index + 1}</span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700"
        >
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <CustomSelect
          name={`fields[${index}].fieldType`}
          label="Tipo"
          register={register}
          options={FIELD_TYPE_OPTIONS}
          required
          error={errors?.fields?.[index]?.fieldType}
          containerClassName="w-full"
        />

        <CustomInput
          name={`fields[${index}].fieldKey`}
          label="Key (DB)"
          register={register}
          required
          placeholder="nombreCampo"
          error={errors?.fields?.[index]?.fieldKey}
          containerClassName="w-full"
        />

        <CustomInput
          name={`fields[${index}].label`}
          label="Etiqueta"
          register={register}
          required
          placeholder="Etiqueta del campo"
          error={errors?.fields?.[index]?.label}
          containerClassName="w-full"
        />

        <CustomInput
          name={`fields[${index}].placeholder`}
          label="Placeholder"
          register={register}
          placeholder="Texto de ejemplo"
          error={errors?.fields?.[index]?.placeholder}
          containerClassName="w-full"
        />

        <div className="flex items-end">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register(`fields[${index}].required`)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="ml-2 text-sm text-gray-700">Requerido</span>
          </label>
        </div>
      </div>

      {hasOptions && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="text-xs font-medium text-gray-500 mb-2">Opciones</p>
          <OptionsEditor
            fieldPrefix={`fields[${index}]`}
            register={register}
            errors={errors}
            initialOptions={field.options}
          />
        </div>
      )}
    </div>
  );
};

const OptionsEditor = ({fieldPrefix, register, errors, initialOptions}) => {
  const [options, setOptions] = useState(
    initialOptions && initialOptions.length > 0
      ? initialOptions
      : [{value: '', label: ''}]
  );

  const addOption = () => {
    setOptions([...options, {value: '', label: ''}]);
  };

  const removeOption = (idx) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const updateOption = (idx, field, value) => {
    const updated = [...options];
    updated[idx][field] = value;
    setOptions(updated);
  };

  return (
    <div className="space-y-2">
      {options.map((opt, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <CustomInput
            name={`${fieldPrefix}.options[${idx}].value`}
            label=""
            register={register}
            placeholder="Valor"
            containerClassName="flex-1 mb-0"
          />
          <CustomInput
            name={`${fieldPrefix}.options[${idx}].label`}
            label=""
            register={register}
            placeholder="Etiqueta"
            containerClassName="flex-1 mb-0"
          />
          {options.length > 1 && (
            <button
              type="button"
              onClick={() => removeOption(idx)}
              className="text-red-500 hover:text-red-700"
            >
              <HiOutlineTrash className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addOption}
        className="text-sm text-primary hover:text-secondary"
      >
        + Agregar opcion
      </button>
    </div>
  );
};

export default FieldRow;
