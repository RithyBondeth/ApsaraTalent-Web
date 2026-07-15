import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { useWatch, Path } from "react-hook-form";
import { IFormPanelProps } from "../props";
import { FieldLabel } from "./field-label";
import { capitalizeWords } from "@/utils/functions/text";
import { useTranslations } from "next-intl";
import { Sparkles, Loader2 } from "lucide-react";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";
import { toast } from "sonner";

export function PersonalInfoTab({
  register,
  control,
  setValue,
}: Pick<IFormPanelProps, "register" | "control" | "setValue">) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* ----------------------------- React Hook Form ---------------------------- */
  const socials = useWatch({ control, name: "personalInfo.socials" }) ?? {};
  const summary = useWatch({ control, name: "summary" }) ?? "";
  const jobTitle = useWatch({ control, name: "personalInfo.job" }) ?? "";

  /* -------------------------------- All States ------------------------------- */
  const socialKeys = Object.keys(socials);

  /* ------------------------------ API Integration ---------------------------- */
  const { isRefining: summaryLoading, refineContent: refineSummary } =
    useAIRefine();
  const { isRefining: jobLoading, refineContent: refineJob } = useAIRefine();

  /* --------------------------------- Methods --------------------------------- */
  // ── Refine Summary ────────────────────────────────────
  const handleSummaryRefine = async () => {
    const result = await refineSummary(summary, "summary");
    if (result && typeof result === "string") {
      setValue("summary", result, { shouldDirty: true });
      toast.success(t("refinedSuccess"));
    }
  };

  // ── Refine Job Title ────────────────────────────────────
  const handleJobRefine = async () => {
    const result = await refineJob(jobTitle, "jobTitle");
    if (result && typeof result === "string") {
      setValue("personalInfo.job", result, { shouldDirty: true });
      toast.success(t("refinedSuccess"));
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-4">
      {/* Full Name and Job Title Section */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {/* Full Name Section */}
        <div>
          <FieldLabel>{t("fullName")}</FieldLabel>
          <Input
            placeholder={t("fullName")}
            {...register("personalInfo.fullName")}
          />
        </div>

        {/* Job Title Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <FieldLabel>{t("jobTitle")}</FieldLabel>
            {jobTitle && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleJobRefine}
                disabled={jobLoading}
                className="h-6 px-1.5 text-[9px] gap-1 text-primary hover:text-primary hover:bg-primary/5"
              >
                {jobLoading ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : (
                  <Sparkles size={10} />
                )}
                {t("aiRefine")}
              </Button>
            )}
          </div>
          <Input
            placeholder={t("softwareEngineerPlaceholder")}
            {...register("personalInfo.job")}
          />
        </div>
      </div>

      {/* Email and Phone Section */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <FieldLabel>{t("email")}</FieldLabel>
          <Input
            type="email"
            placeholder="email@example.com"
            {...register("personalInfo.email")}
          />
        </div>
        <div>
          <FieldLabel>{t("phone")}</FieldLabel>
          <Input
            placeholder={t("phoneExample")}
            {...register("personalInfo.phone")}
          />
        </div>
      </div>

      {/* Location and Age Section */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <FieldLabel>{t("location")}</FieldLabel>
          <Input
            placeholder={t("locationExample")}
            {...register("personalInfo.location")}
          />
        </div>
        <div>
          <FieldLabel>{t("age")}</FieldLabel>
          <Input
            type="number"
            placeholder={t("age")}
            {...register("personalInfo.age", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Years of Experience and Availability Section */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <FieldLabel>{t("yearsOfExperience")}</FieldLabel>
          <Input
            placeholder={t("yearsExperienceExample")}
            {...register("yearsOfExperience")}
          />
        </div>
        <div>
          <FieldLabel>{t("availability")}</FieldLabel>
          <Input
            placeholder={t("immediatelyPlaceholder")}
            {...register("availability")}
          />
        </div>
      </div>

      {/* Professional Summary Section */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <FieldLabel>{t("professionalSummary")}</FieldLabel>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSummaryRefine}
            disabled={summaryLoading}
            className="h-7 px-2 text-[10px] gap-1 text-primary hover:text-primary hover:bg-primary/5 border border-primary/20"
          >
            {summaryLoading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Sparkles size={12} />
            )}
            {t("aiRefine")}
          </Button>
        </div>
        <Textarea
          autoResize
          placeholder={t("summaryFormPlaceholder")}
          className="min-h-[100px] text-xs leading-relaxed"
          {...register("summary")}
        />
      </div>

      {/* Social Links Section */}
      {socialKeys.length > 0 && (
        <div>
          <Separator className="my-4" />
          <FieldLabel className="mb-3 block">{t("socialLinks")}</FieldLabel>
          <div className="flex flex-col gap-3">
            {socialKeys.map((key) => {
              const path = `personalInfo.socials.${key}` as Path<IBuildResume>;
              return (
                <div key={key}>
                  <FieldLabel className="text-[10px] text-muted-foreground uppercase mb-1">
                    {capitalizeWords(key)}
                  </FieldLabel>
                  <Input
                    placeholder={`https://${key}.com/...`}
                    {...register(path)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
