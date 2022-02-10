import { isNonEmptyString } from './primitiveChecks';
import { LIMITS } from '../constants';
export function isEmailValid(_email) {
    if (isNonEmptyString(_email) && _email.trim().length > 0) {
      const email = _email.trim();
      const regexEmail = /^(?:[\w!#$%&'*+\-/=?^`{|}~]+\.)*[\w!#$%&'*+\-/=?^`{|}~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
      if (!email.match(regexEmail)) {
        return false;
      }
      return true;
    }
    return false;
  }

export function isPasswordValid(password) {
    // At least one number, one uppercase letter, one lowercase letter and one special symbol.
    const passwordregix = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,50}$/;
  
    return Array.isArray(password.match(passwordregix));
  }
/**
 * Basic validation for phone number
 *
 * @todo Add proper validation for mobile number
 */
 export function isPhoneNumberValid(phoneNumber) {
    return (
      isNonEmptyString(phoneNumber) &&
      phoneNumber.length >= LIMITS.minPhoneNumberLength
    );
  }