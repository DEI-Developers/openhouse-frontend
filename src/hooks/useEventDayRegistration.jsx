// @ts-nocheck
import {useState} from 'react'
import {useMutation} from '@tanstack/react-query'
import createEventDayRegistration from '@services/Participants/createEventDayRegistration'

const useEventDayRegistration = (onSuccess, onError) => {
  const [successfulCode, setSuccessfulCode] = useState('')

  const onRegister = useMutation({
    mutationFn: createEventDayRegistration,
    onSuccess: (response) => {
      // Nuevo registro con asistencia: NO mostrar QR, solo mensaje
      onSuccess?.(null, response.data, false)
    },
    onError: (error) => {
      const errData = error?.response?.data

      // 409: ya inscrito — mostrar QR
      if (errData?.alreadySubscribed && errData?.code) {
        setSuccessfulCode(errData.code)
        onSuccess?.(errData.code, errData.data, true)
        return
      }

      let message = 'Ocurrió un error. Por favor, inténtalo de nuevo.'
      if (errData?.errors) {
        if (Array.isArray(errData.errors)) {
          message = errData.errors
            .map((e) => e.msg || e.message || JSON.stringify(e))
            .join('. ')
        } else {
          message = String(errData.errors)
        }
      } else if (errData?.message) {
        message = errData.message
      }
      onError?.(message)
    },
  })

  const resetCode = () => setSuccessfulCode('')

  return {
    onRegister,
    successfulCode,
    resetCode,
  }
}

export default useEventDayRegistration
