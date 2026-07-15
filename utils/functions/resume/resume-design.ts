import { IResumeDesign } from "@/utils/interfaces/resume/resume.interface";
import { TResumeTemplate } from "@/utils/types/resume/resume.type";
import { RESUME_TEMPLATE_THEMES } from "@/utils/constants/resume-theme.constant";

/* --------------------------------- Options --------------------------------- */
/** Single source of truth for every editable design dimension. */
export const RESUME_DESIGN_OPTIONS = {
  palette: [
    "ocean",
    "cobalt",
    "violet",
    "emerald",
    "amber",
    "rose",
    "graphite",
    "midnight",
    "sand",
  ],
  typography: ["sans", "serif", "geometric", "humanist", "mono"],
  density: ["compact", "balanced", "spacious"],
  layout: ["single", "two-column", "left-sidebar", "right-sidebar"],
  columnRatio: ["narrow", "balanced", "wide"],
  headerLayout: ["stacked", "split", "centered", "compact"],
  headerStyle: ["solid", "soft", "minimal"],
  avatarPlacement: ["start", "center", "end"],
  sectionStyle: ["line", "bar", "pill", "plain"],
  cornerStyle: ["square", "soft", "rounded"],
  decoration: ["none", "top-band", "side-band", "geometric"],
  experienceStyle: ["plain", "cards", "timeline"],
  skillsStyle: ["chips", "grid", "list"],
  educationStyle: ["plain", "cards", "timeline"],
  summaryStyle: ["plain", "highlight", "quote"],
  sidebarSections: ["summary", "skills", "education", "careerScopes"],
} as const satisfies {
  [K in keyof IResumeDesign]: readonly (IResumeDesign[K] extends Array<infer U>
    ? U
    : IResumeDesign[K])[];
};

/* --------------------------------- Helpers --------------------------------- */
// Closest design palette / typography for each named template accent
const TEMPLATE_PALETTES: Record<TResumeTemplate, IResumeDesign["palette"]> = {
  modern: "cobalt",
  classic: "graphite",
  creative: "violet",
  minimalist: "ocean",
  timeline: "cobalt",
  bold: "rose",
  compact: "cobalt",
  elegant: "sand",
  colorful: "emerald",
  professional: "ocean",
  corporate: "cobalt",
  dark: "midnight",
  executive: "amber",
  tech: "emerald",
  academic: "ocean",
  startup: "amber",
  swiss: "rose",
  pastel: "rose",
};

const TEMPLATE_TYPOGRAPHY: Partial<
  Record<TResumeTemplate, IResumeDesign["typography"]>
> = {
  classic: "serif",
  elegant: "serif",
  dark: "mono",
  executive: "serif",
  tech: "mono",
  academic: "serif",
  startup: "geometric",
  swiss: "geometric",
  pastel: "humanist",
};

function cornerStyleFromRadius(radius: string): IResumeDesign["cornerStyle"] {
  const px = parseFloat(radius) || 0;
  if (px === 0) return "square";
  return px <= 8 ? "soft" : "rounded";
}

/**
 * A complete IResumeDesign matching what the canvas renders when a template
 * has no custom design — the starting point for manual tweaks in the editor.
 */
export function buildTemplateBaseDesign(
  template: TResumeTemplate,
): IResumeDesign {
  const theme = RESUME_TEMPLATE_THEMES[template];
  return {
    layout: theme.layout,
    columnRatio: theme.columnRatio,
    headerLayout: theme.headerLayout,
    avatarPlacement: theme.avatarPlacement,
    sidebarSections: [...theme.sidebarSections],
    palette: TEMPLATE_PALETTES[template],
    typography: TEMPLATE_TYPOGRAPHY[template] ?? "sans",
    density: template === "compact" ? "compact" : "balanced",
    headerStyle: theme.headerStyle,
    sectionStyle: theme.sectionStyle,
    cornerStyle: cornerStyleFromRadius(theme.radius),
    experienceStyle: theme.experienceStyle,
    skillsStyle: theme.skillsStyle,
    educationStyle: theme.educationStyle,
    summaryStyle: theme.summaryStyle,
    decoration: theme.decoration,
  };
}

function pick<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

/** A random but always-valid design — the editor's "shuffle" button. */
export function shuffleResumeDesign(): IResumeDesign {
  const sidebarPool = [...RESUME_DESIGN_OPTIONS.sidebarSections].sort(
    () => Math.random() - 0.5,
  );
  return {
    layout: pick(RESUME_DESIGN_OPTIONS.layout),
    columnRatio: pick(RESUME_DESIGN_OPTIONS.columnRatio),
    headerLayout: pick(RESUME_DESIGN_OPTIONS.headerLayout),
    avatarPlacement: pick(RESUME_DESIGN_OPTIONS.avatarPlacement),
    sidebarSections: sidebarPool.slice(0, 1 + Math.floor(Math.random() * 3)),
    palette: pick(RESUME_DESIGN_OPTIONS.palette),
    typography: pick(RESUME_DESIGN_OPTIONS.typography),
    density: pick(RESUME_DESIGN_OPTIONS.density),
    headerStyle: pick(RESUME_DESIGN_OPTIONS.headerStyle),
    sectionStyle: pick(RESUME_DESIGN_OPTIONS.sectionStyle),
    cornerStyle: pick(RESUME_DESIGN_OPTIONS.cornerStyle),
    experienceStyle: pick(RESUME_DESIGN_OPTIONS.experienceStyle),
    skillsStyle: pick(RESUME_DESIGN_OPTIONS.skillsStyle),
    educationStyle: pick(RESUME_DESIGN_OPTIONS.educationStyle),
    summaryStyle: pick(RESUME_DESIGN_OPTIONS.summaryStyle),
    decoration: pick(RESUME_DESIGN_OPTIONS.decoration),
  };
}
