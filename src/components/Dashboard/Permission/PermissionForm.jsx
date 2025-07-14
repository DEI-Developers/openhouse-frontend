import * as yup from 'yup';
import {empty} from '@utils/helpers';
import {useForm} from 'react-hook-form';
import {useEffect} from 'react';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomInput from '@components/UI/Form/CustomInput';
import SubmitButton from '@components/UI/Form/SubmitButton';
import CustomSelect from '@components/UI/Form/CustomSelect';

const PermissionForm = ({initialData, onCreate, onUpdate, onClose}) => {
  const {formState, register, handleSubmit, reset} = useForm({
    mode: 'onBlur',
    defaultValues: initialData,
    resolver: yupResolver(schema),
  });

  const {errors, isSubmitting} = formState;

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const onSubmit = (data) => {
    const mutation = !empty(data.id) ? onUpdate : onCreate;
    mutation.mutate(data);
  };

  const permissionTypes = [
    {value: 'gestión de usuarios', label: 'Gestión de usuarios'},
    {value: 'gestión de roles', label: 'Gestión de roles'},
    {value: 'gestión de eventos', label: 'Gestión de eventos'},
    {value: 'gestión de participantes', label: 'Gestión de participantes'},
    {value: 'estadísticas', label: 'Estadísticas'},
    {value: 'facultades', label: 'Facultades'},
    {value: 'carreras', label: 'Carreras'},
    {value: 'permisos', label: 'Permisos'},
    {value: 'general', label: 'General'},
  ];

  return (
    <div className="bg-white px-2 pt-2 pb-2 sm:p-2 sm:pb-4">
      <h3 className="text-xl font-bold leading-6 text-primary mb-4">
        {!empty(initialData.id) ? 'Editar permiso' : 'Agregar permiso'}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CustomInput
            required
            type="text"
            name="value"
            label="Valor del permiso"
            placeholder="ej: users.create, roles.read"
            disabled={isSubmitting}
            register={register}
            error={errors.value}
            containerClassName="w-full mb-2"
          />
          <CustomInput
            required
            type="text"
            name="name"
            label="Nombre del permiso"
            placeholder="ej: Crear usuarios, Leer roles"
            disabled={isSubmitting}
            register={register}
            error={errors.name}
            containerClassName="w-full mb-2"
          />
        </div>

        <CustomSelect
          required
          name="type"
          label="Tipo de permiso"
          options={permissionTypes}
          disabled={isSubmitting}
          register={register}
          error={errors.type}
          containerClassName="w-full mb-4"
        />

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
              className="mt-3 inline-flex w-full justify-center items-center rounded-md bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
  value: yup.string().required('Campo obligatorio.'),
  name: yup.string().required('Campo obligatorio.'),
  type: yup.string().required('Campo obligatorio.'),
});

export default PermissionForm;
