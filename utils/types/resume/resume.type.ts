export const RESUME_TEMPLATE_KEYS = [
  "modern",
  "classic",
  "creative",
  "minimalist",
  "timeline",
  "bold",
  "compact",
  "elegant",
  "colorful",
  "professional",
  "corporate",
  "dark",
  "executive",
  "tech",
  "academic",
  "startup",
  "swiss",
  "pastel",
] as const;

export type TResumeTemplate = (typeof RESUME_TEMPLATE_KEYS)[number];

export function isResumeTemplateKey(value: string): value is TResumeTemplate {
  return (RESUME_TEMPLATE_KEYS as readonly string[]).includes(value);
}
