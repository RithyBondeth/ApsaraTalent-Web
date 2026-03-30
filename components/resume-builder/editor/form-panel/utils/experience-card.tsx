import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { IExperience as Experience } from "@/utils/interfaces/resume/resume.interface";
import {
  UseFormRegister,
  Control,
  useFieldArray,
  useWatch,
  Path,
} from "react-hook-form";
import { PlusCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { FieldLabel } from "./field-label";

/* -------------------------------- Component ------------------------------- */
export function ExperienceCard({
  index,
  register,
  control,
  onRemove,
  showRemove,
}: {
  index: number;
  register: UseFormRegister<IBuildResume>;
  control: Control<IBuildResume>;
  onRemove: () => void;
  showRemove: boolean;
}) {
  /* -------------------------------- All States ------------------------------ */
  const [open, setOpen] = useState<boolean>(true);
  const position = useWatch({
    control,
    name: `experience.${index}.position` as Path<IBuildResume>,
  });

  /* ---------------------------------- Utils --------------------------------- */
  // Achievements nested field array
  const achPath = `experience.${index}.achievements` as Path<IBuildResume>;

  /* ----------------------------------- Form ---------------------------------- */
  const {
    fields: achFields,
    append: achAppend,
    remove: achRemove,
  } = useFieldArray({ control, name: achPath as "experience" });

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Card Header Section */}
      <div
        className="flex items-center justify-between px-3 py-2.5 bg-muted/40 cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Card Header Title Section */}
        <span className="text-sm font-medium truncate">
          {(position as string) || `Experience ${index + 1}`}
        </span>

        {/* Card Header Actions Section */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {showRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
          {open ? (
            <ChevronUp size={14} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={14} className="text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Card Body Section */}
      {open && (
        <div className="p-3 flex flex-col gap-3">
          {/* Position and Company Section */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>Position / Role</FieldLabel>
              <Input
                placeholder="Software Engineer"
                {...register(`experience.${index}.position`)}
              />
            </div>
            <div>
              <FieldLabel>Company</FieldLabel>
              <Input
                placeholder="Company Name"
                {...register(`experience.${index}.company`)}
              />
            </div>
          </div>

          {/* Start and End Date Section */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>Start Date</FieldLabel>
              <Input
                placeholder="January 2022"
                {...register(`experience.${index}.startDate`)}
              />
            </div>
            <div>
              <FieldLabel>End Date</FieldLabel>
              <Input
                placeholder="Present"
                {...register(`experience.${index}.endDate`)}
              />
            </div>
          </div>

          {/* Description Section */}
          <div>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              autoResize
              placeholder="Brief description of your role..."
              className="min-h-[64px]"
              {...register(`experience.${index}.description`)}
            />
          </div>

          {/* Achievements Section */}
          <div>
            {/* Achievements Header Section */}
            <div className="flex items-center justify-between mb-1.5">
              <FieldLabel>Key Achievements</FieldLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => achAppend("" as unknown as Experience)}
              >
                <PlusCircle size={11} className="mr-1" /> Add
              </Button>
            </div>

            {/* Achievements List Section */}
            <div className="flex flex-col gap-1.5">
              {achFields.map((f, ai) => (
                <div key={f.id} className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-xs shrink-0">
                    •
                  </span>
                  <Input
                    placeholder="e.g. Increased revenue by 30%"
                    {...register(
                      `experience.${index}.achievements.${ai}` as Path<IBuildResume>,
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => achRemove(ai)}
                    className="p-1 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              {achFields.length === 0 && (
                <TypographyMuted className="text-xs italic">
                  No achievements added.
                </TypographyMuted>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
