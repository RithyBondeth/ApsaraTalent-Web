import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ErrorMessage from "@/components/utils/feedback/error-message";
import LabelInput from "@/components/utils/forms/label-input";
import Tag from "@/components/utils/data-display/tag";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/functions/error/get-error-message";
import { getRandomBadgeColor } from "@/utils/functions/ui";
import { LucidePlus, LucideXCircle, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useWatch } from "react-hook-form";
import { IStepFormProps } from "../props";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";

export default function SkillReferenceStepForm({
  control,
  errors,
  setValue,
  getValues,
  trigger,
}: IStepFormProps<TEmployeeSignUp>) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("auth");
  const tToast = useTranslations("toast");

  /* ----------------------------- React Hook Form ----------------------------- */
  const initialSkills = getValues?.("skillAndReference.skills") || [];
  const jobTitle = getValues?.("profession.job") || "";

  const resumeFile = useWatch({ control, name: "skillAndReference.resume" });
  const coverLetterFile = useWatch({
    control,
    name: "skillAndReference.coverLetter",
  });

  /* -------------------------------- All States ------------------------------ */
  const [openPopOver, setOpenPopOver] = useState<boolean>(false);
  const [skillInput, setSkillInput] = useState<string>("");
  const [skills, setSkills] = useState<string[]>(initialSkills);

  /* ------------------------------ API Integration --------------------------- */
  const { isRefining, refineContent } = useAIRefine();

  /* --------------------------------- Methods -------------------------------- */
  // ── Suggest Skills ──────────────────────────────────────
  const handleSuggest = async () => {
    const results = await refineContent(jobTitle, "skills", { jobTitle });
    if (results && typeof results === "string") {
      const suggested = results
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const nextSkills = [...new Set([...skills, ...suggested])];
      setSkills(nextSkills);
      setValue?.("skillAndReference.skills", nextSkills);
      toast.success("Skills suggested based on your job title!");
    }
  };

  // ── Add Skill ─────────────────────────────────────────
  const addSkill = async () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === trimmed.toLowerCase(),
    );
    if (alreadyExists) {
      toast.error(tToast("duplicatedSkill"), {
        description: tToast("pleaseInputAnotherSkill"),
        action: { label: tToast("tryAgain"), onClick: () => {} },
      });
      return;
    }

    const updated = [...skills, trimmed];
    setSkills(updated);
    setValue?.("skillAndReference.skills", updated);

    await trigger?.("skillAndReference.skills");

    setSkillInput("");
    setOpenPopOver(false);
  };

  // ── Remove Skill ─────────────────────────────────────────
  const removeSkill = async (skillToRemove: string) => {
    const updated = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updated);
    setValue?.("skillAndReference.skills", updated);
    await trigger?.("skillAndReference.skills");
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col items-start gap-8">
      {/* Skills Section */}
      <div className="w-full flex flex-col items-start gap-3">
        <div className="w-full flex items-center justify-between">
          <TypographyH4>{t("empSkillTitle")}</TypographyH4>
          {jobTitle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSuggest}
              disabled={isRefining}
              className="h-7 px-2 text-[10px] gap-1 text-primary hover:text-primary hover:bg-primary/5 border border-primary/20"
            >
              {isRefining ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Sparkles size={12} />
              )}
              Suggest
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => {
            const { bg } = getRandomBadgeColor(skill);
            return (
              <div
                key={index}
                className={`flex items-center ${bg} pr-2 rounded-none border border-border`}
              >
                <Tag label={skill} />
                <LucideXCircle
                  className="text-muted-foreground cursor-pointer text-red-500"
                  width={"18px"}
                  onClick={() => removeSkill(skill)}
                />
              </div>
            );
          })}
        </div>

        {/* Add New Skill PopOver Section */}
        <Popover open={openPopOver} onOpenChange={setOpenPopOver}>
          <PopoverTrigger asChild>
            <Button className="w-full text-xs" variant="secondary">
              {t("empSkillAddBtn")}
              <LucidePlus />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
            <Input
              placeholder={t("empSkillPlaceholder")}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
            />
            <div className="flex items-center gap-1 [&>button]:text-xs">
              <Button variant="outline" onClick={() => setOpenPopOver(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={addSkill}>{t("save")}</Button>
            </div>
          </PopoverContent>
        </Popover>
        {errors?.skillAndReference?.skills && (
          <ErrorMessage>
            {getErrorMessage(errors.skillAndReference.skills)}
          </ErrorMessage>
        )}
      </div>

      {/* References Section */}
      <div className="w-full flex flex-col items-start gap-3">
        <TypographyH4>{t("empReferenceTitle")}</TypographyH4>
        <div className="field-row w-full">
          {/* Resume Section */}
          {resumeFile ? (
            <div className="flex flex-col items-start gap-2">
              <TypographyMuted className="text-xs">
                {t("empReferenceResume")}
              </TypographyMuted>
              <div className="w-full flex justify-between items-center p-3 rounded-none border border-border border-l-[4px] border-l-foreground bg-muted">
                <TypographyMuted className="truncate pr-2">
                  {resumeFile.name.trim()}
                </TypographyMuted>
                <LucideXCircle
                  strokeWidth="1.3px"
                  className="text-muted-foreground cursor-pointer shrink-0"
                  onClick={() =>
                    setValue?.("skillAndReference.resume", undefined, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <LabelInput
              label={t("empReferenceUploadResume")}
              input={
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && setValue) {
                      setValue("skillAndReference.resume", file, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  validationMessage={getErrorMessage(
                    errors?.skillAndReference?.resume,
                  )}
                />
              }
            />
          )}

          {/* CoverLetter Section */}
          {coverLetterFile ? (
            <div className="flex flex-col items-start gap-2">
              <TypographyMuted className="text-xs">
                {t("empReferenceCoverLetter")}
              </TypographyMuted>
              <div className="w-full flex justify-between items-center p-3 rounded-none border border-border border-l-[4px] border-l-foreground bg-muted">
                <TypographyMuted className="truncate pr-2">
                  {coverLetterFile.name.trim()}
                </TypographyMuted>
                <LucideXCircle
                  strokeWidth="1.3px"
                  className="text-muted-foreground cursor-pointer shrink-0"
                  onClick={() =>
                    setValue?.("skillAndReference.coverLetter", undefined, {
                      shouldValidate: true,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <LabelInput
              label={t("empReferenceUploadCoverLetter")}
              input={
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && setValue) {
                      setValue("skillAndReference.coverLetter", file, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  validationMessage={getErrorMessage(
                    errors?.skillAndReference?.coverLetter,
                  )}
                />
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
