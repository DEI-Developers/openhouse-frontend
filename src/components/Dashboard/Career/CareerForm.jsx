import * as yup from 'yup';
import { empty } from '@utils/helpers';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '@components/UI/Form/CustomInput';
import SubmitButton from '@components/UI/Form/SubmitButton';

const CareerForm = ({ initialData, onCreate, onUpdate, onClose }) => {
  const { formState, register, handleSubmit, watch } = useForm({
    mode: 'onBlur',
    defaultValues: initialData,
    resolver: yupResolver(schema),
  });

  const { errors, isSubmitting } = formState;
  const watchName = watch('name', initialData.name || '');
  const watchDescription = watch('description', initialData.description || '');

  const onSubmit = (data) => {
    const updatedData = {
      ...data,
      id: data.id,
    };

    const mutation = !empty(data.id) ? onUpdate : onCreate;
    mutation.mutate(updatedData);
  };

  return (
    <div className="bg-white px-2 pt-2 pb-2 sm:p-2 sm:pb-4">
      <h3 className="text-xl font-bold leading-6 text-primary mb-4">
        {!empty(initialData.id) ? 'Editar carrera' : 'Agregar carrera'}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4">
          <CustomInput
            required
            type="text"
            name="name"
            label="Nombre de la carrera"
            disabled={isSubmitting}
            register={register}
            error={errors.name}
            containerClassName="w-full"
            maxLength={24}
          />
          <div className="mt-1 text-sm text-gray-500 text-right">
            {watchName.length}/24
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            rows={3}
            maxLength={72}
            disabled={isSubmitting}
            {...register('description')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="mt-1 text-sm text-right">
            <span className={errors.description ? 'text-red-500' : 'text-gray-500'}>
              {watchDescription.length}/72
            </span>
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-end lg:space-x-4 space-y-2 mt-6">
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

const schema = yup.object().shape({
  name: yup.string().required('Campo obligatorio.').max(24, 'Máximo 24 caracteres.'),
  description: yup.string().required('Campo obligatorio.').max(72, 'Máximo 72 caracteres.'),
});

export default CareerForm;