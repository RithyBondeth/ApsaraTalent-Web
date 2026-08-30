import {
  IResumeDesign,
  TResumeContentSection,
} from "@/utils/interfaces/resume/resume.interface";
import { TResumeTemplate } from "@/utils/types/resume/resume.type";
import { IResumeTemplateTheme } from "@/utils/interfaces/resume/resume-theme.interface";
import {
  deriveCustomAccentColors,
  isValidCustomAccent,
} from "@/utils/functions/resume";
import {
  RESUME_TEMPLATE_THEMES,
  DESIGN_PALETTES,
  DESIGN_FONTS,
  DESIGN_DENSITY,
} from "@/utils/constants/resume-theme.constant";

export function resolveResumeTemplateTheme(
  template: TResumeTemplate,
  design?: IResumeDesign,
): IResumeTemplateTheme {
  if (!design) return RESUME_TEMPLATE_THEMES[template];

  const palette = DESIGN_PALETTES[design.palette];
  // A user-picked accent overrides the palette's accent family while text,
  // muted and page background stay on the named palette for readability.
  const custom = isValidCustomAccent(design.customAccent)
    ? deriveCustomAccentColors(design.customAccent)
    : null;
  const accent = custom?.accent ?? palette.accent;
  const accentSoft = custom?.accentSoft ?? palette.accentSoft;
  const solidHeader = custom?.header ?? palette.header;
  const solidHeaderText = custom?.headerText ?? palette.headerText;
  const radius =
    design.cornerStyle === "square"
      ? "0"
      : design.cornerStyle === "soft"
        ? "7px"
        : "15px";
  const headerBackground =
    design.headerStyle === "solid"
      ? solidHeader
      : design.headerStyle === "soft"
        ? accentSoft
        : palette.background;
  const headerText =
    design.headerStyle === "solid" ? solidHeaderText : palette.text;

  return {
    accent,
    accentSoft,
    background: palette.background,
    headerBackground,
    headerText,
    text: palette.text,
    textSecondary: palette.text,
    muted: palette.muted,
    layout: design.layout,
    font: DESIGN_FONTS[design.typography],
    radius,
    ...DESIGN_DENSITY[design.density],
    chipRadius: design.cornerStyle === "rounded" ? "999px" : radius,
    avatarRadius:
      design.cornerStyle === "rounded"
        ? "50%"
        : design.cornerStyle === "soft"
          ? "14px"
          : "0",
    sectionStyle: design.sectionStyle,
    headerStyle: design.headerStyle,
    columnRatio: design.columnRatio,
    headerLayout: design.headerLayout,
    avatarPlacement: design.avatarPlacement,
    sidebarSections: [...design.sidebarSections],
    experienceStyle: design.experienceStyle,
    skillsStyle: design.skillsStyle,
    educationStyle: design.educationStyle,
    summaryStyle: design.summaryStyle,
    decoration: design.decoration,
  };
}

export function resolveResumeLayoutBlueprint(
  theme: IResumeTemplateTheme,
  sectionOrder: TResumeContentSection[],
) {
  const sidebarSectionSet = new Set<TResumeContentSection>(
    theme.sidebarSections,
  );
  const secondarySections =
    theme.layout === "single"
      ? []
      : sectionOrder.filter((section) => sidebarSectionSet.has(section));
  const secondarySectionSet = new Set<TResumeContentSection>(secondarySections);
  const primarySections = sectionOrder.filter(
    (section) => !secondarySectionSet.has(section),
  );
  const layout = secondarySections.length > 0 ? theme.layout : "single";
  const sidebarWidth = Math.round(
    theme.sidebarWidth *
      (theme.columnRatio === "narrow"
        ? 0.84
        : theme.columnRatio === "wide"
          ? 1.18
          : 1),
  );
  const twoColumnGrid =
    theme.columnRatio === "narrow"
      ? "1.65fr .75fr"
      : theme.columnRatio === "wide"
        ? "1.1fr 1fr"
        : "1.35fr 1fr";
  const gridTemplateColumns =
    layout === "single"
      ? undefined
      : layout === "two-column"
        ? twoColumnGrid
        : layout === "left-sidebar"
          ? `${sidebarWidth}px minmax(0, 1fr)`
          : `minmax(0, 1fr) ${sidebarWidth}px`;
  const gridTemplateAreas =
    layout === "left-sidebar"
      ? '"secondary primary"'
      : layout === "single"
        ? undefined
        : '"primary secondary"';

  return {
    layout,
    primarySections,
    secondarySections,
    gridTemplateColumns,
    gridTemplateAreas,
  };
}
