/**
 * Formatea un número de teléfono en el formato +XXX XXXX-XXXX
 * @param {string} phone - El número de teléfono a formatear
 * @returns {string} - El número formateado o el original si no coincide con el patrón
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) {
    return '-';
  }

  const match = phone.match(/^(\d{3})(\d{4})(\d{4})$/);

  if (match) {
    const [, countryCode, firstPart, secondPart] = match;
    return `+${countryCode} ${firstPart}-${secondPart}`;
  }

  return phone;
};