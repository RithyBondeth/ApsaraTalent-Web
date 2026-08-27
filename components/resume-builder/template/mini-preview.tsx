"use client";

import { CSSProperties } from "react";
import {
  resolveResumeLayoutBlueprint,
  resolveResumeTemplateTheme,
} from "@/utils/functions/resume";
import { IResumeTemplateTheme } from "@/utils/interfaces/resume/resume-theme.interface";
import { RESUME_EDITOR_DEFAULT_SECTION_ORDER } from "@/utils/constants/resume.constant";
import {
  IResumeDesign,
  TResumeContentSection,
} from "@/utils/interfaces/resume/resume.interface";
import { TResumeTemplate } from "@/utils/types/resume/resume.type";
import { cn } from "@/lib/utils";

/* --------------------------------- Constants -------------------------------- */
// Metrics in the theme are tuned for the full-size editor canvas (~720px page);
// the mini preview renders the same tokens at thumbnail scale.
const MINI_SCALE = 0.34;
const FULL_PAGE_WIDTH = 720;
const SAMPLE_NAME = "Bondeth";
const SAMPLE_ROLE = "Product Designer";
const SECTION_LABELS: Record<TResumeContentSection, string> = {
  summary: "Profile",
  experience: "Experience",
  skills: "Skills",
  education: "Education",
  careerScopes: "Interests",
};

/* ---------------------------------- Helpers --------------------------------- */
/* Scale px */
function scalePx(value: number, min = 2): number {
  return Math.max(min, Math.round(value * MINI_SCALE));
}

/* Scale padding */
function scalePadding(padding: string, density = 1): string {
  return padding
    .split(" ")
    .map((part) => `${scalePx((parseInt(part, 10) || 0) * density)}px`)
    .join(" ");
}

/* Resolve the product font for sans-serif previews while preserving specialty styles. */
function resolvePreviewFont(font: string): string {
  const usesSpecialtyFont =
    font.includes("Georgia") ||
    font.includes("Courier") ||
    font.includes("Arial Black");

  return usesSpecialtyFont
    ? font
    : "var(--font-ubuntu), var(--font-kantumruy), sans-serif";
}

