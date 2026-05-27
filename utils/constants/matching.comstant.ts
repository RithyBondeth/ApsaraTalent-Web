/* ------------------------------ Cover Letter ------------------------------ */
export const COVER_LETTER_STYLES: { id: string; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
] as const;

export type TCoverLetterStyle = (typeof COVER_LETTER_STYLES)[number]["id"];

/* ------------------------------ Interview Prep ------------------------------ */
export const INTERVIEW_PREP_CHIP: Record<string, string> = {
  Technical: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Behavioral:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Situational:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Culture Fit":
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
} as const;
export const INTERVIEW_PREP_CHIP_FALLBACK = "bg-muted text-muted-foreground";
