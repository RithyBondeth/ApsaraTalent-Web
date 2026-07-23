import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { IExperience as Experience } from "@/utils/interfaces/resume/resume.interface";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Plus } from "lucide-react";
import { Editable } from "./editable";
import { InlineDateField } from "./inline-date-field";
import { RESUME_COLOR } from "@/utils/constants/resume-colors.constant";
import { useResumeTemplateTheme } from "@/hooks/resume/use-resume-template-theme";
import { useTranslations } from "next-intl";

export function ExperienceEntry(props: {
  exp: Experience;
  sortableId: string;
  index: number;
  setValue: UseFormSetValue<IBuildResume>;
  getValues: UseFormGetValues<IBuildResume>;
  onDelete: () => void;
}) {
  /* ----------------------------------- Props -------------------------------- */
  const { exp, sortableId, index, setValue, getValues, onDelete } = props;
  const theme = useResumeTemplateTheme();
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- All States ------------------------------ */
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId });

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
        marginBottom: Math.max(10, theme.sectionGap - 8),
        position: "relative",
        padding:
          theme.experienceStyle === "cards"
            ? theme.experiencePadding
            : theme.experienceStyle === "timeline"
              ? "3px 0 3px 14px"
              : undefined,
        border:
          theme.experienceStyle === "cards"
            ? `1px solid ${theme.accent}`
            : undefined,
        borderLeft:
          theme.experienceStyle === "timeline"
            ? `3px solid ${theme.accent}`
            : undefined,
        borderRadius:
          theme.experienceStyle === "cards" ? theme.radius : undefined,
        background:
          theme.experienceStyle === "cards" ? theme.accentSoft : undefined,
      }}
      className="group/entry"
    >
      {/* Drag Handle Section */}
      <div
        {...attributes}
        {...listeners}
        title={t("dragToReorder")}
        className="absolute -left-5 top-2 cursor-grab active:cursor-grabbing opacity-0 group-hover/entry:opacity-50 transition-opacity"
      >
        <GripVertical size={12} style={{ color: RESUME_COLOR.TEXT_SUBTLE }} />
      </div>

      {/* Delete Button Section */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title={t("removeExperience")}
        className="absolute -right-5 top-0 opacity-0 group-hover/entry:opacity-60 hover:!opacity-100 transition-opacity"
        style={{ color: RESUME_COLOR.DANGER }}
      >
        <X size={13} />
      </button>

      {/* Position and Dates Row Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {/* Position and Company Section */}
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: theme.text,
            }}
          >
            <Editable
              value={exp.position || ""}
              placeholder={t("positionPlaceholder")}
              onCommit={(v) =>
                setValue(`experience.${index}.position`, v, {
                  shouldDirty: true,
                })
              }
            />
          </div>
          <div
            style={{
              fontSize: 12,
              color: theme.muted,
              marginTop: 1,
            }}
          >
            <Editable
              value={exp.company || ""}
              placeholder={t("companyPlaceholder")}
              onCommit={(v) =>
                setValue(`experience.${index}.company`, v, {
                  shouldDirty: true,
                })
              }
            />
          </div>
        </div>

        {/* Dates Section */}
        <div
          style={{
            fontSize: 11,
            color: theme.muted,
            whiteSpace: "nowrap",
            marginLeft: 8,
            flexShrink: 0,
          }}
        >
          <InlineDateField
            value={exp.startDate || ""}
            placeholder={t("startDatePlaceholder")}
            onCommit={(v) =>
              setValue(`experience.${index}.startDate`, v, {
                shouldDirty: true,
              })
            }
          />
          {" - "}
          <InlineDateField
            value={exp.endDate || "Present"}
            placeholder={t("endDatePlaceholder")}
            onCommit={(v) =>
              setValue(`experience.${index}.endDate`, v, { shouldDirty: true })
            }
          />
        </div>
      </div>

      {/* Description Section */}
      <div
        style={{
          marginTop: 4,
          fontSize: 12,
          color: theme.textSecondary,
          lineHeight: 1.55,
        }}
      >
        <Editable
          value={exp.description || ""}
          placeholder={t("roleDescriptionPlaceholder")}
          multiline
          onCommit={(v) =>
            setValue(`experience.${index}.description`, v, {
              shouldDirty: true,
            })
          }
          style={{ display: "block" }}
        />
      </div>

      {/* Achievements Section */}
      {(exp.achievements || []).length > 0 && (
        <ul style={{ marginTop: 4, marginLeft: 16, padding: 0 }}>
          {exp.achievements.map((ach, ai) => (
            <li
              key={ai}
              style={{
                fontSize: 12,
                color: theme.textSecondary,
                marginBottom: 2,
              }}
              className="group/ach relative"
            >
              <Editable
                value={ach}
                placeholder={t("achievement")}
                onCommit={(v) =>
                  setValue(
                    `experience.${index}.achievements.${ai}` as `experience.${number}.achievements.${number}`,
                    v,
                    { shouldDirty: true },
                  )
                }
              />
              {/* Delete Achievement Button Section */}
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
                style={{ color: RESUME_COLOR.DANGER }}
                title={t("removeAchievement")}
              >
                <X size={10} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add Achievement Button Section */}
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
        style={{ fontSize: 10, color: theme.accent }}
        title={t("addAchievement")}
      >
        <Plus size={9} />
        {t("achievement").toLocaleLowerCase()}
      </button>
    </div>
  );
}
