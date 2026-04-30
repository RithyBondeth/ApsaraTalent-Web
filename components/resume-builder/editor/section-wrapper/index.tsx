"use client";

import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useResumeCanvasEditorStore } from "@/stores/apis/resume/resume-canvas-editor.store";
import { ISectionWrapperProps } from "./props";

export function SectionWrapper(props: ISectionWrapperProps) {
  /* ---------------------------------- Props --------------------------------- */
  const { sectionId, children, isDraggable = false } = props;

  /* ----------------------------- API Integration ---------------------------- */
  const { selectedSection, setSelectedSection } = useResumeCanvasEditorStore();

  /* ---------------------------------- Utils --------------------------------- */
  const isSelected = selectedSection === sectionId;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionId, disabled: !isDraggable });

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedSection(sectionId);
      }}
      className={[
        "relative group/section rounded-sm transition-all duration-150",
        isSelected
          ? "ring-2 ring-blue-500 ring-offset-2"
          : "ring-0 hover:ring-1 hover:ring-blue-300/60 hover:ring-offset-1",
      ].join(" ")}
    >
      {/* Drag Handle Section: Only rendered for draggable sections */}
      {isDraggable && (
        <div
          {...attributes}
          {...listeners}
          title="Drag to reorder section"
          className={[
            "absolute -left-6 top-2 cursor-grab active:cursor-grabbing",
            "opacity-0 group-hover/section:opacity-50 transition-opacity duration-150",
            isSelected ? "!opacity-80" : "",
          ].join(" ")}
        >
          <GripVertical size={14} className="text-blue-500" />
        </div>
      )}

      {children}
    </div>
  );
}
