// @ts-nocheck
import * as yup from 'yup';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useQuery} from '@tanstack/react-query';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomInput from '@components/UI/Form/CustomInput';
import CustomButton from '@components/UI/Form/CustomButton';
import getPublicCatalogs from '@services/getPublicCatalogs';
import CustomRadioGroup from '@components/UI/Form/CustomRadioGroup';
import CustomMultiSelect from '@components/UI/Form/CustomMultiSelect';
import CustomPhoneNumberInput from '@components/UI/Form/CustomPhoneNumberInput';

import Event from './Event';
import {empty} from '@utils/helpers';

const ParticipationForm = () => {
  const {data} = useQuery({
    queryKey: ['publicCatalogs'],
    queryFn: getPublicCatalogs,
    refetchOnWindowFocus: false,
  });
  const [subscribed, setSubscribed] = useState([]);

  const {register, handleSubmit, watch, setValue, control, formState} = useForm(
    {
      mode: 'onBlur',
      defaultValues: initialData,
      resolver: yupResolver(schema),
    }
  );

  const currentFaculty = watch('faculty');
  const {isSubmitting, errors} = formState;

  const careers =
    data?.faculties?.find((f) => f.value === currentFaculty)?.careers ?? [];

  const events =
    data?.events?.filter((e) => e.faculties?.includes(currentFaculty)) ?? [];

  useEffect(() => {
    setValue('grade', null);
  }, [currentFaculty]);

  const onSubmit = async (data) => {
    const updatedData = {
      ...data,
      grade: data.grade?.id,
      subscribed,
    };

    console.log('data', updatedData);
  };

  const onEnrollment = (eventId) => {
    setSubscribed((prev) => {
      if (prev.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      }

      return [...prev, eventId];
    });
  };

  return (
    <div className="py-6 mx-auto max-w-6xl">
      <h1 className="font-bold text-3xl text-center text-primary tracking-wide">
        Formulario de inscripción
      </h1>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="w-full space-y-4"
      >
        <div className="mb-6">
          <p className="mb-3 italic font-bold">¿Quién eres?</p>
          <div className="w-full flex space-x-4 mb-4">
            <CustomPhoneNumberInput
              name="phoneNumber"
              control={control}
              defaultValue={initialData.phoneNumber}
              label="¿Cuál es tu número de celular?"
              error={errors.phoneNumber}
              containerClassName="flex-1"
            />
            <div className="flex-1" />
          </div>
          <div className="w-full flex space-x-4 mb-4">
            <CustomInput
              type="text"
              name="name"
              required
              label="¿Cómo te llamás? (nombres + apellidos)"
              error={errors.name}
              disabled={isSubmitting}
              register={register}
              containerClassName="flex-1"
              placeholder=""
            />
            <CustomInput
              type="text"
              name="email"
              required
              label="¿Cuál es tu correo electrónico?"
              error={errors.email}
              disabled={isSubmitting}
              register={register}
              containerClassName="flex-1"
              placeholder="00084417@uca.edu.sv"
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-3 italic font-bold">Queremos saber mas de ti</p>
          <div className="flex space-x-4 mb-4">
            <CustomInput
              type="text"
              name="institution"
              required
              label="¿Cuál es el nombre de tu colegio o instituto?"
              error={errors.institution}
              disabled={isSubmitting}
              register={register}
              containerClassName="flex-1"
              placeholder=""
            />
            <CustomInput
              type="text"
              name="networks"
              required
              label="¿Por que medio te enteraste del Vive la UCA?"
              error={errors.networks}
              disabled={isSubmitting}
              register={register}
              containerClassName="flex-1"
              placeholder=""
            />
          </div>

          <div className="flex space-x-4 mb-4">
            <CustomRadioGroup
              name="faculty"
              register={register}
              options={data?.faculties ?? []}
              label="¿Cuál es tu área de interés?"
              containerClassName="flex-1"
            />
            <CustomMultiSelect
              isSearchable
              isClearable
              required
              placeholder=""
              control={control}
              closeMenuOnSelect
              name="grade"
              disabled={isSubmitting}
              error={errors.grade}
              containerClassName="w-full lg:w-1/2 z-200"
              label="Carrera"
              options={careers}
            />
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-3 italic font-bold">Asistencia</p>
          <div className="flex space-x-8">
            <CustomRadioGroup
              name="parentUca"
              register={register}
              options={parentUcaOptions}
              label="¿Asistirás al Vive la UCA con tu padre, madre o encargado? (Máximo UNO de ellos.)"
            />
            <CustomRadioGroup
              name="means"
              register={register}
              options={medioOptions}
              label="¿Para el recorrido preferirías hacerlo por tu cuenta o sumarte a los recorridos guiados?"
            />
          </div>
        </div>

        {!empty(events) && (
          <>
            <p className="my-3 italic font-bold">
              De acuerdo a tu selección, estos son los días que podrás vivir la
              experiencia de la UCA. Por favor, escogé el día en que nos
              visitarás.
            </p>
            <div className="flex flex-wrap justify-center items-center space-x-4">
              {events.map((event) => (
                <Event
                  key={event.value}
                  event={event}
                  isSubscribed={subscribed.includes(event.value)}
                  onClick={() => onEnrollment(event.value)}
                />
              ))}
            </div>
          </>
        )}

        <div className="flex justify-center items-center">
          <CustomButton
            type="submit"
            loading={isSubmitting}
            label="Enviar formulario"
            className="w-full max-w-lg flex justify-center items-center bg-primary text-white text-sm font-bold py-3.5 rounded-lg"
          />
        </div>
      </form>
    </div>
  );
};

const schema = yup.object().shape({
  phoneNumber: yup.string().required('Campo obligatorio.'),
  name: yup.string().required('Campo obligatorio.'),
  institution: yup.string().required('Campo obligatorio.'),
  email: yup
    .string()
    .email('Debe ser un correo electrónico válido')
    .required('Campo obligatorio.'),
  networks: yup.string().required('Campo obligatorio.'),
  faculty: yup.string().required('Campo obligatorio.'),
  grade: yup.object().required('Campo obligatorio.'),
  means: yup.boolean().required('Campo obligatorio.'),
  parentUca: yup.boolean().required('Campo obligatorio.'),
  medio: yup.string().required('Campo obligatorio.'),
});

const initialData = {
  phoneNumber: '',
  name: '',
  institution: '',
  email: '',
  networks: '',
  faculty: '',
  grade: null,
  means: '',
  parentUca: '1',
  medio: 'Formulario',
};

const parentUcaOptions = [
  {value: 1, label: 'Sí'},
  {value: 0, label: 'No'},
];

const medioOptions = [
  {
    value: 1,
    label: 'Por mi cuenta, descargando una App especial',
  },
  {value: 0, label: 'Recorrido guiado'},
];

export default ParticipationForm;
