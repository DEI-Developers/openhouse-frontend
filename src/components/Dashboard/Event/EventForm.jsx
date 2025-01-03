import {empty} from '@utils/helpers';
import {useForm} from 'react-hook-form';
import CustomInput from '@components/UI/Form/CustomInput';
import SubmitButton from '@components/UI/Form/SubmitButton';

const EventForm = ({initialData, onCreate, onUpdate, onClose}) => {
  const {formState, register, handleSubmit} = useForm({
    mode: 'onBlur',
    defaultValues: initialData,
  });

  const {errors, isSubmitting} = formState;

  const onSubmit = (data) => {
    console.log(data);
    const mutation = !empty(data.id) ? onUpdate : onCreate;

    mutation.mutate(data);
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
        <div className="flex flex-col lg:flex-row lg:justify-between lg:space-x-4 space-y-2 mt-4">
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
