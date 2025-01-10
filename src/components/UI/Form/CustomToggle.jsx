/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
import {Controller} from 'react-hook-form';
import {Field, Label, Switch} from '@headlessui/react';

const CustomToggle = ({
  name,
  label,
  error,
  control,
  containerClassName = '',
}) => (
  <Controller
    name={name}
    control={control}
    render={({field}) => (
      <div className={containerClassName}>
        <Field className="flex items-center">
          <Switch
            {...field}
            checked={field.value}
            className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 data-[checked]:bg-primary"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
            />
          </Switch>
          <Label as="span" className="ml-3 text-sm">
            <span className="font-medium text-gray-900">{label}</span>
          </Label>
        </Field>
        {error && <span className="text-red-500 text-xs">{error.message}</span>}
      </div>
    )}
  />
);

export default CustomToggle;
