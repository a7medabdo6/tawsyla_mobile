import {
    validateString,
    validateEmail,
    validatePassword,
    validateNumber,
    validateCreditCardNumber,
    validateExpiryDate,
    validateCVV,
    validateConfirmPassword
  } from '../ValidationConstraints';
  
  export const validateInput = (inputId: string, inputValue: string, password?: string): string | undefined => {
    if (
      inputId === 'fullName' ||
      inputId === 'firstName' ||
      inputId === 'lastName' ||
      inputId === 'location' ||
      inputId === 'phoneNumber' ||
      inputId === 'phone' ||
      inputId === 'state' ||
      inputId === 'city' ||
      inputId === 'additionalInfo' ||
      inputId === 'appartment' ||
      inputId === 'destination' ||
      inputId === 'ageRange' ||
      inputId === 'description' ||
      inputId === 'about' ||
      inputId === 'creditCardHolderName' ||
      inputId === 'addressLine1' ||
      inputId === 'addressLine2'  
    ) {
      return validateString(inputId, inputValue);
    } else if (inputId === 'email' || 
      inputId === 'currentEmail' || 
      inputId === 'newEmail') {
      return validateEmail(inputId, inputValue);
    } else if (
      inputId === 'password' || 
      inputId === 'currentPassword' || 
      inputId === 'newPassword' ||
      inputId === 'confirmNewPassword'
      ) {
      return validatePassword(inputId, inputValue);
    } else if (inputId === 'confirmPassword') {
      // Special handling for confirmPassword validation
      if (password) {
        return validateConfirmPassword(inputId, inputValue, password);
      } else {
        return validatePassword(inputId, inputValue);
      }
    } else if (inputId === 'resetToken') {
      return validateString(inputId, inputValue);
    } else if(inputId === 'places') {
      return validateNumber(inputId, inputValue)
    }else if(inputId === 'creditCardNumber'){
      return validateCreditCardNumber(inputId, inputValue)
    }else if(inputId === 'creditCardExpiryDate'){
        return validateExpiryDate(inputId, inputValue)
    }else if(inputId === 'cvv'){
        return validateCVV(inputId, inputValue)
    }
  };