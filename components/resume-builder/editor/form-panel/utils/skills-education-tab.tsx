import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWatch } from "react-hook-form";
import { useState } from "react";
import { IFormPanelProps } from "../props";
import { FieldLabel } from "./field-label";

export function SkillsEducationTab({
  register,
  control,
  setValue,
}: IFormPanelProps) {
  /* -------------------------------- All States ------------------------------ */
  const skills = (useWatch({ control, name: "skills" }) ?? []) as string[];
  const careerScopes = (useWatch({ control, name: "careerScopes" }) ??
    []) as string[];
  const [newSkill, setNewSkill] = useState("");
  const [newScope, setNewScope] = useState("");

  /* --------------------------------- Methods --------------------------------- */
  // ── Add Skill ───────────────────────────────────────────
  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    setValue("skills", [...skills, trimmed], { shouldDirty: true });
    setNewSkill("");
  };

  // ── Remove Skill ─────────────────────────────────────────
  const removeSkill = (i: number) => {
    setValue(
      "skills",
      skills.filter((_, idx) => idx !== i),
      { shouldDirty: true },
    );
  };

  // ── Add Career Scope ───────────────────────────────────────
  const addScope = () => {
    const trimmed = newScope.trim();
    if (!trimmed) return;
    setValue("careerScopes", [...careerScopes, trimmed], {
      shouldDirty: true,
    });
    setNewScope("");
  };

  // ── Remove Career Scope ─────────────────────────────────────
  const removeScope = (i: number) => {
    setValue(
      "careerScopes",
      careerScopes.filter((_, idx) => idx !== i),
      { shouldDirty: true },
    );
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-5">
      {/* Skills Section */}
      <div>
        <FieldLabel>Skills</FieldLabel>
        {/* Skills List Section */}
        <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(i)}
                className="text-primary/60 hover:text-destructive transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {/* Skills Input Section */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addSkill}
            className="sm:min-w-20"
          >
            Add
          </Button>
        </div>
      </div>

      <Separator />

      {/* Education Section */}
      <div>
        <FieldLabel>Education</FieldLabel>
        <Textarea
          autoResize
          placeholder="e.g. Bachelor of Science, Computer Science, MIT, 2020"
          className="min-h-[72px]"
          {...register("education")}
        />
        <TypographyMuted className="text-xs mt-1">
          Separate multiple degrees with{" "}
          <code className="text-xs bg-muted px-1 rounded">|</code>
        </TypographyMuted>
      </div>

      <Separator />

      {/* Career Scopes Section */}
      <div>
        <FieldLabel>Career Interests</FieldLabel>
        {/* Career Scopes List Section */}
        <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
          {careerScopes.map((scope, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs px-2.5 py-0.5 rounded-full"
            >
              {scope}
              <button
                type="button"
                onClick={() => removeScope(i)}
                className="text-emerald-500 hover:text-destructive transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {/* Career Scopes Input Section */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Add a career interest..."
            value={newScope}
            onChange={(e) => setNewScope(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addScope();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addScope}
            className="sm:min-w-20"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
