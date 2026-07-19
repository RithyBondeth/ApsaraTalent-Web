import { TResumeContentSection } from "../interfaces/resume/resume.interface";
import { TResumeTemplate } from "../types/resume/resume.type";

/* --------------------------------- Config --------------------------------- */
export const LIVE_RESUME_PREVIEW_DEBOUNCE_MS = 600;
export const RESUME_SOURCE_MAX_LENGTH = 8_000;

/* ------------------------------ Editor Layout ----------------------------- */
export const RESUME_EDITOR_A4_WIDTH = 794;
/** A4 page height at 96dpi — one printed page in canvas coordinates. Drives
 *  the editor's page-break guides and page-count estimate. */
export const RESUME_EDITOR_A4_HEIGHT = 1123;
export const RESUME_EDITOR_ZOOM_STEP = 0.1;
export const RESUME_EDITOR_ZOOM_MIN = 0.5;
export const RESUME_EDITOR_ZOOM_MAX = 2.0;

/* ------------------------------ Storage Keys ------------------------------ */
/** Legacy key removed during migration to user-scoped session drafts. */
export const RESUME_LOCAL_STORAGE_KEY = "apsara-talent-resume-draft";
export const RESUME_DRAFT_STORAGE_PREFIX = "apsara-talent-resume-draft-v2";
export const RESUME_DRAFT_VERSION = 2;

export const RESUME_EDITOR_DEFAULT_SECTION_ORDER: TResumeContentSection[] = [
  "summary",
  "experience",
  "skills",
  "education",
  "careerScopes",
] as const;

/* ------------------------------ Template Labels ---------------------------- */
/** i18n key (resumeBuilder namespace) for each template — single source for
 *  the picker cards and the editor's template selector. */
export const RESUME_TEMPLATE_LABEL_KEYS: Record<TResumeTemplate, string> = {
  modern: "templateModern",
  classic: "templateClassic",
  creative: "templateCreative",
  minimalist: "templateMinimalist",
  timeline: "templateTimeline",
  bold: "templateBold",
  compact: "templateCompact",
  elegant: "templateElegant",
  colorful: "templateColorful",
  professional: "templateProfessional",
  corporate: "templateCorporate",
  dark: "templateDark",
  executive: "templateExecutive",
  tech: "templateTech",
  academic: "templateAcademic",
  startup: "templateStartup",
  swiss: "templateSwiss",
  pastel: "templatePastel",
};
