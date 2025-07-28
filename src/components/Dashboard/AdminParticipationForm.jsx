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
import getCatalogs from '@services/getCatalogs';
import CustomErrorAlert from '@components/UI/CustomErrorAlert';
import useParticipantsAdmin from '@hooks/Dashboard/useParticipantsAdmin';
import {getParticipantByPhoneNumber} from '@services/Participants';
import CustomRadioGroup from '@components/UI/Form/CustomRadioGroup';
import CustomMultiSelect from '@components/UI/Form/CustomMultiSelect';
import CustomPhoneNumberInput from '@components/UI/Form/CustomPhoneNumberInput';

import AdminEvents from '../Dashboard/AdminEvents';
import SuccessModal from '../Home/SuccessModal';
import getPublicCatalogs from '@services/getPublicCatalogs';
import Permissions from '@utils/Permissions';

const AdminParticipationForm = ({
  onCloseForm = null,
  initialData = initialFormData,
  titleLabel = 'Agregar participante',
  submitButtonLabel = 'Guardar',
  submitWithAttendanceButtonLabel = 'Guardar con asistencia',
  titleClassName = 'text-xl font-bold leading-6 text-primary mb-4',
  submitButtonClassName = 'inline-flex w-full justify-center items-center rounded-md bg-primary px-10 py-3 text-sm font-semibold text-white shadow-xs hover:bg-secondary sm:ml-3 sm:w-auto',
  permissions = [],
}) => {
  const {data, refetch} = useQuery({
    queryKey: ['publicCatalogs'],
    queryFn: getPublicCatalogs,
    refetchOnWindowFocus: false,
  });
  const [subscribedTo, setSubscribedTo] = useState(
    initialData?.subscribedTo ?? []
  );
  const [successfulCode, setSuccessfulCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [markAttendance, setMarkAttendance] = useState(false);

  const onSuccess = (code) => {
    setSuccessfulCode(code);
    refetch(); // Refrescar los catálogos después de enviar el formulario
    reset(initialFormData); // Reiniciar el formulario a sus valores iniciales
    setSubscribedTo([]); // Limpiar los eventos seleccionados
    setMarkAttendance(false); // Limpiar checkbox de asistencia
  };

  const onError = (error) => {
    setErrorMessage(error);
  };

  const {currentData, onCreate, onUpdate, onClean} = useParticipantsAdmin(
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
    setMarkAttendance(false);
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

  const onSubmit = async (data, withAttendance = false) => {
    setErrorMessage('');

    const updatedData = {
      ...data,
      phoneNumber: data.phoneNumber?.replaceAll('+', ''),
      career: data.career?.id,
      networks: data.networks?.value,
      subscribedTo,
      markAttendance: withAttendance,
    };

    const mutation = !empty(data.id) ? onUpdate : onCreate;
    await mutation.mutate(updatedData);
  };

  const onEnrollment = (eventId) => {
    setSubscribedTo((prev) => {
      if (prev?.includes(eventId)) {
        const newSubscribed = prev.filter((id) => id !== eventId);
        return newSubscribed;
      }

      const newSubscribed = [...prev, eventId];
      return newSubscribed;
    });
  };

  const onRefreshEvents = () => {
    refetch(); // Recargar los catálogos públicos que incluyen los eventos
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
          onSubmit={handleSubmit((data) => onSubmit(data, markAttendance))}
          autoComplete="off"
          className="w-full space-y-4"
        >
          <div className="mb-6">
            <p className="mb-3 italic font-bold">¿Quién es?</p>
            <div className="w-full flex space-x-4 mb-4">
              <CustomPhoneNumberInput
                name="phoneNumber"
                control={control}
                defaultValue={currentData.phoneNumber}
                label="¿Cuál es su número de celular?"
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
                label="¿Cómo se llama? (nombres + apellidos)"
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
                type="email"
                name="email"
                required
                label="¿Cuál es su correo electrónico?"
                error={errors.email}
                disabled={isSubmitting}
                register={register}
                containerClassName="flex-1"
                placeholder="ejemplo@mail.com"
                noCopy
                noPaste
              />
              <CustomInput
                type="email"
                name="confirmEmail"
                required
                label="Confirmar correo electrónico"
                error={errors.confirmEmail}
                disabled={isSubmitting}
                register={register}
                containerClassName="flex-1 "
                placeholder="ejemplo@mail.com"
                noCopy
                noPaste
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 italic font-bold">Información adicional</p>
            <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-4">
              <CustomInput
                type="text"
                name="institute"
                required
                label="¿Cuál es el nombre de su colegio o instituto?"
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
                label="¿Por qué medio se enteró del Vive la UCA?"
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
                label="¿Cuál es su área de interés?"
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
                label="¿Asistirá al Vive la UCA con su padre, madre o encargado? (Máximo UNO de ellos.)"
              />
              {watch('withParent') === 'true' && (
                <CustomRadioGroup
                  name="parentStudiedAtUCA"
                  register={register}
                  options={withParentAndparentStudiedAtUCAOptions}
                  label="¿La persona (padre, madre o encargado) que lo acompañará se graduó de la UCA? "
                />
              )}
            </div>
          </div>

          <AdminEvents
            events={events}
            subscribed={subscribedTo}
            currentCareer={currentCareer}
            onEnrollment={onEnrollment}
            onRefreshEvents={onRefreshEvents}
          />
          {!empty(errorMessage) && (
            <CustomErrorAlert
              message={errorMessage}
              onClose={() => {
                setErrorMessage('');
              }}
            />
          )}

          <div className="sm:flex sm:flex-row-reverse gap-3">
            {/* Botón Guardar con asistencia */}
            {console.log(
              permissions,
              permissions.includes(Permissions.CREATE_PARTICIPANT)
            )}
            {permissions.includes(Permissions.CREATE_PARTICIPANT) && (
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data, true))}
                disabled={onCreate.isPending || onUpdate.isPending}
                className="inline-flex w-full justify-center items-center rounded-md bg-green-600 px-10 py-3 text-sm font-semibold text-white shadow-xs hover:bg-green-700 sm:w-auto disabled:opacity-50"
              >
                {onCreate.isPending || onUpdate.isPending
                  ? 'Guardando...'
                  : submitWithAttendanceButtonLabel}
              </button>
            )}

            {/* Botón Guardar normal */}
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
                className="mt-3 inline-flex w-full justify-center items-center rounded-md bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-xs ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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

export default AdminParticipationForm;
