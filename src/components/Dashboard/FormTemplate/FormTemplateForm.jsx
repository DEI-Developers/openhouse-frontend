import * as yup from 'yup';
import {empty} from '@utils/helpers';
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useFieldArray} from 'react-hook-form';
import CustomInput from '@components/UI/Form/CustomInput';
import CustomToggle from '@components/UI/Form/CustomToggle';
import SubmitButton from '@components/UI/Form/SubmitButton';
import FieldRow from './FieldRow';
import CompoundBlockRow from './CompoundBlockRow';
import {HiPlus} from 'react-icons/hi';

const FIELD_TYPES = {
  TEXT: 'TEXT',
  EMAIL: 'EMAIL',
  TEL: 'TEL',
  TEXTAREA: 'TEXTAREA',
  SELECT: 'SELECT',
  RADIO: 'RADIO',
  CHECKBOX: 'CHECKBOX',
  EVENT_DAY_REGISTRATION: 'EVENT_DAY_REGISTRATION',
};

const ATOMIC_FIELD_TYPES = Object.values(FIELD_TYPES).filter(
  (t) => t !== FIELD_TYPES.EVENT_DAY_REGISTRATION
);

const schema = yup.object().shape({
  name: yup.string().required('Campo obligatorio.').trim(),
  description: yup.string().optional().trim(),
  isActive: yup.boolean().default(true),
  fields: yup.array().of(
    yup.object().shape({
      fieldKey: yup.string().required(),
      fieldType: yup.string().required('Tipo es requerido'),
      label: yup.string().required('Etiqueta es requerida').trim(),
      placeholder: yup.string().optional().trim(),
      required: yup.boolean().default(false),
      options: yup.array().of(
        yup.object().shape({
          value: yup.string().required('Valor requerido'),
          label: yup.string().required('Etiqueta requerida'),
        })
      ).optional(),
      subFields: yup.array().of(
        yup.object().shape({
          key: yup.string().required(),
          label: yup.string().required('Etiqueta es requerida'),
          placeholder: yup.string().optional(),
          required: yup.boolean().default(false),
        })
      ).optional(),
      order: yup.number().default(0),
    })
  ),
});

