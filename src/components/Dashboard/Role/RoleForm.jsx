import * as yup from 'yup';
import {empty} from '@utils/helpers';
import {useForm} from 'react-hook-form';
import {Field, Switch} from '@headlessui/react';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomInput from '@components/UI/Form/CustomInput';
import SubmitButton from '@components/UI/Form/SubmitButton';

const RoleForm = ({initialData, permissions, onCreate, onUpdate, onClose}) => {
  const {formState, register, watch, setValue, handleSubmit} = useForm({
    mode: 'onBlur',
    defaultValues: initialData,
    resolver: yupResolver(schema),
  });

  const {errors, isSubmitting} = formState;
  const currentPermissions = watch('permissions', initialData.permissions);

  const onSubmit = (data) => {
    const mutation = !empty(data.id) ? onUpdate : onCreate;

    mutation.mutate(data);
  };

  return (
    <div className="bg-white px-2 pt-2 pb-2 sm:p-2 sm:pb-4">
      <h3 className="text-xl font-bold leading-6 text-primary mb-4">
        {!empty(initialData.id) ? 'Editar rol' : 'Agregar rol'}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          required
          type="text"
          name="name"
          label="Nombre"
          disabled={isSubmitting}
          register={register}
          error={errors.name}
          containerClassName="w-full mb-2"
        />
        <CustomInput
          required
          type="text"
          name="description"
          label="Descripción"
          disabled={isSubmitting}
          register={register}
          error={errors.description}
          containerClassName="w-full mb-4"
        />

        <div className="grid lg:grid-cols-2 gap-6">
          {getGroupedPermissions(permissions).map((group) => (
            <div
              key={group.type}
              className="border border-gray-200 rounded-lg p-4"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-3 capitalize">
                {group.type.replace('_', ' ')}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {group.permissions.map((permission) => (
                  <CustomSwitch
                    key={permission.value}
                    setValue={setValue}
                    value={permission.value}
                    label={permission.name}
                    currentPermissions={currentPermissions}
                  />
                ))}
              </div>
            </div>
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

const CustomSwitch = ({label, value, setValue, currentPermissions}) => {
  const onChange = () => {
    if (currentPermissions.includes(value)) {
      setValue(
        'permissions',
        currentPermissions.filter((permission) => permission !== value)
      );
    } else {
      setValue('permissions', [...currentPermissions, value]);
    }
  };

  return (
    <Field className="flex items-center">
      <Switch
        checked={currentPermissions.includes(value)}
        onChange={onChange}
        className="group relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 data-checked:bg-primary"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-4"
        />
      </Switch>
      <span className="ml-2 text-xs font-medium text-gray-900">{label}</span>
    </Field>
  );
};

const getGroupedPermissions = (permissions) => {
  const groups = {};

  permissions.forEach((permission) => {
    let type = 'general';

    if (
      permission.value.includes('users') ||
      permission.value.includes('user')
    ) {
      type = 'gestión de usuarios';
    } else if (
      permission.value.includes('roles') ||
      permission.value.includes('role')
    ) {
      type = 'gestión de roles';
    } else if (
      permission.value.includes('events') ||
      permission.value.includes('event')
    ) {
      type = 'gestión de eventos';
    } else if (
      permission.value.includes('participants') ||
      permission.value.includes('participant')
    ) {
      type = 'gestión de participantes';
    } else if (
      permission.value.includes('statistics') ||
      permission.value.includes('statistic')
    ) {
      type = 'estadísticas';
    } else if (
      permission.value.includes('faculties') ||
      permission.value.includes('faculty')
    ) {
      type = 'Facultades';
    } else if (
      permission.value.includes('careers') ||
      permission.value.includes('career')
    ) {
      type = 'Carreras';
    } else if (
      permission.value.includes('permissions') ||
      permission.value.includes('permission')
    ) {
      type = 'Permisos';
    }

    if (!groups[type]) {
      groups[type] = {
        type,
        permissions: [],
      };
    }

    groups[type].permissions.push(permission);
  });

  return Object.values(groups);
};

const schema = yup.object().shape({
  name: yup.string().required('Campo obligatorio.'),
  description: yup.string().required('Campo obligatorio.'),
});

export default RoleForm;
