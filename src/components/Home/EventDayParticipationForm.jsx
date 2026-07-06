// @ts-nocheck
import {useEffect, useMemo, useState} from 'react'
import {isValidPhoneNumber} from '@utils/helpers'
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
  const [form, setForm] = useState({
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
  })
  const [errors, setErrors] = useState({})
  const [currentFaculty, setCurrentFaculty] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const {onRegister, successfulCode} = useEventDayRegistration(
    () => setShowSuccess(true),
    (msg) => setErrorMessage(msg)
  )

  const handleChange = (field, value) => {
    setForm((prev) => ({...prev, [field]: value}))
    if (errors[field]) {
      setErrors((prev) => ({...prev, [field]: null}))
    }
  }

  // Formatear facultades y carreras del evento
  const faculties = useMemo(() => {
    const eventFaculties = event?.faculties ?? []
    const eventCareers = event?.careers ?? []

    return eventFaculties.map((f) => {
      let facCareers = []
      if (f.careers && f.careers.length > 0) {
        facCareers = f.careers.map((c) => ({
          value: c._id,
          name: c.name,
          label: c.name,
          description: c.name,
        }))
      } else {
        const filtered = eventCareers.filter((c) => {
          const cf = c.faculty ?? c.facultyId
          return cf?.toString() === f._id?.toString()
        })
        facCareers = filtered.map((c) => ({
          value: c._id,
          name: c.name,
          label: c.name,
          description: c.name,
        }))
      }

      return {
        value: f._id,
        name: f.name,
        label: f.name,
        careers: facCareers,
      }
    })
  }, [event])

  const allCareers = useMemo(() => {
    const eventCareers = event?.careers ?? []
    return eventCareers.map((c) => ({
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

  const handleFacultyChange = (val) => {
    setCurrentFaculty(val)
    setForm((prev) => ({...prev, faculty: val, career: null}))
  }

  const handleCareerChange = (val) => {
    setForm((prev) => ({...prev, career: val}))
    if (errors.career) setErrors((prev) => ({...prev, career: null}))
  }

  const onCloseModal = () => {
    setShowSuccess(false)
    setForm({
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
    })
    setCurrentFaculty(null)
    setErrorMessage('')
    setErrors({})
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio.'
    if (!form.institute.trim()) errs.institute = 'El instituto/colegio es obligatorio.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Correo electrónico inválido.'
    }
    if (!form.confirmEmail.trim() || form.email !== form.confirmEmail) {
      errs.confirmEmail = 'Los correos no coinciden.'
    }
    if (!isValidPhoneNumber(form.phoneNumber)) {
      errs.phoneNumber = 'Número de celular inválido.'
    }
    if (!form.networks?.value) {
      errs.networks = 'Seleccioná cómo te enteraste del Vive la UCA.'
    }
    if (!form.faculty) {
      errs.faculty = 'Seleccioná tu área de interés.'
    }
    if (!form.career?.value) {
      errs.career = 'Seleccioná una carrera.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = () => {
    if (!validate()) return

    const payload = {
      name: form.name.trim(),
      institute: form.institute.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.replaceAll('+', ''),
      career: form.career.value,
      networks: form.networks.value,
      subscribedTo: [event._id],
      withParent: form.withParent === 'true',
      parentStudiedAtUCA:
        form.withParent === 'true' ? form.parentStudiedAtUCA : null,
    }

    onRegister.mutate(payload)
  }

  const onSearchByPhoneNumber = async (phoneNumber) => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setForm((prev) => ({
        ...initialFormData,
        phoneNumber,
      }))
      setCurrentFaculty(null)
      return
    }

    try {
      const response = await getParticipantByPhoneNumber(phoneNumber)
      const participant = response?.participant

      if (!empty(participant)) {
        setForm((prev) => ({
          ...prev,
          name: participant.name || '',
          email: participant.email || '',
          confirmEmail: participant.email || '',
          institute: participant.institute || '',
          networks: participant.networks
            ? {value: participant.networks, label: participant.networks}
            : '',
          phoneNumber: participant.phoneNumber || phoneNumber,
        }))

        const alreadySubscribed = participant.subscribedTo?.some(
          (s) =>
            (typeof s === 'object' ? s.event : s) === event._id
        )
        if (alreadySubscribed) {
          setErrorMessage('Ya estás inscrito en este evento.')
        }
      }
    } catch {
      setForm((prev) => ({
        ...initialFormData,
        phoneNumber,
      }))
    }
  }

  const handlePhoneBlur = (val) => {
    onSearchByPhoneNumber(val)
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

        <div className="space-y-4">
          {/* Teléfono */}
          <CustomPhoneNumberInput
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={(val) => handleChange('phoneNumber', val)}
            label="Número de celular"
            error={errors.phoneNumber}
            onCustomBlur={handlePhoneBlur}
          />

          {/* Nombre */}
          <CustomInput
            type="text"
            name="name"
            label="Nombre completo"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            placeholder="Nombres y apellidos"
            noCopy
            noPaste
          />

          {/* Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              type="email"
              name="email"
              label="Correo electrónico"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              placeholder="correo@mail.com"
              noCopy
              noPaste
            />
            <CustomInput
              type="email"
              name="confirmEmail"
              label="Confirmar correo"
              value={form.confirmEmail}
              onChange={(e) => handleChange('confirmEmail', e.target.value)}
              error={errors.confirmEmail}
              placeholder="Repetí tu correo"
              noCopy
              noPaste
            />
          </div>

          {/* Instituto */}
          <CustomInput
            type="text"
            name="institute"
            label="Instituto o colegio"
            value={form.institute}
            onChange={(e) => handleChange('institute', e.target.value)}
            error={errors.institute}
            placeholder="¿Dónde estudiás?"
            noCopy
            noPaste
          />

          {/* Redes */}
          <CustomMultiSelect
            isSearchable
            isClearable
            placeholder=""
            value={form.networks}
            onChange={(val) => handleChange('networks', val)}
            error={errors.networks}
            label="¿Cómo te enteraste del Vive la UCA?"
            options={networksOptions}
          />

          {/* Facultad + Carrera */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomRadioGroup
              name="faculty"
              value={form.faculty}
              onChange={handleFacultyChange}
              options={
                faculties?.sort((a, b) => a.name.localeCompare(b.name)) ?? []
              }
              label="¿Cuál es tu área de interés?"
            />
            <CustomMultiSelect
              isSearchable
              isClearable
              placeholder=""
              value={form.career}
              onChange={handleCareerChange}
              disabled={!currentFaculty}
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
          <div>
            <CustomRadioGroup
              name="withParent"
              value={form.withParent}
              onChange={(val) => handleChange('withParent', val)}
              options={withParentOptions}
              label="¿Asistís con padre, madre o encargado?"
            />
            {form.withParent === 'true' && (
              <div className="mt-3">
                <CustomRadioGroup
                  name="parentStudiedAtUCA"
                  value={form.parentStudiedAtUCA}
                  onChange={(val) => handleChange('parentStudiedAtUCA', val)}
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
            type="button"
            onClick={onSubmit}
            label="Registrar mi asistencia"
            loading={onRegister.isPending}
            className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3.5 rounded-lg transition-colors"
          />
        </div>
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

const withParentOptions = [
  {value: 'true', label: 'Sí'},
  {value: 'false', label: 'No'},
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
