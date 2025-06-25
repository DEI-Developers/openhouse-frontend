import * as yup from 'yup';
import {useEffect} from 'react';
import {empty} from '@utils/helpers';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomInput from '@components/UI/Form/CustomInput';
import CustomToggle from '@components/UI/Form/CustomToggle';
import SubmitButton from '@components/UI/Form/SubmitButton';
import CustomMultiSelect from '@components/UI/Form/CustomMultiSelect';
import CustomInputPassword from '@components/UI/Form/CustomInputPassword';

const UserForm = ({
  initialData,
  onCreate,
  onUpdate,
  onClose,
  roles,
  faculties,
}) => {
  const {control, formState, register, watch, setValue, handleSubmit} = useForm(
    {
      mode: 'onBlur',
      defaultValues: initialData,
      resolver: yupResolver(getCurrentSchema(empty(initialData.id))),
    }
  );

  const {errors, isSubmitting} = formState;
  const currentFaculty = watch('faculty');

  const onSubmit = (data) => {
    const updatedData = {
      ...data,
      facultyId: data.faculty?.value,
      roleId: data.role?.value,
      careerId: data.career?.value,
      role: undefined,
      faculty: undefined,
      career: undefined,
      password: empty(data.id) ? data.password : undefined,
    };

    const mutation = !empty(data.id) ? onUpdate : onCreate;

    mutation.mutate(updatedData);
  };

  useEffect(() => {
    if (empty(currentFaculty)) return;

    if (empty(currentFaculty?.careers)) {
      const updatedFaculty = faculties?.find(
        (f) => f.value === currentFaculty?.value
      );
      setValue('faculty', updatedFaculty);
    }
  }, [currentFaculty]);

  return (
    <div className="bg-white px-2 pt-2 pb-2 sm:p-2 sm:pb-4">
      <h3 className="text-xl font-bold leading-6 text-primary mb-4">
        {!empty(initialData.id) ? 'Editar usuario' : 'Agregar usuario'}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-2 lg:space-y-0 mt-4">
          <CustomMultiSelect
            isSearchable
            isClearable
            required={false}
            placeholder=""
            control={control}
            closeMenuOnSelect
            name="faculty"
            disabled={isSubmitting}
            error={errors.faculty}
            containerClassName="w-full lg:w-1/2 z-20"
            label="Facultad"
            options={faculties ?? []}
          />
          <CustomMultiSelect
            isSearchable
            isClearable
            required={false}
            placeholder=""
            control={control}
            closeMenuOnSelect
            name="career"
            disabled={isSubmitting}
            error={errors.career}
            containerClassName="w-full lg:w-1/2 z-30 max-h-24"
            label="Carrera"
            options={currentFaculty?.careers ?? []}
          />
        </div>

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
          <CustomMultiSelect
            required
            isSearchable
            isClearable
            placeholder=""
            control={control}
            closeMenuOnSelect
            name="role"
            disabled={isSubmitting}
            error={errors.role}
            containerClassName="w-full lg:w-1/2 z-20"
            label="Rol"
            options={roles ?? []}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-2 lg:space-y-0 mt-4">
          <CustomInput
            required
            type="text"
            name="email"
            label="Correo electrónico"
            disabled={isSubmitting}
            register={register}
            error={errors.email}
            containerClassName="w-full lg:w-1/2"
          />

          <CustomInputPassword
            required={empty(initialData.id)}
            label="Contraseña"
            errors={errors}
            register={register}
            isSubmitting={isSubmitting}
            containerClassName="w-full lg:w-1/2"
          />
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:space-x-4 space-y-2 mt-4">
          <CustomToggle
            control={control}
            name="isActive"
            error={errors.isActive}
            label="Activo"
            containerClassName="w-full lg:w-1/3"
          />
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

const getCurrentSchema = (requirePassword) => {
  return yup.object().shape({
    name: yup.string().required('Campo obligatorio.'),
    email: yup
      .string()
      .required('Campo obligatorio.')
      .email('Dirección de correo no válida.'),
    password: requirePassword
      ? yup
          .string()
          .required('Campo obligatorio.')
          .min(6, 'Mínimo 6 caracteres.')
      : null,
    role: yup.object().nullable().required('Campo obligatorio.'),
  });
};

export default UserForm;
