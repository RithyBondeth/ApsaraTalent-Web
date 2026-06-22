/* --------------------------------- Methods ---------------------------------- */
/**
 * Capitalizes the first letter of each word in a string.
 *
 * @param str - The input string
 * @returns Capitalized-word string
 */
export const capitalizeWords = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
