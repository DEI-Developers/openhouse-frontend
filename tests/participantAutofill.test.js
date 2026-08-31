import assert from 'node:assert/strict';
import test from 'node:test';
import getParticipantFormValues from '../src/utils/helpers/getParticipantFormValues.js';

const fields = [
  {fieldKey: 'name'},
  {fieldKey: 'email'},
  {fieldKey: 'confirmEmail'},
  {fieldKey: 'institute'},
  {fieldKey: 'networks', fieldType: 'SELECT'},
  {fieldKey: 'custom-phone', fieldType: 'TEL'},
  {fieldKey: 'custom-answer'},
];

test('fills the principal form profile through a generated phone key', () => {
  const participant = {
    id: 'participant-1',
    name: 'Test Participant',
    email: 'participant@example.com',
    confirmEmail: 'participant@example.com',
    institute: 'Test Institute',
    networks: {value: 'Instagram', label: 'Instagram'},
    phoneNumber: '+50370123456',
  };
  const values = {'custom-answer': 'Keep my response', secondaryPhone: '+50370123457'};
  const result = getParticipantFormValues({
    fields,
    values,
    phoneNumber: '+50370123456',
    phoneFieldKey: 'custom-phone',
    participant,
  });

  for (const key of ['id', 'name', 'email', 'confirmEmail', 'institute']) {
    assert.equal(result[key], participant[key]);
  }
  assert.equal(result.networks, 'Instagram');
  assert.equal(result['custom-phone'], participant.phoneNumber);
  assert.equal(result.phoneNumber, participant.phoneNumber);
  assert.equal(result['custom-answer'], 'Keep my response');
  assert.equal(result.secondaryPhone, values.secondaryPhone);
  assert.equal(values.id, undefined);
});

test('clears previous identity and profile without deleting unrelated answers', () => {
  const result = getParticipantFormValues({
    fields,
    values: {id: 'old-id', name: 'Old name', email: 'old@example.com', 'custom-answer': 'Keep'},
    phoneNumber: '+50370123457',
    phoneFieldKey: 'custom-phone',
    participant: null,
    clearParticipant: true,
  });

  assert.equal(result.id, null);
  for (const key of ['name', 'email', 'confirmEmail', 'institute', 'networks']) {
    assert.equal(result[key], '');
  }
  assert.equal(result.phoneNumber, '+50370123457');
  assert.equal(result['custom-phone'], '+50370123457');
  assert.equal(result['custom-answer'], 'Keep');
});

test('preserves manually entered profile data when no previous participant was loaded', () => {
  const result = getParticipantFormValues({
    fields,
    values: {name: 'New participant', email: 'new@example.com'},
    phoneNumber: '+50370123456',
    phoneFieldKey: 'custom-phone',
    participant: null,
  });

  assert.equal(result.name, 'New participant');
  assert.equal(result.email, 'new@example.com');
  assert.equal(result.id, null);
});

test('does not infer participant fields from labels or field types', () => {
  const result = getParticipantFormValues({
    fields: [{fieldKey: 'generated-name', fieldType: 'TEXT', label: 'Nombre completo'}],
    values: {'generated-name': 'Authored answer'},
    phoneNumber: '+50370123456',
    phoneFieldKey: 'phoneNumber',
    participant: {id: 'participant-1', name: 'Test Participant'},
  });

  assert.equal(result['generated-name'], 'Authored answer');
  assert.equal(result.name, undefined);
});
