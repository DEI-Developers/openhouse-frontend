/* eslint-disable guard-for-in */
const empty = (mixedVar) => {
  const emptyValues = [
    undefined,
    null,
    false,
    0,
    '',
    '0',
    '0.0',
    '0.00',
    '0.000',
    '0.0000',
    '0.00000',
    '0.000000',
  ];

  for (let i = 0; i < emptyValues.length; i++) {
    if (mixedVar === emptyValues[i]) {
      return true;
    }
  }

  if (typeof mixedVar === 'object') {
    for (const key in mixedVar) {
      return false;
    }

    return true;
  }

  return false;
};

export default empty;
