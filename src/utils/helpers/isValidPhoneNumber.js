import {PhoneNumberUtil} from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

const isValidPhoneNumber = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

export default isValidPhoneNumber;
