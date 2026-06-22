/* --------------------------------- Method ---------------------------------- */
/**
 * Quick heuristic to check if a login input string resembles an email address
 * rather than a phone number. Looks for standard email characters or the '@' symbol.
 */
export const isEmailInput = (inputValue: string) =>
  /^[a-zA-Z@.\-_]+$/.test(inputValue) || inputValue.includes("@");
