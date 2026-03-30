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
import { TResumeSectionID } from "@/utils/types/resume/resume-section-id.type";
import { useResumeCanvasEditorStore } from "@/stores/apis/resume/resume-canvas-editor.store";
import { ICanvasTemplateProps } from "./props";
import { Editable } from "./utils/editable";
import { SectionHeading } from "./utils/section-heading";
import { GhostAddButton } from "./utils/ghost-add-button";
import { AvatarField } from "./utils/avatar-field";
import { ExperienceEntry } from "./utils/experience-entry";
import { SkillChips } from "./utils/skill-chip";

export default function CanvasTemplate(props: ICanvasTemplateProps) {
  /* ----------------------------------- Props -------------------------------- */
  const { data, setValue, getValues } = props;

  /* ----------------------------- API Integration ---------------------------- */
  const { sectionOrder } = useResumeCanvasEditorStore();

  /* -------------------------------- All States ------------------------------ */
  const [educationLines, setEducationLinesState] = useState<string[]>(() =>
    parseEducationLines(education),
  );

  /* ---------------------------------- Utils --------------------------------- */
  const {
    personalInfo,
    summary,
    experience,
    skills,
    education,
    yearsOfExperience,
    availability,
  } = data;

  /* PointerSensor with distance constraint so a click doesn't start a drag */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  /* ── Stable sortable ID
   * Use stable IDs based on position + a short hash so React
   * can reconcile correctly even after reorders.  */
  const expIds = (experience || []).map((_, i) => `exp-${i}`);
  const skillIds = (skills || []).map((_, i) => `skill-${i}`);

  /* ── Parse Education Lines
   * Education stored as "|"-separated lines.
   * Use local state so add/delete/edit re-render immediately without waiting
   * for the 600 ms debounce on the parent's previewData. */
  const parseEducationLines = (raw?: string): string[] =>
    raw ? raw.split("|").map((l) => l.trim()) : [];

  /* --------------------------------- Effects --------------------------------- */
  // Sync from parent when the debounced data prop changes (e.g. form-panel edits)
  useEffect(() => {
    setEducationLinesState(parseEducationLines(education));
  }, [education]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Commit Education Line ──────────────────────────────────────────
  /** Commit an edited education line and write back to the "|"-separated string */
  function commitEducationLine(idx: number, value: string) {
    const next = [...educationLines];
    next[idx] = value;
    setEducationLinesState(next);
    const nonEmpty = next.filter(Boolean);
    setValue("education", nonEmpty.join(" | "), { shouldDirty: true });
  }

  // ── Set Education Lines ────────────────────────────────────────────
  /** Persist the full lines array as the education string */
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
    const from = store.sectionOrder.indexOf(active.id as TResumeSectionID);
    const to = store.sectionOrder.indexOf(over.id as TResumeSectionID);
    if (from === -1 || to === -1) return;
    store.reorderSections(from, to);
  }

  /* ------------------------------ Section Content Renderers ----------------------------- */
  // ── Summary UI Section ────────────────────────────────────────────────
  const summarySection =
    summary !== undefined ? (
      <SectionWrapper sectionId="summary" isDraggable>
        <SectionHeading>Professional Summary</SectionHeading>
        <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>
          <Editable
            value={summary || ""}
            placeholder="Write a professional summary…"
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
      <SectionHeading>Work Experience</SectionHeading>
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
      <GhostAddButton label="Add Experience" onClick={addExperience} />
    </SectionWrapper>
  );

  // ── Skills UI Section ────────────────────────────────────────────────
  const skillsSection = (
    <SectionWrapper sectionId="skills" isDraggable>
      <SectionHeading>Skills</SectionHeading>
      <div style={{ marginTop: 4 }}>
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
        <GhostAddButton label="Add Skill" onClick={addSkill} />
      </div>
    </SectionWrapper>
  );

  // ── Education UI Section ──────────────────────────────────────────────
  const educationSection = (
    <SectionWrapper sectionId="education" isDraggable>
      <SectionHeading>Education</SectionHeading>
      <div style={{ fontSize: 12, color: "#374151" }}>
        {educationLines.map((line, i) => (
          <div
            key={i}
            style={{ position: "relative", marginBottom: 4 }}
            className="group/edu"
          >
            <Editable
              value={line}
              placeholder="e.g. BSc Computer Science, MIT, 2020"
              onCommit={(v) => commitEducationLine(i, v)}
              style={{ display: "block" }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEducationLines(educationLines.filter((_, idx) => idx !== i));
              }}
              title="Remove education entry"
              className="absolute -right-5 top-0 opacity-0 group-hover/edu:opacity-60 hover:!opacity-100 transition-opacity"
              style={{ color: "#ef4444" }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <GhostAddButton
          label="Add Education"
          onClick={() => setEducationLines([...educationLines, ""])}
        />
      </div>
    </SectionWrapper>
  );

  // ── Section Map ────────────────────────────────────────────────────────
  const sectionMap: Record<TResumeSectionID, React.ReactNode> = {
    header: null, // header is always rendered first, not in sectionOrder
    summary: summarySection,
    experience: experienceSection,
    skills: skillsSection,
    education: educationSection,
    careerScopes: null, // hidden — not shown in canvas or PDF
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        background: "#fff",
        color: "#111827",
        padding: "32px 36px 32px 44px", // extra left padding for drag handles
        fontSize: 13,
        lineHeight: 1.6,
        minHeight: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header Section: Always rendered first, not reorderable */}
      <SectionWrapper sectionId="header" isDraggable={false}>
        <div
          style={{
            borderBottom: "2px solid #4f46e5",
            paddingBottom: 14,
            marginBottom: 16,
          }}
        >
          {/* Avatar, Name, and Title Row Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
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
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing: -0.3,
                }}
              >
                <Editable
                  value={personalInfo.fullName || ""}
                  placeholder="Your Name"
                  onCommit={(v) =>
                    setValue("personalInfo.fullName", v, { shouldDirty: true })
                  }
                />
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#4f46e5",
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                <Editable
                  value={personalInfo.job || ""}
                  placeholder="Job Title"
                  onCommit={(v) =>
                    setValue("personalInfo.job", v, { shouldDirty: true })
                  }
                />
              </div>
            </div>
          </div>

          {/* Contact Row Section */}
          <div
            style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 0 }}
          >
            <span style={{ fontSize: 11, color: "#6b7280", marginRight: 14 }}>
              ✉{" "}
              <Editable
                value={personalInfo.email || ""}
                placeholder="email@example.com"
                onCommit={(v) =>
                  setValue("personalInfo.email", v, { shouldDirty: true })
                }
              />
            </span>
            <span style={{ fontSize: 11, color: "#6b7280", marginRight: 14 }}>
              📞{" "}
              <Editable
                value={personalInfo.phone || ""}
                placeholder="Phone"
                onCommit={(v) =>
                  setValue("personalInfo.phone", v, { shouldDirty: true })
                }
              />
            </span>
            <span style={{ fontSize: 11, color: "#6b7280", marginRight: 14 }}>
              📍{" "}
              <Editable
                value={personalInfo.location || ""}
                placeholder="Location"
                onCommit={(v) =>
                  setValue("personalInfo.location", v, { shouldDirty: true })
                }
              />
            </span>
            {personalInfo.age && (
              <span style={{ fontSize: 11, color: "#6b7280", marginRight: 14 }}>
                🎂 Age:{" "}
                <Editable
                  value={personalInfo.age?.toString() || ""}
                  placeholder="Age"
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
                  style={{ fontSize: 11, color: "#6b7280", marginRight: 12 }}
                >
                  <Editable
                    value={yearsOfExperience}
                    placeholder="Years of exp."
                    onCommit={(v) =>
                      setValue("yearsOfExperience", v, { shouldDirty: true })
                    }
                  />{" "}
                  yrs exp.
                </span>
              )}
              {availability && (
                <span
                  style={{ fontSize: 11, color: "#6b7280", marginRight: 12 }}
                >
                  Available:{" "}
                  <Editable
                    value={availability}
                    placeholder="Availability"
                    onCommit={(v) =>
                      setValue("availability", v, { shouldDirty: true })
                    }
                  />
                </span>
              )}
            </div>
          )}

          {/* Social Links Section */}
          {personalInfo.socials &&
            Object.keys(personalInfo.socials).length > 0 && (
              <div style={{ marginTop: 6 }}>
                {Object.entries(personalInfo.socials).map(([key, url]) => (
                  <span key={key} style={{ marginRight: 10, fontSize: 11 }}>
                    <span style={{ color: "#9ca3af" }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </span>{" "}
                    <Editable
                      value={url || ""}
                      placeholder={`https://${key}.com/...`}
                      onCommit={(v) =>
                        setValue(
                          `personalInfo.socials.${key}` as "personalInfo.socials",
                          v as any,
                          { shouldDirty: true },
                        )
                      }
                      style={{ color: "#4f46e5" }}
                    />
                  </span>
                ))}
              </div>
            )}
        </div>
      </SectionWrapper>

      {/* Draggable Sections */}
      <DndContext sensors={sensors} onDragEnd={handleSectionDragEnd}>
        <SortableContext
          items={sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          {sectionOrder.map((id) => (
            <div key={id}>{sectionMap[id]}</div>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
