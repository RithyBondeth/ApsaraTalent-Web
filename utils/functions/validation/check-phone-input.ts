/* --------------------------------- Methods ---------------------------------- */
/**
 * Quick heuristic to verify if a login input is composed entirely of digits,
 * suggesting it's a phone number rather than an email address.
 */
export const isNumberPhoneInput = (inputValue: string) =>
  /^\d+$/.test(inputValue) && inputValue.length > 0;
