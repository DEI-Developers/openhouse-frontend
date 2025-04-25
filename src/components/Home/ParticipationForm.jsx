// @ts-nocheck
import * as yup from 'yup';
import {empty} from '@utils/helpers';
import {useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useQuery} from '@tanstack/react-query';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomInput from '@components/UI/Form/CustomInput';
import SubmitButton from '@components/UI/Form/SubmitButton';
import getPublicCatalogs from '@services/getPublicCatalogs';
import CustomErrorAlert from '@components/UI/CustomErrorAlert';
import useParticipants from '@hooks/Dashboard/useParticipants';
import {getParticipantByPhoneNumber} from '@services/Participants';
import CustomRadioGroup from '@components/UI/Form/CustomRadioGroup';
import CustomMultiSelect from '@components/UI/Form/CustomMultiSelect';
import CustomPhoneNumberInput from '@components/UI/Form/CustomPhoneNumberInput';

import Events from './Events';
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
  const [subscribedTo, setSubscribedTo] = useState(
    initialData?.subscribedTo ?? []
  );
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
  const currentCareer = watch('career')?.value ?? null;
  const {isSubmitting, errors} = formState;

  const careers = useMemo(() => {
    return (
      data?.faculties?.find((f) => f.value === currentFaculty)?.careers ?? []
    );
  }, [currentFaculty, data]);

  const events = useMemo(() => {
    return (
      data?.events?.filter((e) => e.faculties?.includes(currentFaculty)) ?? []
    );
  }, [currentFaculty, data]);

  const onCloseModal = () => {
    onClean();
    reset();
    setSuccessfulCode('');
    setErrorMessage('');
    onCloseForm && onCloseForm();
  };

  useEffect(() => {
    if (currentFaculty !== initialData.faculty) {
      setValue('career', null);
    }
  }, [currentFaculty]);

  const onSubmit = async (data) => {
    setErrorMessage('');

    const updatedData = {
      ...data,
      phoneNumber: data.phoneNumber?.replaceAll('+', ''),
      career: data.career?.id,
      networks: data.networks?.value,
      subscribedTo,
    };

    const mutation = !empty(data.id) ? onUpdate : onCreate;
    await mutation.mutate(updatedData);
  };

  const onEnrollment = (eventId) => {
    setSubscribedTo((prev) => {
      if (prev.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      }

      return [...prev, eventId];
    });
  };

  const onSearchByPhoneNumber = async (phoneNumber) => {
    if (empty(phoneNumber)) {
      return;
    }

    const data = await getParticipantByPhoneNumber(phoneNumber);

    if (!empty(data.participant)) {
      reset(data.participant);
      setSubscribedTo(data.subscribedTo);
    }
  };

  return (
    <div>
      <div className="px-4 py-6 mx-auto max-w-6xl">
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
                onBlur={(e) => onSearchByPhoneNumber(e.target.value)}
              />
              <div className="hidden lg:flex lg:flex-1" />
            </div>
            <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-4">
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
                placeholder="00084417@mail.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 italic font-bold">Queremos saber mas de ti</p>
            <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-4">
              <CustomInput
                type="text"
                name="institute"
                required
                label="¿Cuál es el nombre de tu colegio o instituto?"
                error={errors.institute}
                disabled={isSubmitting}
                register={register}
                containerClassName="flex-1"
                placeholder=""
              />

              <CustomMultiSelect
                isSearchable
                isClearable
                required
                placeholder=""
                control={control}
                closeMenuOnSelect
                name="networks"
                disabled={isSubmitting}
                error={errors.networks}
                containerClassName="flex-1"
                label="¿Por que medio te enteraste del Vive la UCA?"
                options={networksOptions}
              />
            </div>

            <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-4">
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
                name="career"
                disabled={isSubmitting}
                error={errors.career}
                containerClassName="flex-1"
                label="Carrera"
                options={careers}
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 italic font-bold">Asistencia</p>
            <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-4">
              <CustomRadioGroup
                name="withParent"
                register={register}
                options={withParentOptions}
                label="¿Asistirás al Vive la UCA con tu padre, madre o encargado? (Máximo UNO de ellos.)"
              />
              <CustomRadioGroup
                name="tourMethod"
                register={register}
                options={tourMethodOptions}
                containerClassName="md:pl-2"
                label="¿Para el recorrido preferirías hacerlo por tu cuenta o sumarte a los recorridos guiados?"
              />
            </div>
          </div>

          <Events
            events={events}
            subscribed={subscribedTo}
            currentCareer={currentCareer}
            onEnrollment={onEnrollment}
          />

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
  name: '',
  email: '',
  phoneNumber: '',
  institute: '',
  networks: '',
  medio: 'Formulario',

  subscribedTo: [],
  faculty: '',
  career: null,
  tourMethod: 'App especial',
  withParent: '1',
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Debe ser un correo electrónico válido')
    .required('Campo obligatorio.'),
  phoneNumber: yup.string().required('Campo obligatorio.'),
  name: yup.string().required('Campo obligatorio.'),
  institute: yup.string().required('Campo obligatorio.'),
  networks: yup.object().required('Campo obligatorio.'),
  medio: yup.string().required('Campo obligatorio.'),

  faculty: yup.string().required('Campo obligatorio.'),
  career: yup.object().required('Campo obligatorio.'),
  tourMethod: yup.string().required('Campo obligatorio.'),
  withParent: yup.boolean().required('Campo obligatorio.'),
});

const withParentOptions = [
  {value: 1, label: 'Sí'},
  {value: 0, label: 'No'},
];

const tourMethodOptions = [
  {
    value: 'App especial',
    label: 'Por mi cuenta, descargando una App especial',
  },
  {value: 'Recorrido guiado', label: 'Recorrido guiado'},
];

const networksOptions = [
  {value: 'Charla UCA', label: 'Charla UCA'},
  {value: 'Sitio web de la UCA', label: 'Sitio web de la UCA'},
  {value: 'Un conocido me contó', label: 'Un conocido me contó'},
  {value: 'Facebook', label: 'Facebook'},
  {value: 'Instagram', label: 'Instagram'},
  {value: 'Tik Tok', label: 'Tik Tok'},
  {value: 'Correo Electrónico', label: 'Correo Electrónico'},
  {value: 'Otro', label: 'Otro'},
];

export default ParticipationForm;
