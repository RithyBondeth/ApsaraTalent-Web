"use client";

import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SectionId,
  useCanvasEditorStore,
} from "@/stores/apis/resume/resume-canvas-editor.store";

interface SectionWrapperProps {
  sectionId: SectionId;
  children: React.ReactNode;
  /** When true the section participates in the section-level DnD context */
  isDraggable?: boolean;
}

/**
 * Wraps each resume section with:
 * - Click-to-select → blue outline ring
 * - Hover drag handle (GripVertical) when `isDraggable`
 * - @dnd-kit sortable integration (disabled when !isDraggable)
 */
export function SectionWrapper({
  sectionId,
  children,
  isDraggable = false,
}: SectionWrapperProps) {
  /* ----------------------------- API Integration ---------------------------- */
  const { selectedSection, setSelectedSection } = useCanvasEditorStore();
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
      {/* Drag handle — only rendered for draggable sections */}
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
