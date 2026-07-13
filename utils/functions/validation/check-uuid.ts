/* --------------------------------- Method ---------------------------------- */
/**
 * Validates whether a given string is a valid standard Version 1-5 UUID.
 *
 * @param value - The string to check
 * @returns boolean true if the string matches UUID layout, false otherwise
 */
export const isUuid = (value: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};