/* Small readable text used inside the miniature resume. */
function MiniText({
  children,
  color,
  size = 5,
  weight = 500,
  style,
}: {
  children: React.ReactNode;
  color: string;
  size?: number;
  weight?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        color,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.35,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* Section heading marker honoring the theme's sectionStyle */
function MiniSectionHeading({
  section,
  theme,
}: {
  section: TResumeContentSection;
  theme: IResumeTemplateTheme;
}) {
  const label = SECTION_LABELS[section];

  if (theme.sectionStyle === "pill") {
    return (
      <MiniText
        color={theme.accent}
        size={5}
        weight={800}
        style={{
          alignSelf: "flex-start",
          borderRadius: theme.chipRadius,
          background: theme.accentSoft,
          padding: "2px 5px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </MiniText>
    );
  }

  if (theme.sectionStyle === "bar") {
    return (
      <MiniText
        color={theme.background}
        size={5}
        weight={800}
        style={{
          alignSelf: "stretch",
          background: theme.accent,
          borderRadius: theme.radius,
          padding: "2px 4px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </MiniText>
    );
  }

  if (theme.sectionStyle === "line") {
    return (
      <MiniText
        color={theme.accent}
        size={5}
        weight={800}
        style={{
          borderBottom: `1.5px solid ${theme.accent}`,
          paddingBottom: 1.5,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </MiniText>
    );
  }

  return (
    <MiniText
      color={theme.text}
      size={5}
      weight={800}
      style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
    >
      {label}
    </MiniText>
  );
}

/* Miniature body section honoring per-section theme styles */
function MiniSection({
  section,
  theme,
  mutedLine,
  condensed = false,
}: {
  section: TResumeContentSection;
  theme: IResumeTemplateTheme;
  mutedLine: string;
  condensed?: boolean;
}) {
  const summary = (
    <div style={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <MiniText color={theme.textSecondary} size={4.6}>
        Product-focused designer creating clear, useful digital experiences.
      </MiniText>
      {!condensed && (
        <MiniText color={theme.muted} size={4.4}>
          Skilled in research, systems thinking, and collaborative delivery.
        </MiniText>
      )}
    </div>
  );

  let body: React.ReactNode = summary;

  if (section === "summary") {
    if (theme.summaryStyle === "highlight") {
      body = (
        <div
          style={{
            background: theme.accentSoft,
            borderRadius: theme.radius,
            padding: 5,
          }}
        >
          {summary}
        </div>
      );
    } else if (theme.summaryStyle === "quote") {
      body = (
        <div
          style={{ borderLeft: `2px solid ${theme.accent}`, paddingLeft: 5 }}
        >
          {summary}
        </div>
      );
    }
  }

  if (section === "experience") {
    const entryIndexes = condensed ? [0] : [0, 1];

    const entry = (index: number) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <MiniText color={theme.text} size={5} weight={750}>
            {index === 0 ? "Lead Product Designer" : "UX Designer"}
          </MiniText>
          <MiniText
            color={theme.muted}
            size={3.8}
            style={{ whiteSpace: "nowrap" }}
          >
            {index === 0 ? "2022—Now" : "2020—22"}
          </MiniText>
        </div>
        <MiniText color={theme.accent} size={4.2} weight={650}>
          {index === 0 ? "Apsara Studio" : "Lotus Digital"}
        </MiniText>
        {!condensed && (
          <MiniText color={theme.textSecondary} size={4.2}>
            {index === 0
              ? "Led product systems and research."
              : "Designed accessible customer journeys."}
          </MiniText>
        )}
      </div>
    );

    if (theme.experienceStyle === "cards") {
      body = (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {entryIndexes.map((i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${mutedLine}`,
                borderRadius: theme.radius,
                padding: 5,
              }}
            >
              {entry(i)}
            </div>
          ))}
        </div>
      );
    } else if (theme.experienceStyle === "timeline") {
      body = (
        <div
          style={{
            borderLeft: `2px solid ${theme.accent}`,
            paddingLeft: 7,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {entryIndexes.map((i) => (
            <div key={i} style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  top: 1,
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: theme.accent,
                }}
              />
              {entry(i)}
            </div>
          ))}
        </div>
      );
    } else {
      body = (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {entryIndexes.map((i) => (
            <div key={i}>{entry(i)}</div>
          ))}
        </div>
      );
    }
  }

  if (section === "skills") {
    const skills = ["Design", "Research", "Figma", "Strategy"];

    if (condensed) {
      body = (
        <MiniText color={theme.textSecondary} size={4.4}>
          Design · Research · Figma · Strategy
        </MiniText>
      );
    } else if (theme.skillsStyle === "chips") {
      body = (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {skills.map((skill) => (
            <div
              key={skill}
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: theme.chipRadius,
                background: theme.accentSoft,
                border: `1px solid ${theme.accent}22`,
                padding: "1px 3px",
                fontSize: 0,
                lineHeight: 1,
              }}
            >
              <MiniText color={theme.accent} size={3.6} weight={650}>
                {skill}
              </MiniText>
            </div>
          ))}
        </div>
      );
    } else if (theme.skillsStyle === "grid") {
      body = (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          {skills.map((skill) => (
            <div
              key={skill}
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: theme.radius,
                background: theme.accentSoft,
                borderLeft: `2px solid ${theme.accent}`,
                padding: "1px 2px",
                fontSize: 0,
                lineHeight: 1,
              }}
            >
              <MiniText color={theme.text} size={3.7} weight={650}>
                {skill}
              </MiniText>
            </div>
          ))}
        </div>
      );
    } else {
      body = (
        <MiniText color={theme.textSecondary} size={4.5}>
          Design · Research · Figma · Strategy
        </MiniText>
      );
    }
  }

  if (section === "education") {
    const education = (
      <div style={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <MiniText color={theme.text} size={4.8} weight={750}>
          BSc · Digital Media
        </MiniText>
        <MiniText color={theme.muted} size={4.1}>
          Royal University · 2020
        </MiniText>
      </div>
    );

    body =
      theme.educationStyle === "cards" && !condensed ? (
        <div
          style={{
            border: `1px solid ${mutedLine}`,
            borderRadius: theme.radius,
            padding: 5,
          }}
        >
          {education}
        </div>
      ) : (
        education
      );
  }

  if (section === "careerScopes") {
    body = condensed ? (
      <MiniText color={theme.textSecondary} size={4.4}>
        Technology · Design
      </MiniText>
    ) : (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {["Technology", "Design"].map((interest) => (
          <MiniText
            key={interest}
            color={theme.accent}
            size={4.1}
            weight={650}
            style={{
              borderBottom: `1px solid ${theme.accent}`,
              paddingBottom: 1,
            }}
          >
            {interest}
          </MiniText>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: condensed ? 2 : 4,
      }}
    >
      <MiniSectionHeading section={section} theme={theme} />
      {body}
    </div>
  );
}

/* ------------------------------ Main Component ------------------------------- */
/**
 * Faithful thumbnail of a resume template: renders the resolved palette,
 * typography, header, layout split, section styles, and representative content.
 */
export function TemplateMiniPreview({
  templateKey,
  design,
  className,
}: {
  templateKey: TResumeTemplate;
  design?: IResumeDesign;
  className?: string;
}) {
  /* ------------------------------- All States -------------------------------- */
  const theme = resolveResumeTemplateTheme(templateKey, design);
  const blueprint = resolveResumeLayoutBlueprint(theme, [
    ...RESUME_EDITOR_DEFAULT_SECTION_ORDER,
  ]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Muted Line ──────────────────────────────────────────────────
  const mutedLine = `${theme.muted}59`; // ~35% alpha placeholder lines

  // ── Section Gap ──────────────────────────────────────────────────
  const condensedPreview = blueprint.layout === "single";
  const sectionGap = condensedPreview
    ? 2
    : Math.max(4, Math.round(theme.sectionGap * MINI_SCALE * 0.72));

  // ── Sidebar Widths ────────────────────────────────────────────────
  // Sidebar widths in the blueprint are px against the full-size page —
  // convert to percentages so the miniature keeps the same proportions.
  const sidebarPct = Math.round(
    ((theme.columnRatio === "narrow"
      ? theme.sidebarWidth * 0.84
      : theme.columnRatio === "wide"
        ? theme.sidebarWidth * 1.18
        : theme.sidebarWidth) /
      FULL_PAGE_WIDTH) *
      100,
  );

  // ── Grid Template Columns ────────────────────────────────────────
  const gridTemplateColumns =
    blueprint.layout === "single"
      ? undefined
      : blueprint.layout === "two-column"
        ? blueprint.gridTemplateColumns
        : blueprint.layout === "left-sidebar"
          ? `${sidebarPct}% 1fr`
          : `1fr ${sidebarPct}%`;

  // ── Header Layout ────────────────────────────────────────────────
  const centered = theme.headerLayout === "centered";
  const stackedLike = centered || theme.headerLayout === "stacked";

  // ── Avatar Size ──────────────────────────────────────────────────
  const avatarSize = scalePx(
    stackedLike
      ? theme.avatarSize * 0.58
      : theme.headerLayout === "compact"
        ? theme.avatarSize * 0.7
        : theme.avatarSize,
    18,
  );

  // ── Header Align ────────────────────────────────────────────────
  const headerAlign =
    theme.avatarPlacement === "center"
      ? "center"
      : theme.avatarPlacement === "end"
        ? "flex-end"
        : "flex-start";

  // ── Render Column ────────────────────────────────────────────────
  const renderColumn = (sections: TResumeContentSection[]) => (
    <div style={{ display: "flex", flexDirection: "column", gap: sectionGap }}>
      {sections.map((section) => (
        <MiniSection
          key={section}
          section={section}
          theme={theme}
          mutedLine={mutedLine}
          condensed={condensedPreview}
        />
      ))}
    </div>
  );

  return (
    /* ------------------------------- Render UI ------------------------------- */
    <div
      aria-hidden
      data-resume-template-preview={templateKey}
      className={cn("relative select-none overflow-hidden", className)}
      style={{
        background: theme.background,
        fontFamily: resolvePreviewFont(theme.font),
      }}
    >
      {/* Decoration Section */}
      {theme.decoration === "top-band" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: theme.accent,
            zIndex: 2,
          }}
        />
      )}
      {theme.decoration === "side-band" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: 5,
            background: theme.accent,
            zIndex: 2,
          }}
        />
      )}
      {theme.decoration === "geometric" && (
        <>
          <div
            style={{
              position: "absolute",
              right: -22,
              bottom: -22,
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: theme.accent,
              opacity: 0.14,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 18,
              bottom: 26,
              width: 14,
              height: 14,
              background: theme.accent,
              opacity: 0.22,
            }}
          />
        </>
      )}

      {/* Header Section */}
      <div
        style={{
          background: theme.headerBackground,
          color: theme.headerText,
          padding: scalePadding(theme.headerPadding),
          display: "flex",
          flexDirection: stackedLike ? "column" : "row",
          alignItems: stackedLike ? headerAlign : "center",
          gap: stackedLike ? 5 : 8,
        }}
      >
        <div
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: theme.avatarRadius,
            background: theme.accentSoft,
            border: `1.5px solid ${theme.accent}`,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            color: theme.accent,
            fontSize: Math.max(6, avatarSize * 0.25),
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          B
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: centered ? "center" : "flex-start",
          }}
        >
          <span
            style={{
              fontSize: Math.max(10, scalePx(theme.nameSize, 10)),
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.035em",
              whiteSpace: "nowrap",
            }}
          >
            {SAMPLE_NAME}
          </span>
          <MiniText
            color={theme.headerText}
            size={5}
            weight={650}
            style={{ opacity: 0.72, letterSpacing: "0.03em" }}
          >
            {SAMPLE_ROLE}
          </MiniText>
        </div>
        {(theme.headerLayout === "split" ||
          theme.headerLayout === "compact") && (
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "flex-end",
            }}
          >
            <MiniText
              color={theme.headerText}
              size={4.1}
              style={{ opacity: 0.62, whiteSpace: "nowrap" }}
            >
              Phnom Penh
            </MiniText>
            <MiniText
              color={theme.headerText}
              size={4.1}
              style={{ opacity: 0.62, whiteSpace: "nowrap" }}
            >
              sokha@email.com
            </MiniText>
          </div>
        )}
      </div>

      {/* Body Section */}
      <div
        style={{
          padding: scalePadding(
            theme.contentPadding,
            condensedPreview ? 0.68 : 0.8,
          ),
          display: gridTemplateColumns ? "grid" : "flex",
          flexDirection: gridTemplateColumns ? undefined : "column",
          gridTemplateColumns,
          gap: scalePx(theme.sectionGap + 6, 8),
        }}
      >
        {blueprint.layout === "left-sidebar" ? (
          <>
            {renderColumn(blueprint.secondarySections)}
            {renderColumn(blueprint.primarySections)}
          </>
        ) : (
          <>
            {renderColumn(blueprint.primarySections)}
            {blueprint.secondarySections.length > 0 &&
              renderColumn(blueprint.secondarySections)}
          </>
        )}
      </div>
    </div>
  );
}
