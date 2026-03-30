import { Button } from "@/components/ui/button";
import { IExperience as Experience } from "@/utils/interfaces/resume";
import { useFieldArray } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import { IFormPanelProps } from "../props";
import { ExperienceCard } from "./experience-card";

/* -------------------------------- Component ------------------------------- */
export function ExperienceTab({
  register,
  control,
}: Pick<IFormPanelProps, "register" | "control">) {
  /* --------------------------------- Form --------------------------------- */
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  /* --------------------------------- Methods --------------------------------- */
  // ── Add Experience ─────────────────────────────────────────
  const addExperience = () => {
    append({
      company: "",
      position: "",
      startDate: "",
      endDate: "Present",
      description: "",
      achievements: [],
    } as Experience);
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-3">
      {/* Experience Cards Section */}
      {fields.map((f, i) => (
        <ExperienceCard
          key={f.id}
          index={i}
          register={register}
          control={control}
          onRemove={() => remove(i)}
          showRemove={fields.length > 1}
        />
      ))}

      {/* Add Experience Button Section */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full text-xs border-dashed"
        onClick={addExperience}
      >
        <PlusCircle size={13} className="mr-1.5" />
        Add Experience
      </Button>
    </div>
  );
}
