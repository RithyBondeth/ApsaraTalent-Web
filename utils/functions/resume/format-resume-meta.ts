/* --------------------------------- Methods --------------------------------- */
/**
 * Returns only the suffix needed by the editable experience value so labels
 * such as "3 - 5 years" do not become "3 - 5 years yrs exp.".
 */
export const getYearsExperienceSuffix = (
  value: string,
  defaultSuffix: string,
): string => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return "";
  if (/\b(?:experience|exp\.?)\s*$/i.test(trimmedValue)) return "";
  if (/\b(?:years?|yrs?\.?)\s*$/i.test(trimmedValue)) return "exp.";
  return defaultSuffix;
};
