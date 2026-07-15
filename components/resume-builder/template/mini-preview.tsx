"use client";

import { CSSProperties } from "react";
import {
  resolveResumeLayoutBlueprint,
  resolveResumeTemplateTheme,
  ResumeTemplateTheme,
} from "@/components/resume-builder/editor/canvas-template/resume-template-theme";
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
const MINI_SCALE = 0.42;
const FULL_PAGE_WIDTH = 720;
const SAMPLE_NAME = "Apsara Talent";

/* ---------------------------------- Helpers --------------------------------- */
function scalePx(value: number, min = 2): number {
  return Math.max(min, Math.round(value * MINI_SCALE));
}

function scalePadding(padding: string): string {
  return padding
    .split(" ")
    .map((part) => `${scalePx(parseInt(part, 10) || 0)}px`)
    .join(" ");
}

/** Solid placeholder line standing in for a run of text */
function Bar({
  width,
  height = 3,
  color,
  radius = 2,
  style,
}: {
  width: string;
  height?: number;
  color: string;
  radius?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height,
        background: color,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}

/** Section heading marker honoring the theme's sectionStyle */
function MiniSectionHeading({ theme }: { theme: ResumeTemplateTheme }) {
  if (theme.sectionStyle === "pill") {
    return (
      <div
        style={{
          width: 42,
          height: 9,
          borderRadius: 999,
          background: theme.accentSoft,
        }}
      />
    );
  }
  if (theme.sectionStyle === "bar") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <div style={{ width: 3, height: 8, background: theme.accent }} />
        <Bar width="34px" height={4} color={theme.accent} />
      </div>
    );
  }
  if (theme.sectionStyle === "line") {
    return (
      <div
        style={{
          borderBottom: `1.5px solid ${theme.accent}`,
          paddingBottom: 2,
          width: 46,
        }}
      >
        <Bar width="30px" height={4} color={theme.accent} />
      </div>
    );
  }
  return <Bar width="34px" height={4} color={theme.text} />;
}

/** Miniature body section honoring per-section theme styles */
function MiniSection({
  section,
  theme,
  mutedLine,
}: {
  section: TResumeContentSection;
  theme: ResumeTemplateTheme;
  mutedLine: string;
}) {
  const lines = (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Bar width="100%" color={mutedLine} />
      <Bar width="82%" color={mutedLine} />
      <Bar width="64%" color={mutedLine} />
    </div>
  );

  let body = lines;

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
          {lines}
        </div>
      );
    } else if (theme.summaryStyle === "quote") {
      body = (
        <div
          style={{ borderLeft: `2px solid ${theme.accent}`, paddingLeft: 5 }}
        >
          {lines}
        </div>
      );
    }
  }

  if (section === "experience") {
    const entry = (
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Bar width="56%" height={4} color={theme.text} />
        <Bar width="88%" color={mutedLine} />
        <Bar width="70%" color={mutedLine} />
      </div>
    );
    if (theme.experienceStyle === "cards") {
      body = (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${mutedLine}`,
                borderRadius: theme.radius,
                padding: 5,
              }}
            >
              {entry}
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
          {[0, 1].map((i) => (
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
              {entry}
            </div>
          ))}
        </div>
      );
    } else {
      body = (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {entry}
          {entry}
        </div>
      );
    }
  }

  if (section === "skills") {
    if (theme.skillsStyle === "chips") {
      body = (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {[26, 34, 22, 30].map((w, i) => (
            <div
              key={i}
              style={{
                width: w,
                height: 8,
                borderRadius: theme.chipRadius,
                background: theme.accentSoft,
              }}
            />
          ))}
        </div>
      );
    } else if (theme.skillsStyle === "grid") {
      body = (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 8,
                borderRadius: theme.radius,
                background: theme.accentSoft,
              }}
            />
          ))}
        </div>
      );
    } else {
      body = lines;
    }
  }

  if (section === "education" && theme.educationStyle === "cards") {
    body = (
      <div
        style={{
          border: `1px solid ${mutedLine}`,
          borderRadius: theme.radius,
          padding: 5,
        }}
      >
        {lines}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <MiniSectionHeading theme={theme} />
      {body}
    </div>
  );
}

/* --------------------------------- Component -------------------------------- */
/**
 * Honest thumbnail of a resume template: renders the exact theme tokens
 * (palette, header, layout split, section/chip styles, decoration) that the
 * editor canvas resolves for this template — no more hand-painted gradients.
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
  const theme = resolveResumeTemplateTheme(templateKey, design);
  const blueprint = resolveResumeLayoutBlueprint(theme, [
    ...RESUME_EDITOR_DEFAULT_SECTION_ORDER,
  ]);
  const mutedLine = `${theme.muted}59`; // ~35% alpha placeholder lines
  const sectionGap = scalePx(theme.sectionGap, 6);

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
  const gridTemplateColumns =
    blueprint.layout === "single"
      ? undefined
      : blueprint.layout === "two-column"
        ? blueprint.gridTemplateColumns
        : blueprint.layout === "left-sidebar"
          ? `${sidebarPct}% 1fr`
          : `1fr ${sidebarPct}%`;

  const centered = theme.headerLayout === "centered";
  const stackedLike = centered || theme.headerLayout === "stacked";
  const avatarSize = scalePx(
    theme.headerLayout === "compact"
      ? theme.avatarSize * 0.7
      : theme.avatarSize,
    18,
  );
  const headerAlign =
    theme.avatarPlacement === "center"
      ? "center"
      : theme.avatarPlacement === "end"
        ? "flex-end"
        : "flex-start";

  const renderColumn = (sections: TResumeContentSection[]) => (
    <div style={{ display: "flex", flexDirection: "column", gap: sectionGap }}>
      {sections.map((section) => (
        <MiniSection
          key={section}
          section={section}
          theme={theme}
          mutedLine={mutedLine}
        />
      ))}
    </div>
  );

  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden select-none", className)}
      style={{ background: theme.background, fontFamily: theme.font }}
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
          }}
        />
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
              fontWeight: 700,
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            }}
          >
            {SAMPLE_NAME}
          </span>
          <Bar
            width="52px"
            height={4}
            color={theme.headerText}
            style={{ opacity: 0.65 }}
          />
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
            <Bar
              width="38px"
              color={theme.headerText}
              style={{ opacity: 0.5 }}
            />
            <Bar
              width="30px"
              color={theme.headerText}
              style={{ opacity: 0.5 }}
            />
          </div>
        )}
      </div>

      {/* Body Section */}
      <div
        style={{
          padding: scalePadding(theme.contentPadding),
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
