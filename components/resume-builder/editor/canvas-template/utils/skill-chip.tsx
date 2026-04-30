import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { UseFormSetValue } from "react-hook-form";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { Editable } from "./editable";

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
      {/* Editable Section */}
      <Editable
        value={skill}
        placeholder="Skill"
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
        style={{ color: "#ef4444", lineHeight: 1 }}
        title="Remove skill"
      >
        <X size={9} />
      </button>
    </span>
  );
}
