// @ts-nocheck
import * as yup from 'yup';
import {empty} from '@utils/helpers';
import {useEffect, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useQuery} from '@tanstack/react-query';
import {isValidPhoneNumber} from '@utils/helpers';
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

  useEffect(() => {
    setSubscribedTo(initialData.subscribedTo);
  }, [currentFaculty]);

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

  useEffect(() => {
    if (subscribedTo?.length > 0 || empty(currentData.faculty)) {
      setErrorMessage('');
      return;
    }
    setErrorMessage('Debes seleccionar al menos 1 evento');
  }, [subscribedTo]);

  const onSubmit = async (data) => {
    if (subscribedTo?.length === 0) {
      setErrorMessage('Debes seleccionar al menos 1 evento');
      return;
    }
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
      if (prev?.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      }

      return [...prev, eventId];
    });
  };

  const onSearchByPhoneNumber = async (phoneNumber) => {
    if (!isValidPhoneNumber(phoneNumber)) {
      reset({
        ...initialFormData,
        confirmEmail: initialData.email,
        phoneNumber: phoneNumber,
      });
      setSubscribedTo([]);
      return;
    }

    const data = await getParticipantByPhoneNumber(phoneNumber);

    if (!empty(data.participant)) {
      reset(data.participant);
      const suscriptions = data.subscribedTo.map((e) => {
        if (typeof e === 'object') {
          return e.event;
        }
        return e;
      });
      setSubscribedTo(suscriptions);
      initialData.subscribedTo = suscriptions;
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
            <p className="mb-3 italic font-bold">¿Quién sos?</p>
            <div className="w-full flex space-x-4 mb-4">
              <CustomPhoneNumberInput
                name="phoneNumber"
                control={control}
                defaultValue={currentData.phoneNumber}
                label="¿Cuál es tu número de celular?"
                error={errors.phoneNumber}
                containerClassName="flex-1"
                onCustomBlur={(value) => onSearchByPhoneNumber(value)}
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
                noCopy
                noPaste
              />
            </div>
            <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-4">
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
                noCopy
                noPaste
              />
              <CustomInput
                type="text"
                name="confirmEmail"
                required
                label="¿Podrías confirmar tu correo electrónico?"
                error={errors.confirmEmail}
                disabled={isSubmitting}
                register={register}
                containerClassName="flex-1 "
                placeholder="00084417@mail.com"
                noCopy
                noPaste
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 italic font-bold">Queremos saber más de vos</p>
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
                noCopy
                noPaste
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
                label="¿Por qué medio te enteraste del Vive la UCA?"
                options={networksOptions}
              />
            </div>

            <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-4">
              <CustomRadioGroup
                name="faculty"
                register={register}
                options={
                  data?.faculties?.sort((a, b) =>
                    a.name.localeCompare(b.name)
                  ) ?? []
                }
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
                options={
                  careers?.sort((a, b) => a.name.localeCompare(b.name)) ?? []
                }
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 italic font-bold">Asistencia</p>
            <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-4">
              <CustomRadioGroup
                name="withParent"
                register={register}
                options={withParentAndparentStudiedAtUCAOptions}
                label="¿Asistirás al Vive la UCA con tu padre, madre o encargado? (Máximo UNO de ellos.)"
              />
              {watch('withParent') === 'true' && (
                <CustomRadioGroup
                  name="parentStudiedAtUCA"
                  register={register}
                  options={withParentAndparentStudiedAtUCAOptions}
                  label="¿La persona (padre, madre o encargado) que te acompañará se graduó de la UCA? "
                />
              )}
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
              onClose={() => {
                setErrorMessage('');
              }}
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
  confirmEmail: '',
  phoneNumber: '',
  institute: '',
  networks: '',
  medio: 'Formulario',

  subscribedTo: [],
  faculty: '',
  career: null,
  parentStudiedAtUCA: null,
  withParent: '0',
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Debe ser un correo electrónico válido')
    .required('Campo obligatorio.'),
  confirmEmail: yup
    .string()
    .email('Debe ser un correo electrónico válido')
    .required('Campo obligatorio.')
    .oneOf(
      [yup.ref('email'), null],
      'Los correos electrónicos deben coincidir'
    ),
  phoneNumber: yup
    .string()
    .required('Campo obligatorio')
    .test('is-phone_number', 'Teléfono invalido', (value) =>
      isValidPhoneNumber(value)
    ),

  name: yup.string().required('Campo obligatorio.'),
  institute: yup.string().required('Campo obligatorio.'),
  networks: yup.object().required('Campo obligatorio.'),
  medio: yup.string().required('Campo obligatorio.'),
  faculty: yup.string().required('Campo obligatorio.'),
  career: yup.object().required('Campo obligatorio.'),
  withParent: yup.boolean().required('Campo obligatorio.'),
});

const withParentAndparentStudiedAtUCAOptions = [
  {value: true, label: 'Sí'},
  {value: false, label: 'No'},
];

// const tourMethodOptions = [
//   {
//     value: 'App especial',
//     label: 'Por mi cuenta, descargando una App especial',
//   },
//   {value: 'Recorrido guiado', label: 'Recorrido guiado'},
// ];

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
