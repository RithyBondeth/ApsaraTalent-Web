"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { X } from "lucide-react";
import { SectionWrapper } from "../section-wrapper";
import { TResumeContentSection } from "@/utils/interfaces/resume/resume.interface";
import { useResumeCanvasEditorStore } from "@/stores/apis/resume/resume-canvas-editor.store";
import { ICanvasTemplateProps } from "./props";
import { Editable } from "./utils/editable";
import { SectionHeading } from "./utils/section-heading";
import { GhostAddButton } from "./utils/ghost-add-button";
import { AvatarField } from "./utils/avatar-field";
import { ExperienceEntry } from "./utils/experience-entry";
import { SkillChips } from "./utils/skill-chip";
import { RESUME_COLOR } from "@/utils/constants/resume-colors.constant";
import { ResumeTemplateThemeContext } from "@/hooks/resume/use-resume-template-theme";
import {
  resolveResumeLayoutBlueprint,
  resolveResumeTemplateTheme,
} from "@/utils/functions/resume/resume-theme";
import { useTranslations } from "next-intl";
import {
  formatSocialPlatformLabel,
  normalizeSocialLinkUrl,
} from "@/utils/functions/url/social-link";
import { getYearsExperienceSuffix } from "@/utils/functions/resume/format-resume-meta";

/* ---------------------------------- Helper --------------------------------- */
/**
 * Education is stored as a "|"-separated string in the DB.
 * Parse it into an array of strings for the editable canvas UI.
 */
const parseEducationLines = (raw?: string): string[] =>
  raw ? raw.split("|").map((l) => l.trim()) : [];

