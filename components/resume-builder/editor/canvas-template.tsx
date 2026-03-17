"use client";

import {
  BuildResume,
  Experience,
} from "@/app/(main)/resume-builder/_apis/generate-resume.api";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { useRef, useCallback, useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Plus, CalendarDays } from "lucide-react";
import { format, isValid, parse } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { SectionWrapper } from "./section-wrapper";
import { SectionId, useCanvasEditorStore } from "@/stores/canvas-editor.store";

/* ─── Types ─────────────────────────────────────────────────── */
interface CanvasTemplateProps {
  data: BuildResume;
  setValue: UseFormSetValue<BuildResume>;
  getValues: UseFormGetValues<BuildResume>;
}

/* ─── Editable field wrapper ─────────────────────────────────── */
function Editable({
  value,
  onCommit,
  placeholder = "Click to edit",
  className = "",
  multiline = false,
  style,
}: {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement & HTMLDivElement>(null);

  const handleBlur = useCallback(() => {
    if (!ref.current) return;
    const text = ref.current.innerText.trim();
    if (text !== value) onCommit(text);
  }, [value, onCommit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  const Tag = multiline ? "div" : "span";

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement & HTMLSpanElement>}
      contentEditable
      suppressContentEditableWarning
      data-canvas-editable="true"
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      style={style}
      className={[
        "outline-none rounded-sm cursor-text transition-all",
        "hover:ring-1 hover:ring-primary/30 hover:bg-primary/5",
        "focus:ring-2 focus:ring-primary/50 focus:bg-primary/8",
        "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 empty:before:italic",
        className,
      ].join(" ")}
    >
      {value}
    </Tag>
  );
}

/* ─── Inline date field ──────────────────────────────────────── */
function InlineDateField({
  value,
  placeholder,
  onCommit,
}: {
  value: string;
  placeholder: string;
  onCommit: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  // Parse the stored "MMMM yyyy" or "Month YYYY" string to a Date
  function parseDate(s: string): Date | undefined {
    if (!s || s.toLowerCase() === "present") return undefined;
    // Try "MMMM yyyy" (e.g. "January 2022")
    const d = parse(s, "MMMM yyyy", new Date());
    if (isValid(d)) return d;
    // Try "MMM yyyy" (e.g. "Jan 2022")
    const d2 = parse(s, "MMM yyyy", new Date());
    if (isValid(d2)) return d2;
    // Fallback
    const d3 = new Date(s);
    return isValid(d3) ? d3 : undefined;
  }

  return (
    <span className="group/date inline-flex items-center gap-0.5">
      <Editable value={value} placeholder={placeholder} onCommit={onCommit} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            title="Pick a date"
            className="opacity-0 group-hover/date:opacity-50 hover:!opacity-100 transition-opacity ml-0.5"
            style={{ color: "#9ca3af", lineHeight: 1 }}
          >
            <CalendarDays size={10} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" side="bottom">
          <Calendar
            mode="single"
            selected={parseDate(value)}
            onSelect={(d) => {
              if (d) {
                onCommit(format(d, "MMMM yyyy"));
              }
              setOpen(false);
            }}
            fromYear={1950}
            toYear={new Date().getFullYear() + 5}
            captionLayout="dropdown-buttons"
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </span>
  );
}

/* ─── Section heading ────────────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#4f46e5",
        borderBottom: "1.5px solid #ede9fe",
        paddingBottom: 3,
        marginTop: 18,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Ghost add button ───────────────────────────────────────── */
function GhostAddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="group/add flex items-center gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity duration-150 mt-2"
      style={{
        fontSize: 11,
        color: "#4f46e5",
        border: "1.5px dashed #c7d2fe",
        borderRadius: 6,
        padding: "3px 10px",
        background: "transparent",
        cursor: "pointer",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <Plus size={11} />
      {label}
    </button>
  );
}

/* ─── Avatar field ───────────────────────────────────────────── */
function AvatarField({
  src,
  onCommit,
}: {
  src?: string;
  onCommit: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so re-selecting the same file triggers onChange again
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      // Resize + compress to max 200×200px, JPEG quality 0.7
      // to keep the base64 payload small for the backend API
      const img = new Image();
      img.onload = () => {
        const MAX = 200;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const cvs = document.createElement("canvas");
        cvs.width = w;
        cvs.height = h;
        cvs.getContext("2d")!.drawImage(img, 0, 0, w, h);
        onCommit(cvs.toDataURL("image/jpeg", 0.7));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      className="group/avatar relative shrink-0 cursor-pointer"
      style={{ width: 72, height: 72 }}
      onClick={(e) => {
        e.stopPropagation();
        inputRef.current?.click();
      }}
      title="Click to change photo"
    >
      {/* Avatar image or placeholder */}
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Profile"
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
            border: "2px solid #e5e7eb",
          }}
        />
      ) : (
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#ede9fe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #a5b4fc",
            color: "#6366f1",
            fontSize: 11,
            fontWeight: 500,
            textAlign: "center",
            lineHeight: 1.3,
            padding: 4,
          }}
        >
          Add Photo
        </div>
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center"
        style={{
          borderRadius: "50%",
          background: "rgba(79,70,229,0.55)",
          color: "#fff",
          fontSize: 10,
          fontWeight: 600,
          textAlign: "center",
          lineHeight: 1.3,
          pointerEvents: "none",
        }}
      >
        Change
        <br />
        Photo
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}

