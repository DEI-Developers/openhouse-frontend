import React from 'react';
import {HiOutlineTrash} from 'react-icons/hi';
import CustomInput from '@components/UI/Form/CustomInput';

/**
 * Sub-fields that compose the EVENT_DAY_REGISTRATION compound block.
 * These must match the backend EVENT_DAY_REGISTRATION_SUBFIELDS constant.
 */
export const EVENT_DAY_REGISTRATION_SUBFIELDS = [
  {key: 'faculty', label: 'Facultad', placeholder: 'Selecciona tu facultad', required: true},
  {key: 'career', label: 'Carrera', placeholder: 'Selecciona tu carrera', required: true},
  {key: 'event', label: 'Evento', placeholder: 'Selecciona el evento', required: true},
  {key: 'eventDay', label: 'Dia del Evento', placeholder: 'Selecciona el dia', required: true},
];

/**
 * CompoundBlockRow renders a locked EVENT_DAY_REGISTRATION block.
 * Sub-fields are expanded as editable rows so admin can customize their label/placeholder.
 */
const CompoundBlockRow = ({field, index, register, errors, onRemove}) => {
  // Initialize subFields from field if present, otherwise use defaults
  const subFields = (field.subFields && field.subFields.length > 0)
    ? field.subFields
    : EVENT_DAY_REGISTRATION_SUBFIELDS;

  return (
    <div className="border border-purple-200 rounded-lg p-4 bg-purple-50 mb-3">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Bloque compuesto (Evento)
          </span>
          <span className="text-sm font-medium text-gray-900">{field.label}</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700"
        >
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      </div>

      <div className="pl-4 border-l-2 border-purple-300 space-y-3">
        <p className="text-xs text-purple-700 font-medium">Sub-campos incluidos (editables):</p>
        {subFields.map((sub, subIdx) => (
          <div
            key={sub.key}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white rounded p-3"
          >
            <CustomInput
              name={`fields[${index}].subFields[${subIdx}].label`}
              label={`Etiqueta — ${sub.key}`}
              register={register}
              required
              placeholder={`Etiqueta para ${sub.key}`}
              error={errors?.fields?.[index]?.subFields?.[subIdx]?.label}
              containerClassName="w-full"
            />
            <CustomInput
              name={`fields[${index}].subFields[${subIdx}].placeholder`}
              label={`Placeholder — ${sub.key}`}
              register={register}
              placeholder={`Placeholder para ${sub.key}`}
              error={errors?.fields?.[index]?.subFields?.[subIdx]?.placeholder}
              containerClassName="w-full"
            />
            <input
              type="hidden"
              {...register(`fields[${index}].subFields[${subIdx}].key`)}
              value={sub.key}
            />
            <input
              type="hidden"
              {...register(`fields[${index}].subFields[${subIdx}].required`)}
              value={String(sub.required)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompoundBlockRow;
