import * as yup from 'yup';
import {empty} from '@utils/helpers';
import {useForm} from 'react-hook-form';
import {useEffect} from 'react';
import {Field, Switch} from '@headlessui/react';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomInput from '@components/UI/Form/CustomInput';
import SubmitButton from '@components/UI/Form/SubmitButton';
import CustomToggle from '@components/UI/Form/CustomToggle';
import CustomMultiSelect from '@components/UI/Form/CustomMultiSelect';

const EventForm = ({initialData, onCreate, onUpdate, onClose, faculties}) => {
  const {formState, control, register, watch, setValue, handleSubmit} = useForm(
    {
      mode: 'onBlur',
      defaultValues: initialData,
      resolver: yupResolver(schema),
    }
  );

  const currentFaculties = watch('faculties');
  const currentCareers = watch('careers', initialData.careers);

  const {errors, isSubmitting} = formState;
  const selectableCareers = getCareers(currentFaculties, faculties);

  // Efecto para seleccionar automáticamente todas las carreras cuando se selecciona una facultad
  useEffect(() => {
    if (currentFaculties && currentFaculties.length > 0) {
      // Obtener todas las carreras de las facultades seleccionadas
      const allCareersFromSelectedFaculties = getCareers(currentFaculties, faculties);
      const careerValues = allCareersFromSelectedFaculties.map(career => career.value);
      
      // Solo actualizar si hay carreras disponibles y son diferentes a las actuales
      if (careerValues.length > 0) {
        setValue('careers', careerValues);
      }
    } else {
      // Si no hay facultades seleccionadas, limpiar las carreras
      setValue('careers', []);
    }
  }, [currentFaculties, faculties, setValue]);

  const onSubmit = (data) => {
    const updatedData = {
      ...data,
      faculties: data.faculties?.map((faculty) => faculty.value),
    };
    const mutation = !empty(data.id) ? onUpdate : onCreate;

    mutation.mutate(updatedData);
  };

  return (
    <div className="bg-white px-2 pt-2 pb-2 sm:p-2 sm:pb-4">
      <h3 className="text-xl font-bold leading-6 text-primary mb-4">
        {!empty(initialData.id) ? 'Editar evento' : 'Agregar evento'}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-2 lg:space-y-0 mt-2">
          <CustomInput
            required
            type="text"
            name="name"
            label="Nombre"
            disabled={isSubmitting}
            register={register}
            error={errors.name}
            containerClassName="w-full lg:w-1/2"
          />
          <CustomInput
            required
            type="date"
            name="date"
            label="Fecha"
            disabled={isSubmitting}
            register={register}
            error={errors.date}
            containerClassName="w-full lg:w-1/2"
          />
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-2 lg:space-y-0 mt-2">
          <CustomInput
            required
            type="text"
            name="capacity"
            label="Capacidad"
            disabled={isSubmitting}
            register={register}
            error={errors.capacity}
            containerClassName="w-full lg:w-1/2"
          />

          <CustomToggle
            control={control}
            name="isActive"
            error={errors.isActive}
            label="Activo"
            containerClassName="w-full lg:w-1/3 flex items-end justify-start"
          />
        </div>

        <div className="mt-4">
          <CustomMultiSelect
            isMulti
            isSearchable
            isClearable
            required={false}
            placeholder=""
            control={control}
            closeMenuOnSelect
            name="faculties"
            disabled={isSubmitting}
            error={errors.faculties}
            containerClassName="w-full z-100"
            label="Facultad"
            options={faculties ?? []}
          />
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          {selectableCareers?.map((career) => (
            <CustomSwitch
              key={career.value}
              setValue={setValue}
              value={career.value}
              label={career.name}
              currentPermissions={currentCareers}
            />
          ))}
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
              className="mt-3 inline-flex w-full justify-center items-center rounded-md bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-xs  ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Campo obligatorio.')
    .max(72, 'Máximo 72 caracteres.'),
  date: yup.string().required('Campo obligatorio.'),
  capacity: yup.string().required('Campo obligatorio.'),
});

const getCareers = (selectedFaculties, faculties) => {
  return selectedFaculties?.reduce((acc, faculty) => {
    if (!empty(faculty?.careers)) {
      return [...acc, ...(faculty?.careers ?? [])];
    }

    const cFaculty = faculties.find((f) => f.value == faculty.value);

    return [...acc, ...(cFaculty?.careers ?? [])];
  }, []);
};

const CustomSwitch = ({label, value, setValue, currentPermissions}) => {
  const onChange = () => {
    if (currentPermissions.includes(value)) {
      setValue(
        'careers',
        currentPermissions.filter((permission) => permission !== value)
      );
    } else {
      setValue('careers', [...currentPermissions, value]);
    }
  };

  return (
    <Field className="flex items-center">
      <Switch
        checked={currentPermissions.includes(value)}
        onChange={onChange}
        className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 data-checked:bg-primary"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
        />
      </Switch>
      <span className="ml-3 text-xs font-medium text-gray-900">{label}</span>
    </Field>
  );
};

export default EventForm;