/* ─── Experience entry ───────────────────────────────────────── */
function ExperienceEntry({
  exp,
  sortableId,
  index,
  setValue,
  getValues,
  onDelete,
}: {
  exp: Experience;
  sortableId: string;
  index: number;
  setValue: UseFormSetValue<BuildResume>;
  getValues: UseFormGetValues<BuildResume>;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        marginBottom: 14,
        position: "relative",
      }}
      className="group/entry"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        title="Drag to reorder"
        className="absolute -left-5 top-2 cursor-grab active:cursor-grabbing opacity-0 group-hover/entry:opacity-50 transition-opacity"
      >
        <GripVertical size={12} style={{ color: "#9ca3af" }} />
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Remove experience"
        className="absolute -right-5 top-0 opacity-0 group-hover/entry:opacity-60 hover:!opacity-100 transition-opacity"
        style={{ color: "#ef4444" }}
      >
        <X size={13} />
      </button>

      {/* Position + dates row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>
            <Editable
              value={exp.position || ""}
              placeholder="Position"
              onCommit={(v) =>
                setValue(`experience.${index}.position`, v, {
                  shouldDirty: true,
                })
              }
            />
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>
            <Editable
              value={exp.company || ""}
              placeholder="Company"
              onCommit={(v) =>
                setValue(`experience.${index}.company`, v, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>
        {/* Dates */}
        <div
          style={{
            fontSize: 11,
            color: "#9ca3af",
            whiteSpace: "nowrap",
            marginLeft: 8,
            flexShrink: 0,
          }}
        >
          <InlineDateField
            value={exp.startDate || ""}
            placeholder="Start date"
            onCommit={(v) =>
              setValue(`experience.${index}.startDate`, v, {
                shouldDirty: true,
              })
            }
          />
          {" – "}
          <InlineDateField
            value={exp.endDate || "Present"}
            placeholder="End date"
            onCommit={(v) =>
              setValue(`experience.${index}.endDate`, v, { shouldDirty: true })
            }
          />
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          marginTop: 4,
          fontSize: 12,
          color: "#374151",
          lineHeight: 1.55,
        }}
      >
        <Editable
          value={exp.description || ""}
          placeholder="Describe your role…"
          multiline
          onCommit={(v) =>
            setValue(`experience.${index}.description`, v, {
              shouldDirty: true,
            })
          }
          style={{ display: "block" }}
        />
      </div>

      {/* Achievements */}
      {(exp.achievements || []).length > 0 && (
        <ul style={{ marginTop: 4, marginLeft: 16, padding: 0 }}>
          {exp.achievements.map((ach, ai) => (
            <li
              key={ai}
              style={{ fontSize: 12, color: "#374151", marginBottom: 2 }}
              className="group/ach relative"
            >
              <Editable
                value={ach}
                placeholder="Achievement"
                onCommit={(v) =>
                  setValue(
                    `experience.${index}.achievements.${ai}` as `experience.${number}.achievements.${number}`,
                    v,
                    { shouldDirty: true },
                  )
                }
              />
              {/* Delete achievement */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const curr = getValues(
                    `experience.${index}.achievements`,
                  ) as string[];
                  setValue(
                    `experience.${index}.achievements`,
                    curr.filter((_, i) => i !== ai),
                    { shouldDirty: true },
                  );
                }}
                className="absolute -right-4 top-0 opacity-0 group-hover/ach:opacity-60 hover:!opacity-100 transition-opacity"
                style={{ color: "#ef4444" }}
                title="Remove achievement"
              >
                <X size={10} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add achievement */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          const curr =
            (getValues(`experience.${index}.achievements`) as string[]) || [];
          setValue(`experience.${index}.achievements`, [...curr, ""], {
            shouldDirty: true,
          });
        }}
        className="opacity-0 group-hover/entry:opacity-60 hover:!opacity-100 transition-opacity flex items-center gap-0.5 mt-1"
        style={{ fontSize: 10, color: "#4f46e5" }}
        title="Add achievement"
      >
        <Plus size={9} />
        achievement
      </button>
    </div>
  );
}

