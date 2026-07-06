// @ts-nocheck
import {useState} from 'react'
import {useMutation} from '@tanstack/react-query'
import createEventDayRegistration from '@services/Participants/createEventDayRegistration'

const useEventDayRegistration = (onSuccess, onError) => {
  const [successfulCode, setSuccessfulCode] = useState('')

  const onRegister = useMutation({
    mutationFn: createEventDayRegistration,
    onSuccess: (response) => {
      setSuccessfulCode(response.code)
      onSuccess?.(response.code, response.data)
    },
    onError: (error) => {
      const message =
        error?.response?.data?.errors ??
        error?.response?.data?.message ??
        'Ocurrió un error. Por favor, inténtalo de nuevo.'
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
