"use client";

import { createContext, useContext } from "react";
import {
  IResumeDesign,
  TResumeContentSection,
} from "@/utils/interfaces/resume/resume.interface";
import { TResumeTemplate } from "@/utils/types/resume/resume.type";
import {
  deriveCustomAccentColors,
  isValidCustomAccent,
} from "@/utils/functions/resume/resume-color";

export interface ResumeTemplateTheme {
  accent: string;
  accentSoft: string;
  background: string;
  headerBackground: string;
  headerText: string;
  text: string;
  textSecondary: string;
  muted: string;
  layout: IResumeDesign["layout"];
  font: string;
  radius: string;
  bodyFontSize: number;
  lineHeight: number;
  sidebarWidth: number;
  headerPadding: string;
  contentPadding: string;
  avatarSize: number;
  nameSize: number;
  sectionGap: number;
  experiencePadding: string;
  chipRadius: string;
  avatarRadius: string;
  sectionStyle: IResumeDesign["sectionStyle"];
  headerStyle: IResumeDesign["headerStyle"];
  columnRatio: IResumeDesign["columnRatio"];
  headerLayout: IResumeDesign["headerLayout"];
  avatarPlacement: IResumeDesign["avatarPlacement"];
  sidebarSections: IResumeDesign["sidebarSections"];
  experienceStyle: IResumeDesign["experienceStyle"];
  skillsStyle: IResumeDesign["skillsStyle"];
  educationStyle: IResumeDesign["educationStyle"];
  summaryStyle: IResumeDesign["summaryStyle"];
  decoration: IResumeDesign["decoration"];
}

const DEFAULT_METRICS = {
  radius: "8px",
  bodyFontSize: 13,
  lineHeight: 1.5,
  sidebarWidth: 225,
  headerPadding: "34px 28px",
  contentPadding: "30px 34px",
  avatarSize: 88,
  nameSize: 25,
  sectionGap: 24,
  experiencePadding: "10px 12px",
  chipRadius: "999px",
  avatarRadius: "50%",
  sectionStyle: "line" as const,
  headerStyle: "solid" as const,
  columnRatio: "balanced" as const,
  headerLayout: "split" as const,
  avatarPlacement: "start" as const,
  sidebarSections: [
    "skills",
    "education",
    "careerScopes",
  ] as IResumeDesign["sidebarSections"],
  experienceStyle: "plain" as const,
  skillsStyle: "chips" as const,
  educationStyle: "plain" as const,
  summaryStyle: "plain" as const,
  decoration: "none" as const,
};

function theme(
  accent: string,
  accentSoft: string,
  background: string,
  headerBackground: string,
  headerText: string,
  layout: ResumeTemplateTheme["layout"],
  font = "Arial, Helvetica, sans-serif",
  overrides: Partial<ResumeTemplateTheme> = {},
): ResumeTemplateTheme {
  return {
    accent,
    accentSoft,
    background,
    headerBackground,
    headerText,
    text: headerText === "#18181B" ? "#27272A" : "#1E293B",
    textSecondary: "#374151",
    muted: "#64748B",
    layout,
    font,
    ...DEFAULT_METRICS,
    headerLayout: layout === "single" ? "centered" : "split",
    avatarPlacement: layout === "single" ? "center" : "start",
    ...overrides,
  };
}

export const RESUME_TEMPLATE_THEMES: Record<
  TResumeTemplate,
  ResumeTemplateTheme
