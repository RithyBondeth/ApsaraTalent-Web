import { z } from "zod";
import {
  RESUME_DRAFT_STORAGE_PREFIX,
  RESUME_DRAFT_VERSION,
  RESUME_EDITOR_DEFAULT_SECTION_ORDER,
  RESUME_LOCAL_STORAGE_KEY,
} from "@/utils/constants/resume.constant";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { RESUME_TEMPLATE_KEYS } from "@/utils/types/resume/resume.type";
import { CUSTOM_ACCENT_PATTERN } from "@/utils/functions/resume";

/* --------------------------------- Schemas --------------------------------- */
const templateSchema = z.enum(RESUME_TEMPLATE_KEYS);

const sectionSchema = z.enum([
  "summary",
  "experience",
  "skills",
  "education",
  "careerScopes",
]);

export const resumeDesignSchema = z.object({
  layout: z.enum(["single", "two-column", "left-sidebar", "right-sidebar"]),
  columnRatio: z.enum(["narrow", "balanced", "wide"]),
  headerLayout: z.enum(["stacked", "split", "centered", "compact"]),
  avatarPlacement: z.enum(["start", "center", "end"]),
  sidebarSections: z
    .array(z.enum(["summary", "skills", "education", "careerScopes"]))
    .min(1)
    .max(4)
    .refine((items) => new Set(items).size === items.length, {
      message: "Sidebar sections must be unique",
    }),
  palette: z.enum([
    "ocean",
    "cobalt",
    "violet",
    "emerald",
    "amber",
    "rose",
    "graphite",
    "midnight",
    "sand",
  ]),
  typography: z.enum(["sans", "serif", "geometric", "humanist", "mono"]),
  density: z.enum(["compact", "balanced", "spacious"]),
  headerStyle: z.enum(["solid", "soft", "minimal"]),
  sectionStyle: z.enum(["line", "bar", "pill", "plain"]),
  cornerStyle: z.enum(["square", "soft", "rounded"]),
  experienceStyle: z.enum(["plain", "cards", "timeline"]),
  skillsStyle: z.enum(["chips", "grid", "list"]),
  educationStyle: z.enum(["plain", "cards", "timeline"]),
  summaryStyle: z.enum(["plain", "highlight", "quote"]),
  decoration: z.enum(["none", "top-band", "side-band", "geometric"]),
  // Strict #RRGGBB — this value is rendered into PDF HTML, never loosen it.
  customAccent: z.string().regex(CUSTOM_ACCENT_PATTERN).optional(),
});

const optionalText = z.string().trim().max(5_000).optional();
const profilePictureSchema = z
  .string()
  .max(1_500_000)
  .regex(/^data:image\/(?:png|jpe?g|webp);base64,[a-z0-9+/]+={0,2}$/i)
  .optional();

export const resumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().trim().min(1, "Full name is required").max(200),
    email: z.string().trim().email("Enter a valid email address").max(320),
    phone: z.string().trim().max(80).optional(),
    location: z.string().trim().max(250).optional(),
    age: z.preprocess(
      (value) =>
        value === "" || value === null || Number.isNaN(value)
          ? undefined
          : value,
      z.number().int().min(14).max(100).optional(),
    ),
    profilePicture: profilePictureSchema,
    socials: z.record(z.string(), z.string().trim().max(2_000)).optional(),
    job: z.string().trim().max(250).optional(),
  }),
  summary: optionalText,
  yearsOfExperience: z.string().trim().max(100).optional(),
  availability: z.string().trim().max(200).optional(),
  experience: z
    .array(
      z.object({
        company: z.string().trim().max(250),
        position: z.string().trim().max(250),
        startDate: z.string().trim().max(100),
        endDate: z.string().trim().max(100).optional(),
        description: z.string().trim().max(5_000),
        achievements: z.array(z.string().trim().max(1_000)).max(30),
      }),
    )
    .max(30),
  skills: z.array(z.string().trim().min(1).max(200)).max(100),
  education: optionalText,
  careerScopes: z.array(z.string().trim().min(1).max(200)).max(50).optional(),
  sectionOrder: z
    .array(sectionSchema)
    .max(5)
    .refine((items) => new Set(items).size === items.length, {
      message: "Resume sections must be unique",
    })
    .optional(),
  design: resumeDesignSchema.optional(),
  template: templateSchema,
});

// Drafts intentionally accept incomplete text while a person is editing. The
// stricter schema above still gates PDF generation.
export const resumeDraftSchema = resumeSchema.extend({
  personalInfo: resumeSchema.shape.personalInfo.extend({
    fullName: z.string().trim().max(200),
    email: z.string().trim().max(320),
  }),
  skills: z.array(z.string().trim().max(200)).max(100),
  careerScopes: z.array(z.string().trim().max(200)).max(50).optional(),
});

const draftEnvelopeSchema = z.object({
  version: z.literal(RESUME_DRAFT_VERSION),
  ownerId: z.string().min(1),
  updatedAt: z.string().datetime(),
  data: resumeDraftSchema,
});

/* --------------------------------- Methods --------------------------------- */
export function normalizeResumePayload(data: IBuildResume): IBuildResume {
  return {
    ...data,
    sectionOrder:
      data.sectionOrder?.length &&
      new Set(data.sectionOrder).size === data.sectionOrder.length
        ? [...data.sectionOrder]
        : [...RESUME_EDITOR_DEFAULT_SECTION_ORDER],
  };
}

function draftKey(ownerId: string): string {
  return `${RESUME_DRAFT_STORAGE_PREFIX}:${ownerId}`;
}

export function saveResumeDraft(ownerId: string, data: IBuildResume): void {
  if (typeof window === "undefined") return;
  const parsed = resumeDraftSchema.safeParse(normalizeResumePayload(data));
  if (!parsed.success) return;
  window.sessionStorage.setItem(
    draftKey(ownerId),
    JSON.stringify({
      version: RESUME_DRAFT_VERSION,
      ownerId,
      updatedAt: new Date().toISOString(),
      data: parsed.data,
    }),
  );
}

export function loadResumeDraft(ownerId: string): IBuildResume | null {
  if (typeof window === "undefined") return null;
  const key = draftKey(ownerId);
  const saved = window.sessionStorage.getItem(key);
  if (!saved) return null;
  try {
    const parsed = draftEnvelopeSchema.safeParse(JSON.parse(saved));
    if (!parsed.success || parsed.data.ownerId !== ownerId) {
      window.sessionStorage.removeItem(key);
      return null;
    }
    return normalizeResumePayload(parsed.data.data as IBuildResume);
  } catch {
    window.sessionStorage.removeItem(key);
    return null;
  }
}

export function removeResumeDraft(ownerId: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(draftKey(ownerId));
}

export function removeLegacyResumeDraft(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(RESUME_LOCAL_STORAGE_KEY);
}
