/** Map participant data to explicit template keys without replacing custom answers. */
const getParticipantFormValues = ({
  fields,
  values,
  phoneNumber,
  phoneFieldKey,
  participant,
  clearParticipant = false,
}) => {
  const participantValues = {
    name: '',
    email: '',
    confirmEmail: '',
    institute: '',
    networks: '',
    medio: 'Formulario',
    ...participant,
    phoneNumber,
  };
  const nextValues = {
    ...values,
    id: participant?.id ?? null,
    phoneNumber,
  };

  if (participant || clearParticipant) {
    for (const field of fields) {
      const participantKey = field.subFieldKey ?? field.fieldKey;
      if (!Object.hasOwn(participantValues, participantKey)) continue;

      const value = participantValues[participantKey];
      // The default form uses react-select objects; dynamic selects use scalar values.
      nextValues[field.fieldKey] =
        value && typeof value === 'object' ? value.value ?? '' : value ?? '';
    }
  }

  // Generated phone keys still identify the participant in the submission payload.
  nextValues[phoneFieldKey] = phoneNumber;
  return nextValues;
};

export default getParticipantFormValues;