/* ─── Skill chip ─────────────────────────────────────────────── */
function SkillChip({
  skill,
  sortableId,
  index,
  setValue,
  onDelete,
}: {
  skill: string;
  sortableId: string;
  index: number;
  setValue: UseFormSetValue<BuildResume>;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId });

  return (
    <span
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        display: "inline-flex",
        alignItems: "center",
        background: "#ede9fe",
        color: "#4f46e5",
        fontSize: 11,
        padding: "2px 6px 2px 8px",
        borderRadius: 99,
        margin: "2px 3px",
        cursor: "grab",
      }}
      className="group/chip"
      {...attributes}
      {...listeners}
    >
      <Editable
        value={skill}
        placeholder="Skill"
        onCommit={(v) =>
          setValue(`skills.${index}` as `skills.${number}`, v, {
            shouldDirty: true,
          })
        }
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className="opacity-0 group-hover/chip:opacity-70 hover:!opacity-100 transition-opacity ml-1"
        style={{ color: "#ef4444", lineHeight: 1 }}
        title="Remove skill"
      >
        <X size={9} />
      </button>
    </span>
  );
}

/* ─── Main canvas template ───────────────────────────────────── */
export default function CanvasTemplate({
  data,
  setValue,
  getValues,
}: CanvasTemplateProps) {
  const {
    personalInfo,
    summary,
    experience,
    skills,
    education,
    yearsOfExperience,
    availability,
  } = data;

  const { sectionOrder } = useCanvasEditorStore();

  // PointerSensor with distance constraint so a click doesn't start a drag
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  /* ── Stable sortable IDs ──────────────────────────────────────
   * Use stable IDs based on position + a short hash so React
   * can reconcile correctly even after reorders.  */
  const expIds = (experience || []).map((_, i) => `exp-${i}`);
  const skillIds = (skills || []).map((_, i) => `skill-${i}`);

  // Education stored as "|"-separated lines.
  // Use local state so add/delete/edit re-render immediately without waiting
  // for the 600 ms debounce on the parent's previewData.
  const parseEducationLines = (raw?: string): string[] =>
    raw ? raw.split("|").map((l) => l.trim()) : [];

  const [educationLines, setEducationLinesState] = useState<string[]>(() =>
    parseEducationLines(education),
  );

  // Sync from parent when the debounced data prop changes (e.g. form-panel edits)
  useEffect(() => {
    setEducationLinesState(parseEducationLines(education));
  }, [education]);

  /** Commit an edited education line and write back to the "|"-separated string */
  function commitEducationLine(idx: number, value: string) {
    const next = [...educationLines];
    next[idx] = value;
    setEducationLinesState(next);
    const nonEmpty = next.filter(Boolean);
    setValue("education", nonEmpty.join(" | "), { shouldDirty: true });
  }

  /** Persist the full lines array as the education string */
  function setEducationLines(lines: string[]) {
    setEducationLinesState(lines);
    const nonEmpty = lines.filter(Boolean);
    setValue("education", nonEmpty.length > 0 ? nonEmpty.join(" | ") : "", {
      shouldDirty: true,
    });
  }

  /* ── Add / Delete handlers ─────────────────────────────────── */
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

  function deleteExperience(i: number) {
    setValue(
      "experience",
      (getValues("experience") || []).filter((_, idx) => idx !== i),
      { shouldDirty: true },
    );
  }

  function addSkill() {
    setValue("skills", [...(getValues("skills") || []), ""], {
      shouldDirty: true,
    });
  }

  function deleteSkill(i: number) {
    setValue(
      "skills",
      (getValues("skills") || []).filter((_, idx) => idx !== i),
      { shouldDirty: true },
    );
  }

  /* ── Drag-end handlers ─────────────────────────────────────── */
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

  function handleSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const store = useCanvasEditorStore.getState();
    const from = store.sectionOrder.indexOf(active.id as SectionId);
    const to = store.sectionOrder.indexOf(over.id as SectionId);
    if (from === -1 || to === -1) return;
    store.reorderSections(from, to);
  }

  /* ── Section content renderers ────────────────────────────── */
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
              <SkillChip
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
            {/* Delete row */}
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
        {/* Add row */}
        <GhostAddButton
          label="Add Education"
          onClick={() => setEducationLines([...educationLines, ""])}
        />
      </div>
    </SectionWrapper>
  );

  const sectionMap: Record<SectionId, React.ReactNode> = {
    header: null, // header is always rendered first, not in sectionOrder
    summary: summarySection,
    experience: experienceSection,
    skills: skillsSection,
    education: educationSection,
    careerScopes: null, // hidden — not shown in canvas or PDF
  };

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
      {/* ── Header (always first, not reorderable) ─────────────── */}
      <SectionWrapper sectionId="header" isDraggable={false}>
        <div
          style={{
            borderBottom: "2px solid #4f46e5",
            paddingBottom: 14,
            marginBottom: 16,
          }}
        >
          {/* Avatar + name/title row */}
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

          {/* Contact row */}
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
                  value={personalInfo.age.toString()}
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

          {/* Meta row */}
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

          {/* Social links */}
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
                          v as unknown as Record<string, string>,
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

      {/* ── Draggable sections ─────────────────────────────────── */}
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
