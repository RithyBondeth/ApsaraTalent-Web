"use client";

import { useResumeCanvasEditorStore } from "@/stores/apis/resume/resume-canvas-editor.store";
import { TResumeSectionID } from "@/utils/types/resume/resume-section-id.type";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ---------------------------------- Helpers --------------------------------- */
function SectionItem({
  id,
  label,
  isVisible,
  onToggle,
}: {
  id: TResumeSectionID;
  label: string;
  isVisible: boolean;
  onToggle: (id: TResumeSectionID) => void;
}) {
  /* -------------------------------- All State ------------------------------- */
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-lg border bg-card transition-colors ${
        !isVisible ? "opacity-60 bg-muted/30" : "shadow-sm"
      }`}
    >
      {/* Information Section */}
      <div className="flex items-center gap-3">
        {/* Drag Handle Section */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground"
        >
          <GripVertical size={16} />
        </div>

        {/* Section Name and Status Section */}
        <div className="flex flex-col">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {isVisible ? t("visible") : t("hidden")}
          </span>
        </div>
      </div>

      {/* Visibility Toggle Section */}
      <div className="flex items-center gap-2">
        {isVisible ? (
          <Eye size={14} className="text-primary" />
        ) : (
          <EyeOff size={14} className="text-muted-foreground" />
        )}
        <Switch
          checked={isVisible}
          onCheckedChange={() => onToggle(id)}
          className="scale-75"
        />
      </div>
    </div>
  );
}

export function LayoutTab() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");
  const allSections: { id: TResumeSectionID; label: string }[] = [
    { id: "summary", label: t("professionalSummary") },
    { id: "experience", label: t("tabExperience") },
    { id: "skills", label: t("tabSkills") },
    { id: "education", label: t("education") },
  ];

  /* ------------------------------- All State -------------------------------- */
  const { sectionOrder, reorderSections } = useResumeCanvasEditorStore();

  /* --------------------------------- Methods -------------------------------- */
  // ── Toggle Section Visibility ────────────────────────────────
  const handleToggle = (id: TResumeSectionID) => {
    const isVisible = sectionOrder.includes(id);
    if (isVisible) {
      useResumeCanvasEditorStore.setState((s) => ({
        sectionOrder: s.sectionOrder.filter((sid) => sid !== id),
      }));
    } else {
      useResumeCanvasEditorStore.setState((s) => ({
        sectionOrder: [...s.sectionOrder, id],
      }));
    }
  };

  // ── Reorder Sections ─────────────────────────────────────────
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const from = sectionOrder.indexOf(active.id as TResumeSectionID);
      const to = sectionOrder.indexOf(over.id as TResumeSectionID);
      reorderSections(from, to);
    }
  };

  // ── Dnd Context ──────────────────────────────────────────────
  const sensors = useSensors(useSensor(PointerSensor));

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">{t("sectionManagement")}</h4>
        <p className="text-xs text-muted-foreground">
          {t("sectionManagementDesc")}
        </p>
      </div>

      {/* Dnd Context Section */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          {/* Sortable Items Section */}
          <div className="flex flex-col gap-3">
            {/* Visible Sections */}
            {sectionOrder.map((id) => {
              const info = allSections.find((s) => s.id === id);
              if (!info) return null;
              return (
                <SectionItem
                  key={id}
                  id={id}
                  label={info.label}
                  isVisible={true}
                  onToggle={handleToggle}
                />
              );
            })}

            {/* Hidden Sections */}
            {allSections
              .filter((s) => !sectionOrder.includes(s.id))
              .map((info) => (
                <SectionItem
                  key={info.id}
                  id={info.id}
                  label={info.label}
                  isVisible={false}
                  onToggle={handleToggle}
                />
              ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Pro Tip Section */}
      <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
        <h5 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
          {t("proTip")}
        </h5>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("proTipDesc")}
        </p>
      </div>
    </div>
  );
}
