import {empty} from '@utils/helpers';
import {useForm} from 'react-hook-form';
import CustomInput from '@components/UI/Form/CustomInput';
import SubmitButton from '@components/UI/Form/SubmitButton';
import CustomToggle from '@components/UI/Form/CustomToggle';
import CustomMultiSelect from '@components/UI/Form/CustomMultiSelect';

const EventForm = ({initialData, onCreate, onUpdate, onClose, faculties}) => {
  const {formState, control, register, handleSubmit} = useForm({
    mode: 'onBlur',
    defaultValues: initialData,
  });

  const {errors, isSubmitting} = formState;

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
            type="text"
            name="capacity"
            label="Capacidad"
            disabled={isSubmitting}
            register={register}
            error={errors.capacity}
            containerClassName="w-full lg:w-1/2"
          />
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-2 lg:space-y-0 mt-2">
          <CustomInput
            required
            type="date"
            name="startDate"
            label="Fecha de inicio"
            disabled={isSubmitting}
            register={register}
            error={errors.startDate}
            containerClassName="w-full lg:w-1/2"
          />
          <CustomInput
            required
            type="date"
            name="endDate"
            label="Fecha de fin"
            disabled={isSubmitting}
            register={register}
            error={errors.endDate}
            containerClassName="w-full lg:w-1/2"
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
            containerClassName="w-full z-20"
            label="Facultad"
            options={faculties ?? []}
          />
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:space-x-4 space-y-2 mt-4">
          <CustomToggle
            control={control}
            name="enabled"
            error={errors.enabled}
            label="Activo"
            containerClassName="w-full lg:w-1/3"
          />
          <div className="sm:flex sm:flex-row-reverse">
            <SubmitButton
              type="submit"
              label="Guardar"
              loading={onCreate.isPending || onUpdate.isPending}
              className="inline-flex w-full justify-center items-center rounded-md bg-primary px-10 py-3 text-sm font-semibold text-white shadow-sm hover:bg-secondary sm:ml-3 sm:w-auto"
            />
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center items-center rounded-md bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
