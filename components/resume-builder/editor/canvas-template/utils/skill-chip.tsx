import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { UseFormSetValue } from "react-hook-form";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { Editable } from "./editable";
import { RESUME_COLOR } from "@/utils/constants/resume-colors.constant";
import { useResumeTemplateTheme } from "../resume-template-theme";
import { useTranslations } from "next-intl";

export function SkillChips(props: {
  skill: string;
  sortableId: string;
  index: number;
  setValue: UseFormSetValue<IBuildResume>;
  onDelete: () => void;
}) {
  /* ----------------------------------- Props --------------------------------- */
  const { skill, sortableId, index, setValue, onDelete } = props;

  /* ---------------------------------- Utils ---------------------------------- */
  const theme = useResumeTemplateTheme();
  const t = useTranslations("resumeBuilder");
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
    <span
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        display: "inline-flex",
        alignItems: "center",
        background:
          theme.skillsStyle === "chips" ? theme.accentSoft : "transparent",
        color: theme.skillsStyle === "grid" ? theme.text : theme.accent,
        border:
          theme.skillsStyle === "chips"
            ? `1px solid ${theme.accent}`
            : undefined,
        borderBottom:
          theme.skillsStyle === "grid"
            ? `1px solid ${theme.accent}`
            : undefined,
        fontSize: 11,
        padding: theme.skillsStyle === "chips" ? "2px 6px 2px 8px" : "4px 2px",
        borderRadius:
          theme.skillsStyle === "chips" ? theme.chipRadius : undefined,
        margin: theme.skillsStyle === "chips" ? "2px 3px" : "1px 0",
        width: theme.skillsStyle === "list" ? "100%" : undefined,
        cursor: "grab",
      }}
      className="group/chip"
      {...attributes}
      {...listeners}
    >
      {theme.skillsStyle === "list" && (
        <span style={{ marginRight: 6 }}>•</span>
      )}
      {/* Editable Section */}
      <Editable
        value={skill}
        placeholder={t("skillPlaceholder")}
        onCommit={(v) =>
          setValue(`skills.${index}` as `skills.${number}`, v, {
            shouldDirty: true,
          })
        }
      />

      {/* Delete Button Section */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className="opacity-0 group-hover/chip:opacity-70 hover:!opacity-100 transition-opacity ml-1"
        style={{ color: RESUME_COLOR.DANGER, lineHeight: 1 }}
        title={t("removeSkill")}
      >
        <X size={9} />
      </button>
    </span>
  );
}
