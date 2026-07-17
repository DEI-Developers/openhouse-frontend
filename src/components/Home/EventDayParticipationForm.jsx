// @ts-nocheck
import {useState} from 'react'
import {isValidPhoneNumber} from '@utils/helpers'
import SuccessModal from '@components/Home/SuccessModal'
import useEventDayRegistration from '@hooks/useEventDayRegistration'
import {PhoneInput} from 'react-international-phone'
import 'react-international-phone/style.css'
import checkEnrollment from '@services/Participants/checkEnrollment'

const emptyForm = {
  name: '',
  email: '',
  confirmEmail: '',
  institute: '',
  networks: '',
  faculty: null,
  career: null,
  withParent: '',
  parentStudiedAtUCA: null,
}

const EventDayParticipationForm = ({event}) => {
  const [step, setStep] = useState('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [registrationDisabled, setRegistrationDisabled] = useState(!event.eventDayRegistrationEnabled)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successfulCode, setSuccessfulCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({...emptyForm})
  const [formErrors, setFormErrors] = useState({})
  const [currentFaculty, setCurrentFaculty] = useState(null)

  const {onRegister} = useEventDayRegistration(
    (code, data, showQR) => {
      setIsSubmitting(false)
      if (showQR) {
        setSuccessfulCode(code)
      }
      setShowSuccess(true)
    },
    (msg) => {
      setErrorMessage(msg)
      setIsSubmitting(false)
    }
  )

  const faculties = (event?.faculties || []).map((f) => {
    const facId = f._id?.toString()
    const facCareers = (f.careers || []).map((c) => ({
      value: c._id?.toString(),
      name: c.name,
    }))
    return {value: facId, name: f.name, careers: facCareers}
  })

  const careers = currentFaculty
    ? (faculties.find((f) => f.value === currentFaculty)?.careers || [])
    : []

  const handlePhoneSubmit = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneError('Número de celular inválido.')
      return
    }
    setPhoneError('')

    try {
      const res = await checkEnrollment(phoneNumber, event._id)
      if (res?.registrationDisabled) {
        setRegistrationDisabled(true)
        return
      }
      if (res?.enrolled) {
        setSuccessfulCode(phoneNumber.replaceAll('+', ''))
        setShowSuccess(true)
      } else {
        if (res?.participant) {
          const p = res.participant
          const withParentValue =
            p.withParent === true || p.withParent === 'true'
              ? 'true'
              : p.withParent === false || p.withParent === 'false'
              ? 'false'
              : ''
          const parentStudiedValue =
            p.parentStudiedAtUCA === true || p.parentStudiedAtUCA === 'true'
              ? 'true'
              : p.parentStudiedAtUCA === false || p.parentStudiedAtUCA === 'false'
              ? 'false'
              : null
          setForm({
            name: p.name || '',
            email: p.email || '',
            confirmEmail: p.email || '',
            institute: p.institute || '',
            networks: p.networks || '',
            faculty: null,
            career: null,
            withParent: withParentValue,
            parentStudiedAtUCA: parentStudiedValue,
          })
        } else {
          setForm({...emptyForm})
        }
        setStep('form')
      }
    } catch {
      setForm({...emptyForm})
      setStep('form')
    }
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({...prev, [field]: value}))
    if (formErrors[field]) setFormErrors((prev) => ({...prev, [field]: null}))
  }

  const handleFacultyChange = (val) => {
    setCurrentFaculty(val)
    setForm((prev) => ({...prev, faculty: val, career: null}))
    if (formErrors.faculty) setFormErrors((prev) => ({...prev, faculty: null}))
  }

  const handleCareerChange = (val) => {
    setForm((prev) => ({...prev, career: val}))
    if (formErrors.career) setFormErrors((prev) => ({...prev, career: null}))
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
    if (!form.networks) errs.networks = 'Seleccioná cómo te enteraste.'
    if (!form.faculty) errs.faculty = 'Seleccioná tu área de interés.'
    if (!form.career) errs.career = 'Seleccioná una carrera.'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    setIsSubmitting(true)

    const payload = {
      name: form.name.trim(),
      institute: form.institute.trim(),
      email: form.email.trim(),
      phoneNumber: phoneNumber.replaceAll('+', ''),
      faculty: form.faculty,
      career: form.career,
      networks: form.networks,
      subscribedTo: [event._id],
      withParent: form.withParent === 'true',
      parentStudiedAtUCA:
        form.withParent === 'true' ? form.parentStudiedAtUCA === 'true' : null,
    }

    onRegister.mutate(payload)
  }

  const handleClose = () => {
    setShowSuccess(false)
    setStep('phone')
    setPhoneNumber('')
    setPhoneError('')
    setForm({...emptyForm})
    setErrorMessage('')
    setFormErrors({})
    setCurrentFaculty(null)
    setSuccessfulCode('')
    setRegistrationDisabled(false)
  }

  const handleBack = () => {
    setStep('phone')
    setForm({...emptyForm})
    setFormErrors({})
    setErrorMessage('')
    setCurrentFaculty(null)
    setRegistrationDisabled(false)
  }

  const labelClass = 'block text-sm font-medium text-gray-700'
  const inputClass =
    'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
  const inputErrorClass =
    'w-full px-3 py-2.5 border border-red-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500'
  const errorClass = 'text-red-500 text-xs mt-1'

  return (
    <div className="px-4 py-6 mx-auto max-w-6xl">
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

        {registrationDisabled ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Para registrarte, ingresá a{' '}
              <a
                href="https://vivelauca.uca.edu.sv/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                https://vivelauca.uca.edu.sv/
              </a>
            </p>
          </div>
        ) : step === 'phone' ? (
          <div className="mb-6">
            <p className="mb-3 italic font-bold">¿Quién sos?</p>
            <div className="w-full flex space-x-4 mb-4">
              <div className="flex-1">
                <label className={labelClass}>
                  ¿Cuál es tu número de celular?
                </label>
                <PhoneInput
                  defaultCountry="sv"
                  value={phoneNumber}
                  onChange={(val) => {
                    setPhoneNumber(val)
                    setPhoneError('')
                  }}
                  inputClassName={phoneError ? inputErrorClass : inputClass}
                />
                {phoneError && <p className={errorClass}>{phoneError}</p>}
              </div>
            </div>

            <button
              type="button"
              onClick={handlePhoneSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3.5 rounded-lg transition-colors"
            >
              Continuar
            </button>
          </div>
        ) : step === 'form' && (
          <form noValidate autoComplete="off" className="w-full space-y-4">
            {/* Sección: Quién sos */}
            <div className="mb-6">
              <p className="mb-3 italic font-bold">¿Quién sos?</p>

              {/* Nombre */}
              <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-4">
                <div className="flex-1">
                  <label className={labelClass}>
                    ¿Cómo te llamás? (nombres + apellidos) *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder=""
                    className={formErrors.name ? inputErrorClass : inputClass}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                  />
                  {formErrors.name && (
                    <p className={errorClass}>{formErrors.name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-4">
                <div className="flex-1">
                  <label className={labelClass}>
                    ¿Cuál es tu correo electrónico? *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="correo@mail.com"
                    className={formErrors.email ? inputErrorClass : inputClass}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                  />
                  {formErrors.email && (
                    <p className={errorClass}>{formErrors.email}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className={labelClass}>
                    Por favor, confirmá tu correo electrónico. *
                  </label>
                  <input
                    type="email"
                    value={form.confirmEmail}
                    onChange={(e) =>
                      handleChange('confirmEmail', e.target.value)
                    }
                    placeholder="correo@mail.com"
                    className={
                      formErrors.confirmEmail ? inputErrorClass : inputClass
                    }
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                  />
                  {formErrors.confirmEmail && (
                    <p className={errorClass}>{formErrors.confirmEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección: Queremos saber más de vos */}
            <div className="mb-6">
              <p className="mb-3 italic font-bold">Queremos saber más de vos</p>

              {/* Instituto y Redes */}
              <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-4">
                <div className="flex-1">
                  <label className={labelClass}>
                    ¿En cuál instituto o colegio estudiás? *
                  </label>
                  <input
                    type="text"
                    value={form.institute}
                    onChange={(e) => handleChange('institute', e.target.value)}
                    placeholder=""
                    className={formErrors.institute ? inputErrorClass : inputClass}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                  />
                  {formErrors.institute && (
                    <p className={errorClass}>{formErrors.institute}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className={labelClass}>
                    ¿Por qué medio te enteraste del Vive la UCA? *
                  </label>
                  <select
                    value={form.networks}
                    onChange={(e) => handleChange('networks', e.target.value)}
                    className={formErrors.networks ? inputErrorClass : inputClass}
                  >
                    <option value="">Seleccioná una opción</option>
                    {networksOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.networks && (
                    <p className={errorClass}>{formErrors.networks}</p>
                  )}
                </div>
              </div>

              {/* Facultad y Carrera */}
              <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-4">
                <div className="flex-1">
                  <label className={labelClass}>
                    ¿Cuál es tu área de interés? *
                  </label>
                  <div className="mt-2 space-y-3">
                    {faculties
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((fac) => (
                        <label
                          key={fac.value}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            form.faculty === fac.value
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="faculty"
                            value={fac.value}
                            checked={form.faculty === fac.value}
                            onChange={() => handleFacultyChange(fac.value)}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {fac.name}
                          </span>
                        </label>
                      ))}
                  </div>
                  {formErrors.faculty && (
                    <p className={errorClass}>{formErrors.faculty}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className={labelClass}>Carrera *</label>
                  <select
                    value={form.career || ''}
                    onChange={(e) =>
                      handleCareerChange(e.target.value || null)
                    }
                    disabled={!form.faculty}
                    className={`${
                      form.faculty
                        ? ''
                        : 'bg-gray-100 cursor-not-allowed'
                    } ${formErrors.career ? inputErrorClass : inputClass}`}
                  >
                    <option value="">
                      {form.faculty
                        ? 'Seleccioná una carrera'
                        : 'Primero seleccioná tu área'}
                    </option>
                    {careers.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.career && (
                    <p className={errorClass}>{formErrors.career}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección: Asistencia */}
            <div className="mb-6">
              <p className="mb-3 italic font-bold">Asistencia</p>
              <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mb-4">
                <div className="flex-1">
                  <label className={labelClass}>
                    ¿Tu padre, madre o encargado también participará en el evento?
                  </label>
                  <div className="mt-2 flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="withParent"
                        value="true"
                        checked={form.withParent === 'true'}
                        onChange={() => handleChange('withParent', 'true')}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Sí
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="withParent"
                        value="false"
                        checked={form.withParent === 'false'}
                        onChange={() => handleChange('withParent', 'false')}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        No
                      </span>
                    </label>
                  </div>
                </div>
                {form.withParent === 'true' && (
                  <div className="flex-1">
                    <label className={labelClass}>
                      ¿La persona (padre, madre o encargado) que te acompaña se graduó de la UCA?
                    </label>
                    <div className="mt-2 flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="parentStudiedAtUCA"
                          value="true"
                          checked={form.parentStudiedAtUCA === 'true'}
                          onChange={() =>
                            handleChange('parentStudiedAtUCA', 'true')
                          }
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Sí
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="parentStudiedAtUCA"
                          value="false"
                          checked={form.parentStudiedAtUCA === 'false'}
                          onChange={() =>
                            handleChange('parentStudiedAtUCA', 'false')
                          }
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          No
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-bold py-3.5 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Enviando...' : 'Registrar mi asistencia'}
            </button>

            {/* Volver */}
            <button
              type="button"
              onClick={handleBack}
              className="w-full text-sm text-gray-500 hover:text-gray-700 py-1"
            >
              ← Cambiar número de celular
            </button>
          </form>
        )}
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleClose}
        code={successfulCode}
      />
    </div>
  )
}

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
