import * as yup from 'yup';
import { empty } from '@utils/helpers';
import { useForm } from 'react-hook-form';
import { Field, Switch } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '@components/UI/Form/CustomInput';
import SubmitButton from '@components/UI/Form/SubmitButton';

const FacultyForm = ({ initialData, onCreate, onUpdate, onClose, careers }) => {
  const { formState, control, register, watch, setValue, handleSubmit } = useForm({
    mode: 'onBlur',
    defaultValues: initialData,
    resolver: yupResolver(schema),
  });

  const currentCareers = watch('careers', initialData.careers);
  const { errors, isSubmitting } = formState;

  const onSubmit = (data) => {
    const updatedData = {
      ...data,
      id: data.id,
      careers: data.careers || [],
    };

    const mutation = !empty(data.id) ? onUpdate : onCreate;
    mutation.mutate(updatedData);
  };

  return (
    <div className="bg-white px-2 pt-2 pb-2 sm:p-2 sm:pb-4">
      <h3 className="text-xl font-bold leading-6 text-primary mb-4">
        {!empty(initialData.id) ? 'Editar facultad' : 'Agregar facultad'}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4">
          <CustomInput
            required
            type="text"
            name="name"
            label="Nombre de la facultad"
            disabled={isSubmitting}
            register={register}
            error={errors.name}
            containerClassName="w-full"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carreras
          </label>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {careers?.map((career) => (
              <CustomSwitch
                key={career.value}
                setValue={setValue}
                value={career.value}
                label={career.name}
                currentPermissions={currentCareers}
              />
            ))}
          </div>
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
  name: yup.string().required('Campo obligatorio.'),
});

const CustomSwitch = ({ label, value, setValue, currentPermissions }) => {
  // Normalizar currentPermissions para manejar tanto strings como objetos
  const normalizedPermissions = currentPermissions?.map(permission => 
    typeof permission === 'string' ? permission : permission.value || permission.id
  ) || [];
  
  const isChecked = normalizedPermissions.includes(value);
  
  const onChange = () => {
    if (isChecked) {
      setValue(
        'careers',
        normalizedPermissions.filter((permission) => permission !== value)
      );
    } else {
      setValue('careers', [...normalizedPermissions, value]);
    }
  };

  return (
    <Field className="flex items-center">
      <Switch
        checked={isChecked}
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

export default FacultyForm;