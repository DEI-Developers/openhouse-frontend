// @ts-nocheck
import * as yup from 'yup';
import {empty} from '@utils/helpers';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useQuery} from '@tanstack/react-query';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomInput from '@components/UI/Form/CustomInput';
import SubmitButton from '@components/UI/Form/SubmitButton';
import getPublicCatalogs from '@services/getPublicCatalogs';
import CustomErrorAlert from '@components/UI/CustomErrorAlert';
import useParticipants from '@hooks/Dashboard/useParticipants';
import CustomRadioGroup from '@components/UI/Form/CustomRadioGroup';
import CustomMultiSelect from '@components/UI/Form/CustomMultiSelect';
import CustomPhoneNumberInput from '@components/UI/Form/CustomPhoneNumberInput';

import Event from './Event';
import SuccessModal from './SuccessModal';

const ParticipationForm = ({
  onCloseForm = null,
  initialData = initialFormData,
  titleLabel = 'Formulario de inscripción',
  submitButtonLabel = 'Enviar formulario',
  titleClassName = 'font-bold text-3xl text-center text-primary tracking-wide',
  submitButtonClassName = 'w-full flex justify-center items-center bg-primary text-white text-sm font-bold py-3.5 rounded-lg',
}) => {
  const {data} = useQuery({
    queryKey: ['publicCatalogs'],
    queryFn: getPublicCatalogs,
    refetchOnWindowFocus: false,
  });
  const [subscribed, setSubscribed] = useState(initialData?.subscribed ?? []);
  const [successfulCode, setSuccessfulCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSuccess = (code) => {
    setSuccessfulCode(code);
  };

  const onError = (error) => {
    setErrorMessage(error);
  };

  const {currentData, onCreate, onUpdate, onClean} = useParticipants(
    initialData,
    onSuccess,
    onError
  );

  const {register, handleSubmit, watch, setValue, reset, control, formState} =
    useForm({
      mode: 'onBlur',
      defaultValues: currentData,
      resolver: yupResolver(schema),
    });

  const currentFaculty = watch('faculty');
  const {isSubmitting, errors} = formState;

  const careers =
    data?.faculties?.find((f) => f.value === currentFaculty)?.careers ?? [];

  const events =
    data?.events?.filter((e) => e.faculties?.includes(currentFaculty)) ?? [];

  const onCloseModal = () => {
    onClean();
    reset();
    setSuccessfulCode('');
    setErrorMessage('');
    onCloseForm && onCloseForm();
  };

  useEffect(() => {
    if (currentFaculty !== initialData.faculty) {
      setValue('grade', null);
    }
  }, [currentFaculty]);

  const onSubmit = async (data) => {
    setErrorMessage('');

    const updatedData = {
      ...data,
      phoneNumber: data.phoneNumber?.replaceAll('+', ''),
      grade: data.grade?.id,
      subscribed,
    };

    const mutation = !empty(data.id) ? onUpdate : onCreate;
    await mutation.mutate(updatedData);
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
    <div>
      <div className="px-4 md:px-0 py-6 mx-auto max-w-6xl">
        <h1 className={titleClassName}>{titleLabel}</h1>

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
                defaultValue={currentData.phoneNumber}
                label="¿Cuál es tu número de celular?"
                error={errors.phoneNumber}
                containerClassName="flex-1"
              />
              <div className="flex-1" />
            </div>
            <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 lg:space-y-0 mb-4">
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
            <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 lg:space-y-0 mb-4">
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

            <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 lg:space-y-0 mb-4">
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
                containerClassName="w-full lg:w-1/2 z-200 md:pl-2"
                label="Carrera"
                options={careers}
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 italic font-bold">Asistencia</p>
            <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 lg:space-y-0 mb-4">
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
                containerClassName="md:pl-2"
                label="¿Para el recorrido preferirías hacerlo por tu cuenta o sumarte a los recorridos guiados?"
              />
            </div>
          </div>

          {!empty(events) && (
            <>
              <p className="my-3 italic font-bold">
                De acuerdo a tu selección, estos son los días que podrás vivir
                la experiencia de la UCA. Por favor, escogé el día en que nos
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

          {!empty(errorMessage) && (
            <CustomErrorAlert
              message={errorMessage}
              onClose={() => setErrorMessage('')}
            />
          )}

          <div
            className={
              onCloseForm
                ? 'sm:flex sm:flex-row-reverse'
                : '"flex justify-center items-center"'
            }
          >
            <SubmitButton
              type="submit"
              label={submitButtonLabel}
              loading={onCreate.isPending || onUpdate.isPending}
              className={submitButtonClassName}
            />
            {onCloseForm && (
              <button
                type="button"
                data-autofocus
                onClick={onCloseForm}
                className="mt-3 inline-flex w-full justify-center items-center rounded-md bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
      <SuccessModal
        isOpen={!empty(successfulCode)}
        onClose={onCloseModal}
        code={successfulCode}
      />
    </div>
  );
};

const initialFormData = {
  id: null,
  phoneNumber: '',
  name: '',
  institution: '',
  email: '',
  networks: '',
  faculty: '',
  grade: null,
  means: '1',
  parentUca: '1',
  medio: 'Formulario',
  subscribed: [],
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
