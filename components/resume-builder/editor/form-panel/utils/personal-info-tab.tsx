import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { useWatch, Path } from "react-hook-form";
import { IFormPanelProps } from "../props";
import { FieldLabel } from "./field-label";
import { capitalizeWords } from "@/utils/functions/text";
import { useTranslations } from "next-intl";

export function PersonalInfoTab({
  register,
  control,
}: Pick<IFormPanelProps, "register" | "control">) {
  /* -------------------------------- All States ------------------------------ */
  const socials = useWatch({ control, name: "personalInfo.socials" }) ?? {};

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");
  const socialKeys = Object.keys(socials);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-4">
      {/* Full Name and Job Title Section */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>{t("fullName")}</FieldLabel>
          <Input
            placeholder={t("fullName")}
            {...register("personalInfo.fullName")}
          />
        </div>
        <div>
          <FieldLabel>{t("jobTitle")}</FieldLabel>
          <Input
            placeholder="e.g. Software Engineer"
            {...register("personalInfo.job")}
          />
        </div>
      </div>

      {/* Email and Phone Section */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>{t("email")}</FieldLabel>
          <Input
            placeholder="email@example.com"
            {...register("personalInfo.email")}
          />
        </div>
        <div>
          <FieldLabel>{t("phone")}</FieldLabel>
          <Input
            placeholder="+1 234 567 890"
            {...register("personalInfo.phone")}
          />
        </div>
      </div>

      {/* Location and Age Section */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>{t("location")}</FieldLabel>
          <Input
            placeholder="City, Country"
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel>{t("yearsOfExperience")}</FieldLabel>
          <Input
            placeholder="e.g. 5 years"
            {...register("yearsOfExperience")}
          />
        </div>
        <div>
          <FieldLabel>{t("availability")}</FieldLabel>
          <Input placeholder="e.g. Immediately" {...register("availability")} />
        </div>
      </div>

      {/* Professional Summary Section */}
      <div>
        <FieldLabel>{t("professionalSummary")}</FieldLabel>
        <Textarea
          autoResize
          placeholder="A brief professional summary about yourself..."
          className="min-h-[80px]"
          {...register("summary")}
        />
      </div>

      {/* Social Links Section */}
      {socialKeys.length > 0 && (
        <div>
          <Separator className="mb-3" />
          <FieldLabel>{t("socialLinks")}</FieldLabel>
          <div className="flex flex-col gap-2">
            {socialKeys.map((key) => {
              const path = `personalInfo.socials.${key}` as Path<IBuildResume>;
              return (
                <div key={key}>
                  <FieldLabel>{capitalizeWords(key)}</FieldLabel>
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
