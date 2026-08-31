// @ts-nocheck
import * as yup from 'yup';
import {empty} from '@utils/helpers';
import {useMemo, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomInput from '@components/UI/Form/CustomInput';
import CustomSelect from '@components/UI/Form/CustomSelect';
import CustomRadioGroup from '@components/UI/Form/CustomRadioGroup';
import CustomToggle from '@components/UI/Form/CustomToggle';
import SubmitButton from '@components/UI/Form/SubmitButton';
import {isValidPhoneNumber} from '@utils/helpers';
import useParticipants from '@hooks/Dashboard/useParticipants';
import {getParticipantByPhoneNumber} from '@services/Participants';
import Events from './Events';
import CustomErrorAlert from '@components/UI/CustomErrorAlert';
import SuccessModal from './SuccessModal';
import CustomPhoneNumberInput from '@components/UI/Form/CustomPhoneNumberInput';
import {defaultCountries, parseCountry} from 'react-international-phone';
import getParticipantFormValues from '@utils/helpers/getParticipantFormValues';

const phoneDialCodes = new Set(
  defaultCountries.map((country) => `+${parseCountry(country).dialCode}`)
);

/**
 * FIELD_TYPE_SCHEMA maps fieldType to yup schema builders.
 * Mirrors backend FIELD_TYPES constants.
 */
const FIELD_TYPE_SCHEMA = {
  TEXT: () => yup.string(),
  EMAIL: () => yup.string().email('Debe ser un correo electrónico válido'),
  TEL: () =>
    yup
      .string()
      .test('is-phone_number', 'Teléfono inválido', (value) =>
        value ? isValidPhoneNumber(value) : true
      ),
  TEXTAREA: () => yup.string(),
  SELECT: (options) =>
    yup.mixed().test('oneOf', 'Opción inválida', (value) => {
      if (!value) return true;
      return options?.some((o) => o.value === value);
    }),
  RADIO: (options) =>
    yup.mixed().test('oneOf', 'Opción inválida', (value) => {
      if (!value) return true;
      return options?.some((o) => o.value === value);
    }),
  CHECKBOX: () => yup.boolean(),
  BOOLEAN: () => yup.boolean(),
};

/**
 * Maps fieldType to atomic component.
 */
const FIELD_TYPE_COMPONENT = {
  TEXT: CustomInput,
  EMAIL: CustomInput,
  TEL: CustomPhoneNumberInput,
  TEXTAREA: CustomInput,
  SELECT: CustomSelect,
  RADIO: CustomRadioGroup,
  CHECKBOX: CustomToggle,
  BOOLEAN: CustomToggle,
};

/**
 * Groups sub-fields by parentFieldKey for EVENT_DAY_REGISTRATION compound blocks.
 */
function groupByParentFieldKey(fields) {
  const groups = {};
  const atomicFields = [];

  for (const field of fields) {
    if (field.parentFieldKey) {
      if (!groups[field.parentFieldKey]) {
        groups[field.parentFieldKey] = [];
      }
      groups[field.parentFieldKey].push(field);
    } else {
      atomicFields.push(field);
    }
  }

  return {groups, atomicFields};
}

/**
 * Builds a yup schema from template fields.
 */
function buildYupSchema(fields) {
  const shape = {};

  for (const field of fields) {
    if (field.parentFieldKey) continue; // handled via group

    let fieldSchema = FIELD_TYPE_SCHEMA[field.fieldType]?.(field.options);
    if (!fieldSchema) continue;

    if (field.required) {
      fieldSchema = fieldSchema.required('Campo obligatorio.');
    } else {
      fieldSchema = fieldSchema.nullable().optional();
      if (field.fieldType === 'TEL') {
        // A country code without a subscriber number is an empty optional field.
        fieldSchema = fieldSchema.transform((value) =>
          phoneDialCodes.has(value) ? '' : value
        );
      }
    }

    shape[field.fieldKey] = fieldSchema;
  }

  return yup.object().shape(shape);
}

/**
 * Flattens compound block sub-fields into the top-level payload.
 * The backend expects: faculty, career, subscribedTo (array), withParent, parentStudiedAtUCA at top-level.
 */
function flattenCompoundBlocks(formData, compoundGroups) {
  const result = {...formData};

  for (const [parentKey, subFields] of Object.entries(compoundGroups)) {
    for (const subField of subFields) {
      const value = formData[subField.fieldKey];

      if (subField.subFieldKey === 'event') {
        // event is stored in subscribedTo array
        if (value) {
          result.subscribedTo = Array.isArray(result.subscribedTo)
            ? [...result.subscribedTo, value]
            : [value];
        }
      } else if (subField.subFieldKey === 'eventDay') {
        // eventDay is not stored at top-level (handled by backend from subscribedTo)
        // Skip
      } else {
        // faculty, career, withParent, parentStudiedAtUCA, tourMethod all go to top-level
        result[subField.subFieldKey] = value;
      }

      // Remove the individual sub-field from result (we keep the compound group)
      delete result[subField.fieldKey];
    }

    // Remove the parent compound key if it exists
    delete result[parentKey];
  }

  return result;
}

const DynamicForm = ({
  template,
  enrollmentForm,
  onSuccess,
  onError,
  submitButtonLabel = 'Enviar formulario',
  targetAudienceImage = null,
}) => {
  const {targetAudience, events} = enrollmentForm || {};

  const [subscribedTo, setSubscribedTo] = useState([]);
  const [successfulCode, setSuccessfulCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLookingUpPhone, setIsLookingUpPhone] = useState(false);
  const phoneLookupRequest = useRef(0);
  const lastPhoneLookup = useRef(null);

  const handleSuccess = (code) => {
    setSuccessfulCode(code);
    setSubscribedTo([]);
    setErrorMessage('');
  };

  const handleError = (error) => {
    setErrorMessage(error);
  };

  const onEnrollment = (eventId) => {
    setSubscribedTo((prev) => {
      if (prev?.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      }
      return [...prev, eventId];
    });
  };

  const onCloseModal = () => {
    window.location.reload();
  };

  const onSearchByPhoneNumber = async (phoneNumber, phoneFieldKey) => {
    if (
      lastPhoneLookup.current?.phoneNumber === phoneNumber &&
      lastPhoneLookup.current?.phoneFieldKey === phoneFieldKey
    ) return;

    lastPhoneLookup.current = null;
    const request = ++phoneLookupRequest.current;
    const applyParticipant = (participant, subscriptions = [], clearParticipant = false) => {
      reset({
        ...getParticipantFormValues({
          fields: template.fields,
          values: getValues(),
          phoneNumber,
          phoneFieldKey,
          participant,
          clearParticipant,
        }),
        subscribedTo: subscriptions,
      });
      setSubscribedTo(subscriptions);
    };

    // Never leave a previous participant ID attached to a different phone number.
    const hadParticipant = Boolean(getValues('id'));
    applyParticipant(null, hadParticipant ? [] : subscribedTo, hadParticipant);
    if (!isValidPhoneNumber(phoneNumber)) {
      lastPhoneLookup.current = {phoneNumber, phoneFieldKey};
      setIsLookingUpPhone(false);
      return;
    }

    setIsLookingUpPhone(true);
    try {
      const data = await getParticipantByPhoneNumber(phoneNumber);
      if (
        request !== phoneLookupRequest.current ||
        getValues(phoneFieldKey) !== phoneNumber
      ) return;
      lastPhoneLookup.current = {phoneNumber, phoneFieldKey};

      if (data?.participant) {
        const subs = (data.subscribedTo || []).map((e) =>
          typeof e === 'object' ? e.event : e
        );
        applyParticipant(data.participant, subs);
      }
    } catch {
      // Keep the cleared identity and custom answers if the lookup fails.
    } finally {
      if (request === phoneLookupRequest.current) setIsLookingUpPhone(false);
    }
  };

  const {groups, atomicFields} = useMemo(
    () => groupByParentFieldKey(template.fields),
    [template.fields]
  );

  const schema = useMemo(() => buildYupSchema(atomicFields), [atomicFields]);

  const {currentData, onCreate, onUpdate} = useParticipants(
    {},
    handleSuccess,
    handleError
  );

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    reset,
    control,
    formState,
  } = useForm({
    mode: 'onBlur',
    defaultValues: currentData,
    resolver: yupResolver(schema),
  });

  const {errors, isSubmitting} = formState;

  // Cascade values for compound blocks
  const watchedValues = watch();

  // Build lookup options for compound block sub-fields
  const faculties = targetAudience?.faculties ?? [];
  const currentFaculty = watchedValues[template.fields.find(f => f.subFieldKey === 'faculty')?.fieldKey];

  const careers = useMemo(() => {
    const faculty = faculties.find((f) => f.value === currentFaculty);
    return faculty?.careers ?? [];
  }, [faculties, currentFaculty]);

  const currentCareer = watchedValues[template.fields.find(f => f.subFieldKey === 'career')?.fieldKey];

  const onSubmit = async (formData) => {
    if (isLookingUpPhone) return;

    // subscribedTo must have at least one event selected
    if (!subscribedTo || subscribedTo.length === 0) {
      setErrorMessage('Debes seleccionar al menos 1 evento');
      return;
    }

    const flattened = flattenCompoundBlocks(formData, groups);

    // Add subscribedTo array (event IDs) - overrides any from flatten
    flattened.subscribedTo = subscribedTo;

    // Ensure boolean fields are sent as proper booleans
    if (flattened.withParent === undefined || flattened.withParent === '') {
      flattened.withParent = false;
    }
    if (flattened.parentStudiedAtUCA === undefined || flattened.parentStudiedAtUCA === '') {
      flattened.parentStudiedAtUCA = false;
    }

    // Default medio to 'Formulario' (required by backend schema)
    if (!flattened.medio) {
      flattened.medio = 'Formulario';
    }

    // Clean up undefined values
    Object.keys(flattened).forEach((key) => {
      if (flattened[key] === undefined) delete flattened[key];
    });

    // Ensure phoneNumber has no + prefix
    if (flattened.phoneNumber) {
      flattened.phoneNumber = flattened.phoneNumber.replaceAll('+', '');
    }

    const mutation = !flattened.id ? onCreate : onUpdate;
    await mutation.mutate(flattened);
  };

  // Render atomic fields
  const renderAtomicField = (field) => {
    const Component = FIELD_TYPE_COMPONENT[field.fieldType];
    if (!Component) return null;

    const commonProps = {
      name: field.fieldKey,
      label: field.label,
      register,
      error: errors[field.fieldKey],
      disabled: isSubmitting,
      required: field.required,
    };

    if (field.fieldType === 'TEXT' || field.fieldType === 'EMAIL' || field.fieldType === 'TEL' || field.fieldType === 'TEXTAREA') {
      // All telephone fields share the default form's country selector and formatting.
      if (field.fieldType === 'TEL' || field.fieldKey === 'phoneNumber') {
        return (
          <CustomPhoneNumberInput
            key={field.fieldKey}
            name={field.fieldKey}
            control={control}
            defaultValue={currentData?.[field.fieldKey] || ''}
            label={field.label}
            required={field.required}
            error={errors[field.fieldKey]}
            containerClassName="w-full"
            onCustomBlur={(value) => onSearchByPhoneNumber(value, field.fieldKey)}
          />
        );
      }

      return (
        <CustomInput
          key={field.fieldKey}
          {...commonProps}
          type={field.fieldType === 'EMAIL' ? 'email' : 'text'}
          containerClassName="w-full"
          placeholder={field.placeholder}
          noCopy={false}
          noPaste={false}
        />
      );
    }

    if (field.fieldType === 'SELECT') {
      return (
        <CustomSelect
          key={field.fieldKey}
          {...commonProps}
          options={field.options ?? []}
          containerClassName="w-full"
        />
      );
    }

    if (field.fieldType === 'RADIO') {
      return (
        <CustomRadioGroup
          key={field.fieldKey}
          {...commonProps}
          options={field.options ?? []}
          containerClassName="w-full"
        />
      );
    }

    if (field.fieldType === 'CHECKBOX' || field.fieldType === 'BOOLEAN') {
      return (
        <CustomToggle
          key={field.fieldKey}
          {...commonProps}
          control={control}
          containerClassName="w-full"
        />
      );
    }

    return null;
  };

  // Render a compound block (EVENT_DAY_REGISTRATION) as a locked section
  // Uses the Events component for event selection (eventDay is handled internally by Events)
  const renderCompoundBlock = (parentKey, subFields, compoundLabel, filteredEvents) => {
    const facultyField = subFields.find((f) => f.subFieldKey === 'faculty');
    const careerField = subFields.find((f) => f.subFieldKey === 'career');

    const careerValue = watchedValues[careerField?.fieldKey];
    const currentCareerValue = typeof careerValue === 'object' ? careerValue?.value : careerValue;

    return (
      <div
        key={parentKey}
        className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4"
      >
        <p className="text-sm font-semibold text-gray-700 border-b pb-2">
          {compoundLabel || 'Información del evento'}
        </p>

        {facultyField && (
          <CustomRadioGroup
            name={facultyField.fieldKey}
            register={register}
            options={faculties}
            label={facultyField.label}
            required={facultyField.required}
            error={errors[facultyField.fieldKey]}
            containerClassName="w-full"
          />
        )}

        {careerField && (
          <CustomSelect
            name={careerField.fieldKey}
            register={register}
            options={careers.map((c) => ({...c, label: c.description || c.label}))}
            label={careerField.label}
            required={careerField.required}
            error={errors[careerField.fieldKey]}
            containerClassName="w-full"
          />
        )}

        <Events
          events={filteredEvents}
          subscribed={subscribedTo}
          currentCareer={currentCareerValue}
          onEnrollment={onEnrollment}
        />
      </div>
    );
  };

  // Filter events by selected faculty for each compound block
  const getFilteredEvents = (subFields) => {
    const facultyField = subFields.find((f) => f.subFieldKey === 'faculty');
    const facultyValue = watchedValues[facultyField?.fieldKey];
    if (!events || !facultyValue) return [];
    return events.filter((e) => e.faculties?.includes(facultyValue));
  };

  // Get compound block label from the original template field
  const getCompoundLabel = (parentKey) => {
    const originalField = template.fields.find(
      (f) => f.fieldKey === parentKey && !f.parentFieldKey
    );
    return originalField?.label || 'Información del evento';
  };

  return (
    <div>
      {targetAudienceImage && (
        <img
          src={targetAudienceImage}
          className="w-full object-contain"
          alt="Banner"
        />
      )}
      <div className="px-4 py-6 mx-auto max-w-6xl">
        <h1 className="font-bold text-3xl text-center text-primary tracking-wide">
          {template.name || 'Formulario de inscripción'}
        </h1>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="w-full space-y-4"
        >
          {/* Atomic fields */}
          {atomicFields.map((field) => renderAtomicField(field))}

          {/* Compound blocks (EVENT_DAY_REGISTRATION) */}
          {Object.entries(groups).map(([parentKey, subFields]) =>
            renderCompoundBlock(
              parentKey,
              subFields,
              getCompoundLabel(parentKey),
              getFilteredEvents(subFields)
            )
          )}

          {errorMessage && (
            <CustomErrorAlert
              message={errorMessage}
              onClose={() => setErrorMessage('')}
            />
          )}

          <div className="flex justify-center items-center">
            <SubmitButton
              type="submit"
              label={submitButtonLabel}
              loading={isLookingUpPhone || onCreate.isPending || onUpdate.isPending}
              disabled={isLookingUpPhone}
              className="w-full flex justify-center items-center bg-primary text-white text-sm font-bold py-3.5 rounded-lg"
            />
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

export default DynamicForm;
