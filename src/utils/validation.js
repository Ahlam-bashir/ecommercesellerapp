import { isNonEmptyString } from './primitiveChecks';
import { LIMITS } from '../constants';
export function isEmailValid(_email) {
    if (isNonEmptyString(_email) && _email.trim().length > 0) {
      const email = _email.trim();
      const regexEmail = /^(?:[\w!#$%&'*+\-/=?^`{|}~]+\.)*[\w!#$%&'*+\-/=?^`{|}~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
      const regexE=/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)*$/
      if (!email.match(regexE)) {
        return false;
      }
      return true;
    }
    return false;
  }
  export function isNameValid(name) {
    const regex=/^[a-zA-Z ,.'-]*$/
    return (
      
       name.match(regex)
    );
  }

/*export function isPasswordValid(password) {
    // At least one number, one uppercase letter, one lowercase letter and one special symbol.
    const passwordregix = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,50}$/;
  
    return Array.isArray(password.match(passwordregix));
  }*/
/**
 * Basic validation for phone number
 *
 * @todo Add proper validation for mobile number
 */
 /*export function isPhoneNumberValid(phoneNumber) {
    return (
      isNonEmptyString(phoneNumber) &&
      phoneNumber.length >= LIMITS.minPhoneNumberLength
    );
  }*/
  export function isInvalidCharacters(name) {
    const regex=/^[A-Za-z0-9 _\-.'#&]*$/
    return (
      isNonEmptyString(name) && name.match(regex)
    );
  }
  export function Pincode(code){
    const regex=/^[0-9a-zA-Z]*$/
    return(
      isNonEmptyString(code) && code.match(regex) && code.length>=4
    )
  }
  export function isMinLength(name) {
   
    return (
      name.length >= 2  
    );
  }
  export function isPhoneLength(number){
  
    return (
      number.length>=7
    )
  }
  export function isPasswordValid(password) {
    // At least one number, one uppercase letter, one lowercase letter and one special symbol.
    const passwordregix = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,50}$/;
     const passwordRe=/[A-Za-z0-9@$!%*?&.]{6,}/
    return Array.isArray(password.match(passwordRe));
  }
/**
 * Basic validation for phone number
 *
 * @todo Add proper validation for mobile number
 */
export function isPhoneNumberValid(phoneNumber) {
   const regex=/(\+\d{1,3}[- ]?)?\d{7}/
    return (
       phoneNumber.match(regex)
    );
  }
  export function isMinLengthName(number){
  
    return (
      number.length>=3
    )
  }
  export function isPriceRange(number){
  
    return (
      number >=100000 || number<=0
    )
  }
  export function isMinDescritpion(name){
  
    return (
      name.length<=30
    )
  }
  export function isWidth(number){
    if(number>=3000){
      return true

    }else{
      return false
    }
  
  
  }
  