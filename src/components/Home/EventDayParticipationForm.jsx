// @ts-nocheck
import {useEffect, useMemo, useState} from 'react'
import {useForm} from 'react-hook-form'
import {isValidPhoneNumber} from '@utils/helpers'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import CustomInput from '@components/UI/Form/CustomInput'
import CustomPhoneNumberInput from '@components/UI/Form/CustomPhoneNumberInput'
import CustomRadioGroup from '@components/UI/Form/CustomRadioGroup'
import CustomMultiSelect from '@components/UI/Form/CustomMultiSelect'
import SubmitButton from '@components/UI/Form/SubmitButton'
import CustomErrorAlert from '@components/UI/CustomErrorAlert'
import SuccessModal from '@components/Home/SuccessModal'
import useEventDayRegistration from '@hooks/useEventDayRegistration'
import {getParticipantByPhoneNumber} from '@services/Participants'
import {empty} from '@utils/helpers'

const EventDayParticipationForm = ({event}) => {
  const [currentFaculty, setCurrentFaculty] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const {onRegister, successfulCode} = useEventDayRegistration(
    () => setShowSuccess(true),
    (msg) => setErrorMessage(msg)
  )

  // Formatear facultades y carreras del evento para los inputs
  const faculties = useMemo(() => {
    return (event?.faculties ?? []).map((f) => ({
      value: f._id,
      name: f.name,
      label: f.name,
      careers: (f.careers ?? (event?.careers ?? []).filter(
        (c) => c.faculty?.toString() === f._id?.toString() ||
               c.faculty?.toString() === f._id
      ).map((c) => ({
        value: c._id,
        name: c.name,
        label: c.name,
        description: c.name,
      })) ?? []
    })))
  }, [event])

  // Todas las carreras del evento aplanadas
  const allCareers = useMemo(() => {
    return (event?.careers ?? []).map((c) => ({
      value: c._id,
      name: c.name,
      label: c.name,
      description: c.name,
    }))
  }, [event])

  const careers = useMemo(() => {
    if (currentFaculty) {
      const fac = faculties.find((f) => f.value === currentFaculty)
      return fac?.careers ?? []
    }
    return allCareers
  }, [currentFaculty, faculties, allCareers])

  const {register, handleSubmit, watch, setValue, reset, control, formState} =
    useForm({
      mode: 'onBlur',
      defaultValues: initialFormData,
      resolver: yupResolver(schema),
    })

  const watchWithParent = watch('withParent')
  const {isSubmitting, errors} = formState

  // Reset career when faculty changes
  useEffect(() => {
    setValue('career', null)
  }, [currentFaculty, setValue])

  const onCloseModal = () => {
    setShowSuccess(false)
    reset(initialFormData)
    setCurrentFaculty(null)
    setErrorMessage('')
  }

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      phoneNumber: formData.phoneNumber?.replaceAll('+', ''),
      career: formData.career?.id,
      networks: formData.networks?.value,
      subscribedTo: [event._id],
    }

    onRegister.mutate(payload)
  }

  const onSearchByPhoneNumber = async (phoneNumber) => {
    if (!isValidPhoneNumber(phoneNumber)) {
      reset({...initialFormData, phoneNumber})
      setCurrentFaculty(null)
      return
    }

    try {
      const response = await getParticipantByPhoneNumber(phoneNumber)
      const participant = response?.participant

      if (!empty(participant)) {
        reset({
          ...initialFormData,
          name: participant.name,
          email: participant.email,
          confirmEmail: participant.email,
          institute: participant.institute,
          networks: {value: participant.networks, label: participant.networks},
          phoneNumber: participant.phoneNumber,
        })

        // Si ya está inscrito al evento, prevenir envío
        const alreadySubscribed = participant.subscribedTo?.some(
          (s) =>
            (typeof s === 'object' ? s.event : s) === event._id
        )
        if (alreadySubscribed) {
          setErrorMessage('Ya estás inscrito en este evento.')
        }
      }
    } catch {
      reset({...initialFormData, phoneNumber})
    }
  }

  return (
    <div className="px-4 py-6 mx-auto max-w-2xl">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
            Registro del día
          </span>
          <h1 className="font-bold text-2xl text-primary">
            {event.name ?? 'Evento Vive la UCA'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Completá el formulario para registrar tu asistencia
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* Teléfono */}
          <div className="mb-4">
            <CustomPhoneNumberInput
              name="phoneNumber"
              control={control}
              label="Número de celular"
              error={errors.phoneNumber}
              onCustomBlur={(val) => onSearchByPhoneNumber(val)}
            />
          </div>

          {/* Nombre */}
          <div className="mb-4">
            <CustomInput
              type="text"
              name="name"
              required
              label="Nombre completo"
              error={errors.name}
              disabled={isSubmitting}
              register={register}
              placeholder="Nombres y apellidos"
              noCopy
              noPaste
            />
          </div>

          {/* Email */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              type="email"
              name="email"
              required
              label="Correo electrónico"
              error={errors.email}
              disabled={isSubmitting}
              register={register}
              placeholder="correo@mail.com"
              noCopy
              noPaste
            />
            <CustomInput
              type="email"
              name="confirmEmail"
              required
              label="Confirmar correo"
              error={errors.confirmEmail}
              disabled={isSubmitting}
              register={register}
              placeholder="Repetí tu correo"
              noCopy
              noPaste
            />
          </div>

          {/* Instituto */}
          <div className="mb-4">
            <CustomInput
              type="text"
              name="institute"
              required
              label="Instituto o colegio"
              error={errors.institute}
              disabled={isSubmitting}
              register={register}
              placeholder="¿Dónde estudiás?"
              noCopy
              noPaste
            />
          </div>

          {/* Redes */}
          <div className="mb-4">
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
              label="¿Cómo te enteraste del Vive la UCA?"
              options={networksOptions}
            />
          </div>

          {/* Facultad + Carrera */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomRadioGroup
              name="faculty"
              register={register}
              options={
                faculties?.sort((a, b) => a.name.localeCompare(b.name)) ?? []
              }
              label="¿Cuál es tu área de interés?"
              onChange={(val) => setCurrentFaculty(val)}
            />
            <CustomMultiSelect
              isSearchable
              isClearable
              required
              placeholder=""
              control={control}
              closeMenuOnSelect
              name="career"
              disabled={isSubmitting || !currentFaculty}
              error={errors.career}
              label="Carrera"
              options={
                careers?.map((c) => ({
                  ...c,
                  label: c.description || c.label,
                })) ?? []
              }
            />
          </div>

          {/* Asistencia con padre */}
          <div className="mb-6">
            <CustomRadioGroup
              name="withParent"
              register={register}
              options={withParentOptions}
              label="¿Asistís con padre, madre o encargado?"
            />
            {watchWithParent === 'true' && (
              <div className="mt-3">
                <CustomRadioGroup
                  name="parentStudiedAtUCA"
                  register={register}
                  options={withParentOptions}
                  label="¿La persona que te acompaña estudió en la UCA?"
                />
              </div>
            )}
          </div>

          {/* Error */}
          {!empty(errorMessage) && (
            <CustomErrorAlert
              message={errorMessage}
              onClose={() => setErrorMessage('')}
            />
          )}

          {/* Submit */}
          <SubmitButton
            type="submit"
            label="Registrar mi asistencia"
            loading={onRegister.isPending}
            className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3.5 rounded-lg transition-colors"
          />
        </form>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={onCloseModal}
        code={successfulCode}
      />
    </div>
  )
}

const initialFormData = {
  name: '',
  email: '',
  confirmEmail: '',
  phoneNumber: '',
  institute: '',
  networks: '',
  faculty: null,
  career: null,
  withParent: '',
  parentStudiedAtUCA: null,
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Correo inválido')
    .required('Campo obligatorio'),
  confirmEmail: yup
    .string()
    .email('Correo inválido')
    .required('Campo obligatorio')
    .oneOf([yup.ref('email')], 'Los correos no coinciden'),
  phoneNumber: yup
    .string()
    .required('Campo obligatorio')
    .test('is-phone_number', 'Teléfono inválido', (value) =>
      isValidPhoneNumber(value)
    ),
  name: yup.string().required('Campo obligatorio'),
  institute: yup.string().required('Campo obligatorio'),
  networks: yup.object().required('Campo obligatorio'),
  faculty: yup.string().required('Campo obligatorio'),
  career: yup.object().required('Campo obligatorio'),
  withParent: yup.string().nullable().optional(),
})

const withParentOptions = [
  {value: true, label: 'Sí'},
  {value: false, label: 'No'},
]

const networksOptions = [
  {value: 'Charla UCA', label: 'Charla UCA'},
  {value: 'Sitio web de la UCA', label: 'Sitio web de la UCA'},
  {value: 'Un conocido me contó', label: 'Un conocido me contó'},
  {value: 'Facebook', label: 'Facebook'},
  {value: 'Instagram', label: 'Instagram'},
  {value: 'Tik Tok', label: 'Tik Tok'},
  {value: 'Correo Electrónico', label: 'Correo Electrónico'},
  {value: 'Otro', label: 'Otro'},
]

export default EventDayParticipationForm
