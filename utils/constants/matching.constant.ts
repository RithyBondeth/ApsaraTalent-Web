/* ------------------------------ Cover Letter ------------------------------ */
export const COVER_LETTER_STYLES: { id: string; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
] as const;

/* --------------------------------- Types ---------------------------------- */
export type TCoverLetterStyle = (typeof COVER_LETTER_STYLES)[number]["id"];

/* ----------------------------- Interview Prep ----------------------------- */
// Question kind, not question severity — categorical tokens, so a "Situational"
// chip no longer wears the same amber as a real warning.
export const INTERVIEW_PREP_CHIP: Record<string, string> = {
  Technical: "bg-category-orange-subtle text-category-orange-accent",
  Behavioral: "bg-category-purple-subtle text-category-purple-accent",
  Situational: "bg-category-blue-subtle text-category-blue-accent",
  "Culture Fit": "bg-category-brown-subtle text-category-brown-accent",
} as const;
export const INTERVIEW_PREP_CHIP_FALLBACK = "bg-muted text-muted-foreground";