export default function CanvasTemplate(props: ICanvasTemplateProps) {
  /* ----------------------------------- Props -------------------------------- */
  const { data, setValue, getValues } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const {
    personalInfo,
    summary,
    experience,
    skills,
    education,
    yearsOfExperience,
    availability,
    careerScopes,
  } = data;
  const theme = resolveResumeTemplateTheme(data.template, data.design);
  const t = useTranslations("resumeBuilder");
  const socialLinks = Object.entries(personalInfo.socials ?? {}).filter(
    ([, url]) => Boolean(url?.trim()),
  );
  const yearsExperienceSuffix = yearsOfExperience
    ? getYearsExperienceSuffix(yearsOfExperience, t("yearsExperienceSuffix"))
    : "";
  const { sectionOrder } = useResumeCanvasEditorStore();

  /* -------------------------------- All States ------------------------------ */
  const [educationLines, setEducationLinesState] = useState<string[]>(() =>
    parseEducationLines(education),
  );

  /* PointerSensor with distance constraint so a click doesn't start a drag */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  const expIds = (experience || []).map((_, i) => `exp-${i}`);
  const skillIds = (skills || []).map((_, i) => `skill-${i}`);

  /* --------------------------------- Effects --------------------------------- */
  // Sync from parent when the debounced data prop changes (e.g. form-panel edits)
  useEffect(() => {
    setEducationLinesState(parseEducationLines(education));
  }, [education]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Commit Education Line ──────────────────────────────────────────
  function commitEducationLine(idx: number, value: string) {
    const next = [...educationLines];
    next[idx] = value;
    setEducationLinesState(next);
    const nonEmpty = next.filter(Boolean);
    setValue("education", nonEmpty.join(" | "), { shouldDirty: true });
  }

  // ── Set Education Lines ────────────────────────────────────────────
  function setEducationLines(lines: string[]) {
    setEducationLinesState(lines);
    const nonEmpty = lines.filter(Boolean);
    setValue("education", nonEmpty.length > 0 ? nonEmpty.join(" | ") : "", {
      shouldDirty: true,
    });
  }

  // ── Add and Delete Handlers ────────────────────────────────────────
  function addExperience() {
    setValue(
      "experience",
      [
        ...(getValues("experience") || []),
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "Present",
          description: "",
          achievements: [],
        },
      ],
      { shouldDirty: true },
    );
  }

  // ── Delete Experience ────────────────────────────────────────────────
  function deleteExperience(i: number) {
    setValue(
      "experience",
      (getValues("experience") || []).filter((_, idx) => idx !== i),
      { shouldDirty: true },
    );
  }

  // ── Add Skill ────────────────────────────────────────────────────────
  function addSkill() {
    setValue("skills", [...(getValues("skills") || []), ""], {
      shouldDirty: true,
    });
  }

  // ── Delete Skill ─────────────────────────────────────────────────────
  function deleteSkill(i: number) {
    setValue(
      "skills",
      (getValues("skills") || []).filter((_, idx) => idx !== i),
      { shouldDirty: true },
    );
  }

  // ── Handle Experience Drag End ────────────────────────────────────────
  function handleExpDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = expIds.indexOf(active.id as string);
    const to = expIds.indexOf(over.id as string);
    if (from === -1 || to === -1) return;
    setValue("experience", arrayMove([...(experience || [])], from, to), {
      shouldDirty: true,
    });
  }

  // ── Handle Skill Drag End ────────────────────────────────────────────
  function handleSkillDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = skillIds.indexOf(active.id as string);
    const to = skillIds.indexOf(over.id as string);
    if (from === -1 || to === -1) return;
    setValue("skills", arrayMove([...(skills || [])], from, to), {
      shouldDirty: true,
    });
  }

  // ── Handle Section Drag End ────────────────────────────────────────────
  function handleSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const store = useResumeCanvasEditorStore.getState();
    const from = store.sectionOrder.indexOf(active.id as TResumeContentSection);
    const to = store.sectionOrder.indexOf(over.id as TResumeContentSection);
    if (from === -1 || to === -1) return;
    store.reorderSections(from, to);
  }

  /* ------------------------------ Section Content Renderers ----------------------------- */
  // ── Summary UI Section ────────────────────────────────────────────────
  const summarySection =
    summary !== undefined ? (
      <SectionWrapper sectionId="summary" isDraggable>
        <SectionHeading>{t("professionalSummaryHeading")}</SectionHeading>
        <div
          style={{
            fontSize: 12,
            color: theme.textSecondary,
            lineHeight: theme.lineHeight,
            padding:
              theme.summaryStyle === "highlight"
                ? theme.experiencePadding
                : theme.summaryStyle === "quote"
                  ? "3px 0 3px 14px"
                  : undefined,
            background:
              theme.summaryStyle === "highlight" ? theme.accentSoft : undefined,
            borderLeft:
              theme.summaryStyle === "quote"
                ? `4px solid ${theme.accent}`
                : undefined,
            borderRadius:
              theme.summaryStyle === "highlight" ? theme.radius : undefined,
            fontStyle: theme.summaryStyle === "quote" ? "italic" : undefined,
          }}
        >
          <Editable
            value={summary || ""}
            placeholder={t("summaryPlaceholder")}
            multiline
            onCommit={(v) => setValue("summary", v, { shouldDirty: true })}
            style={{ display: "block" }}
          />
        </div>
      </SectionWrapper>
    ) : null;

  // ── Experience UI Section ──────────────────────────────────────────────
  const experienceSection = (
    <SectionWrapper sectionId="experience" isDraggable>
      <SectionHeading>{t("workExperienceHeading")}</SectionHeading>
      <DndContext sensors={sensors} onDragEnd={handleExpDragEnd}>
        <SortableContext items={expIds} strategy={verticalListSortingStrategy}>
          {(experience || []).map((exp, i) => (
            <ExperienceEntry
              key={expIds[i]}
              sortableId={expIds[i]}
              exp={exp}
              index={i}
              setValue={setValue}
              getValues={getValues}
              onDelete={() => deleteExperience(i)}
            />
          ))}
        </SortableContext>
      </DndContext>
      <GhostAddButton label={t("addExperience")} onClick={addExperience} />
    </SectionWrapper>
  );

  // ── Skills UI Section ────────────────────────────────────────────────
  const skillsSection = (
    <SectionWrapper sectionId="skills" isDraggable>
      <SectionHeading>{t("skills")}</SectionHeading>
      <div
        style={{
          marginTop: 4,
          display: theme.skillsStyle === "grid" ? "grid" : undefined,
          gridTemplateColumns:
            theme.skillsStyle === "grid" ? "1fr 1fr" : undefined,
          gap: theme.skillsStyle === "grid" ? "5px 12px" : undefined,
        }}
      >
        <DndContext sensors={sensors} onDragEnd={handleSkillDragEnd}>
          <SortableContext
            items={skillIds}
            strategy={horizontalListSortingStrategy}
          >
            {(skills || []).map((s, i) => (
              <SkillChips
                key={skillIds[i]}
                sortableId={skillIds[i]}
                skill={s}
                index={i}
                setValue={setValue}
                onDelete={() => deleteSkill(i)}
              />
            ))}
          </SortableContext>
        </DndContext>
        <GhostAddButton label={t("addSkill")} onClick={addSkill} />
      </div>
    </SectionWrapper>
  );

  // ── Education UI Section ──────────────────────────────────────────────
  const educationSection = (
    <SectionWrapper sectionId="education" isDraggable>
      <SectionHeading>{t("education")}</SectionHeading>
      <div style={{ fontSize: 12, color: theme.textSecondary }}>
        {educationLines.map((line, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              marginBottom: 6,
              padding: theme.educationStyle === "cards" ? "7px 9px" : undefined,
              border:
                theme.educationStyle === "cards"
                  ? `1px solid ${theme.accent}`
                  : undefined,
              borderLeft:
                theme.educationStyle === "timeline"
                  ? `3px solid ${theme.accent}`
                  : undefined,
              borderRadius:
                theme.educationStyle === "cards" ? theme.radius : undefined,
              background:
                theme.educationStyle === "cards" ? theme.accentSoft : undefined,
            }}
            className="group/edu"
          >
            <Editable
              value={line}
              placeholder={t("educationPlaceholder")}
              onCommit={(v) => commitEducationLine(i, v)}
              style={{ display: "block" }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEducationLines(educationLines.filter((_, idx) => idx !== i));
              }}
              title={t("removeEducation")}
              className="absolute -right-5 top-0 opacity-0 group-hover/edu:opacity-60 hover:!opacity-100 transition-opacity"
              style={{ color: RESUME_COLOR.DANGER }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <GhostAddButton
          label={t("addEducation")}
          onClick={() => setEducationLines([...educationLines, ""])}
        />
      </div>
    </SectionWrapper>
  );

  const careerScopesSection = (
    <SectionWrapper sectionId="careerScopes" isDraggable>
      <SectionHeading>{t("careerInterests")}</SectionHeading>
      <div style={{ marginTop: 4 }}>
        {(careerScopes || []).map((scope, index) => (
          <span
            key={`${scope}-${index}`}
            style={{
              display: "inline-block",
              color: theme.accent,
              border: `1px solid ${theme.accent}`,
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: theme.chipRadius,
              margin: "2px 3px",
              width: theme.skillsStyle === "grid" ? "45%" : undefined,
              background:
                theme.skillsStyle === "chips"
                  ? theme.accentSoft
                  : "transparent",
            }}
          >
            {scope}
          </span>
        ))}
      </div>
    </SectionWrapper>
  );

  // ── Section Map ────────────────────────────────────────────────────────
  const sectionMap: Record<TResumeContentSection, React.ReactNode> = {
    summary: summarySection,
    experience: experienceSection,
    skills: skillsSection,
    education: educationSection,
    careerScopes: careerScopesSection,
  };

  const {
    layout,
    primarySections: primaryOrder,
    secondarySections: secondaryOrder,
    gridTemplateColumns: bodyColumns,
    gridTemplateAreas: bodyAreas,
  } = resolveResumeLayoutBlueprint(theme, sectionOrder);
  const headerIsCentered =
    theme.headerLayout === "centered" || theme.avatarPlacement === "center";
  const headerIsVertical = headerIsCentered || theme.headerLayout === "stacked";
  const headerAlignment = headerIsCentered
    ? "center"
    : theme.avatarPlacement === "end"
      ? "flex-end"
      : "flex-start";

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <ResumeTemplateThemeContext.Provider value={theme}>
      <div
        style={{
          fontFamily: theme.font,
          background: theme.background,
          color: theme.text,
          fontSize: theme.bodyFontSize,
          lineHeight: theme.lineHeight,
          minHeight: 1123,
          boxSizing: "border-box",
          borderTop:
            theme.decoration === "top-band"
              ? `12px solid ${theme.accent}`
              : undefined,
          borderLeft:
            theme.decoration === "side-band"
              ? `12px solid ${theme.accent}`
              : undefined,
        }}
        data-design-palette={data.design?.palette ?? "template"}
        data-design-density={data.design?.density ?? "balanced"}
        data-design-sections={theme.sectionStyle}
        data-design-layout={layout}
      >
        {/* Header Section: Always rendered first, not reorderable */}
        <SectionWrapper sectionId="header" isDraggable={false}>
          <div
            style={{
              backgroundColor: theme.headerBackground,
              backgroundImage:
                theme.decoration === "geometric"
                  ? `linear-gradient(135deg, transparent 68%, ${theme.accent} 68%, ${theme.accent} 78%, transparent 78%)`
                  : undefined,
              color: theme.headerText,
              borderBottom:
                theme.layout === "single"
                  ? `3px solid ${theme.accent}`
                  : theme.headerStyle === "minimal"
                    ? `2px solid ${theme.accent}`
                    : undefined,
              padding: theme.headerPadding,
              textAlign:
                headerAlignment === "center"
                  ? "center"
                  : headerAlignment === "flex-end"
                    ? "right"
                    : "left",
            }}
          >
            {/* Avatar, Name, and Title Row Section */}
            <div
              style={{
                display: "flex",
                flexDirection: headerIsVertical
                  ? "column"
                  : theme.avatarPlacement === "end"
                    ? "row-reverse"
                    : "row",
                alignItems: headerIsVertical ? headerAlignment : "center",
                gap: theme.headerLayout === "compact" ? 12 : 18,
                marginBottom: 6,
              }}
            >
              <AvatarField
                src={personalInfo.profilePicture}
                onCommit={(v) =>
                  setValue("personalInfo.profilePicture", v, {
                    shouldDirty: true,
                  })
                }
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: theme.nameSize,
                    fontWeight: 700,
                    color: theme.headerText,
                    letterSpacing: -0.3,
                  }}
                >
                  <Editable
                    value={personalInfo.fullName || ""}
                    placeholder={t("yourNamePlaceholder")}
                    onCommit={(v) =>
                      setValue("personalInfo.fullName", v, {
                        shouldDirty: true,
                      })
                    }
                  />
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color:
                      theme.layout === "single"
                        ? theme.accent
                        : theme.headerText,
                    fontWeight: 500,
                    marginTop: 2,
                  }}
                >
                  <Editable
                    value={personalInfo.job || ""}
                    placeholder={t("jobTitlePlaceholder")}
                    onCommit={(v) =>
                      setValue("personalInfo.job", v, { shouldDirty: true })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Contact Row Section */}
            <div
              style={{
                marginTop: 6,
                display: "flex",
                flexWrap: "wrap",
                gap: 0,
                justifyContent: headerAlignment,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: theme.headerText,
                  marginRight: 14,
                }}
              >
                ✉{" "}
                <Editable
                  value={personalInfo.email || ""}
                  placeholder="email@example.com"
                  onCommit={(v) =>
                    setValue("personalInfo.email", v, { shouldDirty: true })
                  }
                />
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: theme.headerText,
                  marginRight: 14,
                }}
              >
                📞{" "}
                <Editable
                  value={personalInfo.phone || ""}
                  placeholder={t("phonePlaceholder")}
                  onCommit={(v) =>
                    setValue("personalInfo.phone", v, { shouldDirty: true })
                  }
                />
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: theme.headerText,
                  marginRight: 14,
                }}
              >
                📍{" "}
                <Editable
                  value={personalInfo.location || ""}
                  placeholder={t("locationPlaceholder")}
                  onCommit={(v) =>
                    setValue("personalInfo.location", v, { shouldDirty: true })
                  }
                />
              </span>
              {Number.isFinite(personalInfo.age) &&
                Number(personalInfo.age) > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      color: theme.headerText,
                      marginRight: 14,
                    }}
                  >
                    🎂 {t("age")}:{" "}
                    <Editable
                      value={personalInfo.age?.toString() || ""}
                      placeholder={t("age")}
                      onCommit={(v) =>
                        setValue("personalInfo.age", parseInt(v) || 0, {
                          shouldDirty: true,
                        })
                      }
                    />
                  </span>
                )}
            </div>

            {/* Meta Row Section */}
            {(yearsOfExperience || availability) && (
              <div style={{ marginTop: 4 }}>
                {yearsOfExperience && (
                  <span
                    style={{
                      fontSize: 11,
                      color: theme.headerText,
                      marginRight: 12,
                    }}
                  >
                    <Editable
                      value={yearsOfExperience}
                      placeholder={t("yearsExpPlaceholder")}
                      onCommit={(v) =>
                        setValue("yearsOfExperience", v, { shouldDirty: true })
                      }
                    />
                    {yearsExperienceSuffix ? ` ${yearsExperienceSuffix}` : ""}
                  </span>
                )}
                {availability && (
                  <span
                    style={{
                      fontSize: 11,
                      color: theme.headerText,
                      marginRight: 12,
                    }}
                  >
                    {t("availableLabel")}{" "}
                    <Editable
                      value={availability}
                      placeholder={t("availabilityPlaceholder")}
                      onCommit={(v) =>
                        setValue("availability", v, { shouldDirty: true })
                      }
                    />
                  </span>
                )}
              </div>
            )}

            {/* Social Links Section */}
            {socialLinks.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px 12px",
                  marginTop: 6,
                }}
              >
                {socialLinks.map(([platform, url]) => {
                  const label = formatSocialPlatformLabel(platform);
                  const href = normalizeSocialLinkUrl(url);

                  return href ? (
                    <a
                      key={platform}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={href}
                      onPointerDown={(event) => event.stopPropagation()}
                      style={{
                        alignItems: "center",
                        color: theme.headerText,
                        display: "inline-flex",
                        fontSize: 11,
                        fontWeight: 600,
                        gap: 3,
                        textDecoration: "underline",
                        textUnderlineOffset: 2,
                      }}
                    >
                      <span>{label}</span>
                      <span aria-hidden="true" style={{ fontSize: 9 }}>
                        ↗
                      </span>
                    </a>
                  ) : (
                    <span
                      key={platform}
                      style={{
                        color: theme.headerText,
                        fontSize: 11,
                        opacity: 0.7,
                      }}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </SectionWrapper>

        {/* AI-Composed Primary and Secondary Content Regions Section */}
        <DndContext sensors={sensors} onDragEnd={handleSectionDragEnd}>
          <div
            style={{
              padding: theme.contentPadding,
              minWidth: 0,
              display: layout === "single" ? "block" : "grid",
              gridTemplateColumns: bodyColumns,
              gridTemplateAreas: bodyAreas,
              gap: Math.max(18, theme.sectionGap),
              alignItems: "start",
            }}
          >
            <main style={{ gridArea: "primary", minWidth: 0 }}>
              <SortableContext
                items={primaryOrder}
                strategy={verticalListSortingStrategy}
              >
                {primaryOrder.map((id: TResumeContentSection) => (
                  <div key={id}>{sectionMap[id]}</div>
                ))}
              </SortableContext>
            </main>

            {secondaryOrder.length > 0 && (
              <aside
                style={{
                  gridArea: "secondary",
                  minWidth: 0,
                  padding:
                    layout === "two-column"
                      ? undefined
                      : theme.experiencePadding,
                  borderRadius:
                    layout === "two-column" ? undefined : theme.radius,
                  background:
                    layout === "two-column" ? undefined : theme.accentSoft,
                }}
              >
                <SortableContext
                  items={secondaryOrder}
                  strategy={verticalListSortingStrategy}
                >
                  {secondaryOrder.map((id: TResumeContentSection) => (
                    <div key={id}>{sectionMap[id]}</div>
                  ))}
                </SortableContext>
              </aside>
            )}
          </div>
        </DndContext>
      </div>
    </ResumeTemplateThemeContext.Provider>
  );
}
