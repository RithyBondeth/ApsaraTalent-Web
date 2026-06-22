/* --------------------------------- Methods ---------------------------------- */
/**
 * Formats a JavaScript Date object into a YYYY-MM-DD string, suitable for HTML date input fields.
 *
 * @param date - The Date object to format
 * @returns A string in "YYYY-MM-DD" format
 */
export const formatDateForField = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