> = {
  modern: theme(
    "#2563EB",
    "#DBEAFE",
    "#FFFFFF",
    "#172554",
    "#FFFFFF",
    "left-sidebar",
  ),
  classic: theme(
    "#27272A",
    "#E4E4E7",
    "#FFFFFF",
    "#FFFFFF",
    "#18181B",
    "single",
    "Georgia, 'Times New Roman', serif",
    { radius: "0", chipRadius: "0", avatarRadius: "0" },
  ),
  creative: theme(
    "#7C3AED",
    "#EDE9FE",
    "#FFFFFF",
    "#5B21B6",
    "#FFFFFF",
    "left-sidebar",
    undefined,
    { radius: "12px" },
  ),
  minimalist: theme(
    "#0284C7",
    "#E0F2FE",
    "#FFFFFF",
    "#FFFFFF",
    "#0F172A",
    "single",
    undefined,
    { radius: "0", chipRadius: "0", avatarRadius: "0" },
  ),
  timeline: theme(
    "#4F46E5",
    "#E0E7FF",
    "#FFFFFF",
    "#4338CA",
    "#FFFFFF",
    "single",
    undefined,
    { radius: "10px" },
  ),
  bold: theme(
    "#DC2626",
    "#FEE2E2",
    "#FFFFFF",
    "#18181B",
    "#FFFFFF",
    "left-sidebar",
    "Arial Black, Arial, sans-serif",
    { radius: "2px" },
  ),
  compact: theme(
    "#1D4ED8",
    "#DBEAFE",
    "#FFFFFF",
    "#1E40AF",
    "#FFFFFF",
    "two-column",
    undefined,
    {
      radius: "4px",
      bodyFontSize: 11.5,
      lineHeight: 1.35,
      sidebarWidth: 200,
      headerPadding: "24px 22px",
      contentPadding: "22px 26px",
      avatarSize: 72,
      nameSize: 22,
      sectionGap: 16,
      experiencePadding: "7px 9px",
    },
  ),
  elegant: theme(
    "#A16207",
    "#FEF3C7",
    "#FFFBEB",
    "#FEF3C7",
    "#422006",
    "left-sidebar",
    "Georgia, 'Times New Roman', serif",
    { radius: "10px" },
  ),
  colorful: theme(
    "#0F766E",
    "#CCFBF1",
    "#FFFFFF",
    "#0F766E",
    "#FFFFFF",
    "left-sidebar",
    undefined,
    { radius: "14px" },
  ),
  professional: theme(
    "#0369A1",
    "#E0F2FE",
    "#FFFFFF",
    "#F1F5F9",
    "#0F172A",
    "left-sidebar",
    undefined,
    { radius: "6px" },
  ),
  corporate: theme(
    "#1D4ED8",
    "#DBEAFE",
    "#FFFFFF",
    "#1E3A5F",
    "#FFFFFF",
    "two-column",
    undefined,
    { radius: "4px" },
  ),
  dark: theme(
    "#58A6FF",
    "#1C2128",
    "#161B22",
    "#0D1117",
    "#E6EDF3",
    "right-sidebar",
    "'Courier New', Courier, monospace",
    {
      radius: "6px",
      text: "#E6EDF3",
      textSecondary: "#A8B2C0",
      muted: "#8B949E",
    },
  ),
  executive: theme(
    "#B45309",
    "#FDE68A",
    "#FFFFFF",
    "#1C1917",
    "#F5F5F4",
    "right-sidebar",
    "Georgia, 'Times New Roman', serif",
    { radius: "0", chipRadius: "0", avatarRadius: "0" },
  ),
  tech: theme(
    "#10B981",
    "#D1FAE5",
    "#FFFFFF",
    "#022C22",
    "#ECFDF5",
    "left-sidebar",
    "'Courier New', Courier, monospace",
    { radius: "4px" },
  ),
  academic: theme(
    "#155E75",
    "#CFFAFE",
    "#FFFFFF",
    "#FFFFFF",
    "#164E63",
    "single",
    "Georgia, 'Times New Roman', serif",
    { radius: "0", chipRadius: "0", avatarRadius: "0" },
  ),
  startup: theme(
    "#EA580C",
    "#FFEDD5",
    "#FFFFFF",
    "#FFF7ED",
    "#7C2D12",
    "two-column",
    "'Trebuchet MS', Verdana, sans-serif",
    { radius: "14px" },
  ),
  swiss: theme(
    "#DC2626",
    "#FEE2E2",
    "#FFFFFF",
    "#FFFFFF",
    "#111827",
    "single",
    "Helvetica, Arial, sans-serif",
    { radius: "0", chipRadius: "0", avatarRadius: "0" },
  ),
  pastel: theme(
    "#BE185D",
    "#FCE7F3",
    "#FFFFFF",
    "#FCE7F3",
    "#831843",
    "right-sidebar",
    "Verdana, Geneva, sans-serif",
    { radius: "14px" },
  ),
};

export const DESIGN_PALETTES: Record<
  IResumeDesign["palette"],
  {
    accent: string;
    accentSoft: string;
    background: string;
    header: string;
    headerText: string;
    text: string;
    muted: string;
  }