const FormTemplateForm = ({initialData, onCreate, onUpdate, onClose}) => {
  const {
    formState: {errors, isSubmitting},
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    control,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: initialData.name ?? '',
      description: initialData.description ?? '',
      isActive: initialData.isActive ?? true,
      fields: initialData.fields ?? [],
    },
    resolver: yupResolver(schema),
  });

  // Reset form when initialData changes (e.g., when opening edit modal)
  useEffect(() => {
    reset({
      name: initialData.name ?? '',
      description: initialData.description ?? '',
      isActive: initialData.isActive ?? true,
      fields: initialData.fields ?? [],
    });
  }, [initialData, reset]);

  const onValidSubmit = (data) => {
    onSubmit(data);
  };

  const onInvalidSubmit = (errors) => {
    console.log('handleSubmit INVALID:', JSON.stringify(errors, null, 2));
  };

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'fields',
  });

  const watchedFields = watch('fields');

  const onSubmit = (data) => {
    // Ensure each field has a fieldKey (use user-provided key, fallback to slug from label)
    const processedFields = data.fields.map((field, idx) => ({
      ...field,
      fieldKey: field.fieldKey?.trim() || field.label?.toLowerCase().replace(/\s+/g, '_') || `field_${idx}`,
      order: idx,
    }));

    // Only use onUpdate if id is a valid MongoDB ObjectId string (24 hex chars)
    const idStr = initialData.id;
    const isValidMongoId = typeof idStr === 'string' && /^[a-f0-9]{24}$/i.test(idStr);

    if (isValidMongoId) {
      const payload = {
        ...data,
        id: idStr,
        fields: processedFields,
      };
      onUpdate.mutate(payload);
    } else {
      const payload = {
        ...data,
        fields: processedFields,
      };
      onCreate.mutate(payload);
    }
  };

  const addAtomicField = (fieldType) => {
    const defaultLabels = {
      TEXT: 'Nuevo campo de texto',
      EMAIL: 'Email',
      TEL: 'Telefono',
      TEXTAREA: 'Area de texto',
      SELECT: 'Seleccion',
      RADIO: 'Radio',
      CHECKBOX: 'Checkbox',
    };

    append({
      fieldKey: crypto.randomUUID(),
      fieldType,
      label: defaultLabels[fieldType] || 'Nuevo campo',
      placeholder: '',
      required: false,
      options: fieldType === 'SELECT' || fieldType === 'RADIO' || fieldType === 'CHECKBOX'
        ? [{value: '', label: ''}]
        : undefined,
      order: fields.length,
    });
  };

  const addCompoundField = () => {
    append({
      fieldKey: 'eventDayRegistration',
      fieldType: FIELD_TYPES.EVENT_DAY_REGISTRATION,
      label: 'Inscripcion a Evento',
      placeholder: '',
      required: true,
      order: fields.length,
      subFields: [
        {key: 'faculty', label: 'Facultad', placeholder: 'Selecciona tu facultad', required: true},
        {key: 'career', label: 'Carrera', placeholder: 'Selecciona tu carrera', required: true},
        {key: 'event', label: 'Evento', placeholder: 'Selecciona el evento', required: true},
        {key: 'eventDay', label: 'Dia del Evento', placeholder: 'Selecciona el dia', required: true},
      ],
    });
  };

  return (
    <div className="bg-white px-2 pt-2 pb-2 sm:p-2 sm:pb-4">
      <h3 className="text-xl font-bold leading-6 text-primary mb-4">
        {!empty(initialData.id) ? 'Editar plantilla' : 'Agregar plantilla'}
      </h3>

      <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <CustomInput
            required
            type="text"
            name="name"
            label="Nombre"
            disabled={isSubmitting}
            register={register}
            error={errors.name}
            containerClassName="w-full"
          />

          <CustomInput
            type="text"
            name="description"
            label="Descripcion"
            disabled={isSubmitting}
            register={register}
            error={errors.description}
            containerClassName="w-full"
          />

          <div className="flex items-center">
            <CustomToggle
              name="isActive"
              label="Activo"
              control={control}
              containerClassName="flex items-center"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-gray-700">Campos de la plantilla</h4>
          </div>

          {/* Field palette */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Agregar campo:</p>
            <div className="flex flex-wrap gap-2">
              {ATOMIC_FIELD_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addAtomicField(type)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <HiPlus className="w-3 h-3 mr-1" />
                  {type.replace('_', ' ').toLowerCase()}
                </button>
              ))}
              <button
                type="button"
                onClick={addCompoundField}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200"
              >
                <HiPlus className="w-3 h-3 mr-1" />
                Evento (compuesto)
              </button>
            </div>
          </div>

          {/* Field list */}
          <div className="space-y-2">
            {fields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No hay campos agregados.</p>
                <p className="text-xs">Usa los botones de arriba para agregar campos.</p>
              </div>
            )}

            {fields.map((field, index) => {
              const isCompound = field.fieldType === 'EVENT_DAY_REGISTRATION';
              if (isCompound) {
                return (
                  <CompoundBlockRow
                    key={field.id || index}
                    field={watchedFields[index] || field}
                    index={index}
                    register={register}
                    errors={errors}
                    onRemove={remove}
                  />
                );
              }
              return (
                <FieldRow
                  key={field.id || index}
                  field={watchedFields[index] || field}
                  index={index}
                  register={register}
                  errors={errors}
                  onRemove={remove}
                  control={control}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-end lg:space-x-4 space-y-2 mt-4">
          <div className="sm:flex sm:flex-row-reverse">
            <SubmitButton
              type="submit"
              label="Guardar"
              loading={onCreate.isPending || onUpdate.isPending}
              className="inline-flex w-full justify-center items-center rounded-md bg-primary px-10 py-3 text-sm font-semibold text-white shadow-xs hover:bg-secondary sm:ml-3 sm:w-auto"
            />
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center items-center rounded-md bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-xs ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormTemplateForm;