> = {
  ocean: {
    accent: "#0E7490",
    accentSoft: "#CFFAFE",
    background: "#F8FEFF",
    header: "#164E63",
    headerText: "#FFFFFF",
    text: "#153243",
    muted: "#527080",
  },
  cobalt: {
    accent: "#2563EB",
    accentSoft: "#DBEAFE",
    background: "#FFFFFF",
    header: "#1E3A8A",
    headerText: "#FFFFFF",
    text: "#172554",
    muted: "#64748B",
  },
  violet: {
    accent: "#7C3AED",
    accentSoft: "#EDE9FE",
    background: "#FEFCFF",
    header: "#4C1D95",
    headerText: "#FFFFFF",
    text: "#2E1065",
    muted: "#6B6480",
  },
  emerald: {
    accent: "#047857",
    accentSoft: "#D1FAE5",
    background: "#FBFFFD",
    header: "#064E3B",
    headerText: "#FFFFFF",
    text: "#143D32",
    muted: "#5D746D",
  },
  amber: {
    accent: "#B45309",
    accentSoft: "#FEF3C7",
    background: "#FFFCF5",
    header: "#78350F",
    headerText: "#FFFFFF",
    text: "#451A03",
    muted: "#78716C",
  },
  rose: {
    accent: "#BE123C",
    accentSoft: "#FFE4E6",
    background: "#FFFDFD",
    header: "#881337",
    headerText: "#FFFFFF",
    text: "#4C0519",
    muted: "#7B6870",
  },
  graphite: {
    accent: "#475569",
    accentSoft: "#E2E8F0",
    background: "#FFFFFF",
    header: "#1E293B",
    headerText: "#FFFFFF",
    text: "#1E293B",
    muted: "#64748B",
  },
  midnight: {
    accent: "#60A5FA",
    accentSoft: "#1E293B",
    background: "#0F172A",
    header: "#020617",
    headerText: "#F8FAFC",
    text: "#E2E8F0",
    muted: "#94A3B8",
  },
  sand: {
    accent: "#A16207",
    accentSoft: "#FEF3C7",
    background: "#FFFBEB",
    header: "#713F12",
    headerText: "#FFFFFF",
    text: "#422006",
    muted: "#78716C",
  },
};

export const DESIGN_FONTS: Record<IResumeDesign["typography"], string> = {
  sans: "Arial, Helvetica, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  geometric: "'Trebuchet MS', Arial, sans-serif",
  humanist: "'Segoe UI', Arial, sans-serif",
  mono: "'Courier New', Courier, monospace",
};

const DESIGN_DENSITY: Record<
  IResumeDesign["density"],
  Pick<
    ResumeTemplateTheme,
    | "bodyFontSize"
    | "lineHeight"
    | "sidebarWidth"
    | "headerPadding"
    | "contentPadding"
    | "avatarSize"
    | "nameSize"
    | "sectionGap"
    | "experiencePadding"
  >
> = {
  compact: {
    bodyFontSize: 11.5,
    lineHeight: 1.35,
    sidebarWidth: 200,
    headerPadding: "24px 22px",
    contentPadding: "22px 26px",
    avatarSize: 72,
    nameSize: 22,
    sectionGap: 16,
    experiencePadding: "7px 9px",
  },
  balanced: {
    bodyFontSize: 13,
    lineHeight: 1.5,
    sidebarWidth: 225,
    headerPadding: "34px 28px",
    contentPadding: "30px 34px",
    avatarSize: 88,
    nameSize: 25,
    sectionGap: 24,
    experiencePadding: "10px 12px",
  },
  spacious: {
    bodyFontSize: 13.5,
    lineHeight: 1.65,
    sidebarWidth: 245,
    headerPadding: "40px 34px",
    contentPadding: "36px 42px",
    avatarSize: 96,
    nameSize: 28,
    sectionGap: 29,
    experiencePadding: "13px 15px",
  },
};

export function resolveResumeTemplateTheme(
  template: TResumeTemplate,
  design?: IResumeDesign,
): ResumeTemplateTheme {
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
  theme: ResumeTemplateTheme,
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

export const ResumeTemplateThemeContext = createContext<ResumeTemplateTheme>(
  RESUME_TEMPLATE_THEMES.modern,
);

export function useResumeTemplateTheme(): ResumeTemplateTheme {
  return useContext(ResumeTemplateThemeContext);
}
