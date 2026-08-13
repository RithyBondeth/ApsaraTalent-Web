import { TCompanySignup } from "@/app/(auth)/signup/company/validation";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "@/components/utils/feedback/error-message";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import {
  companyTypeConstant,
  locationConstant,
} from "@/utils/constants/ui.constant";
import { useTranslations } from "next-intl";
import { Controller, useWatch } from "react-hook-form";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";
import {
  Building2,
  CalendarDays,
  Factory,
  FileText,
  Globe2,
  Loader2,
  MapPin,
  Shapes,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export default function BasicInfoStepForm({
  register,
  control,
  errors,
  setValue,
}: IStepFormProps<TCompanySignup>) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("auth");
  const tr = useTranslations("resumeBuilder");
  const tLoc = useTranslations("locations");
  const locationLabels: Record<string, string> = {
    "Phnom Penh": tLoc("phnomPenh"),
    "Banteay Meanchey": tLoc("banteayMeanchey"),
    Battambang: tLoc("battambang"),
    "Kampong Cham": tLoc("kampongCham"),
    "Kampong Chhnang": tLoc("kampongChhnang"),
    "Kampong Speu": tLoc("kampongSpeu"),
    "Kampong Thom": tLoc("kampongThom"),
    Kampot: tLoc("kampot"),
    Kandal: tLoc("kandal"),
    Kep: tLoc("kep"),
    "Koh Kong": tLoc("kohKong"),
    Kratie: tLoc("kratie"),
    Mondulkiri: tLoc("mondulkiri"),
    "Oddar Meanchey": tLoc("oddarMeanchey"),
    Pailin: tLoc("pailin"),
    "Preah Sihanouk": tLoc("preahSihanouk"),
    "Preah Vihear": tLoc("preahVihear"),
    "Prey Veng": tLoc("preyVeng"),
    Pursat: tLoc("pursat"),
    Ratanakiri: tLoc("ratanakiri"),
    "Siem Reap": tLoc("siemReap"),
    "Stung Treng": tLoc("stungTreng"),
    "Svay Rieng": tLoc("svayRieng"),
    Takeo: tLoc("takeo"),
    "Tbong Khmum": tLoc("tbongKhmum"),
  };

  /* ----------------------------- API Integration ---------------------------- */
  const { isRefining, refineContent } = useAIRefine();

  /* ----------------------------- React Hook Form ---------------------------- */
  const descValue = useWatch({ control, name: "basicInfo.description" });

  /* --------------------------------- Methods -------------------------------- */
  // ── Refine Description ────────────────────────────────────────────
  const handleRefine = async () => {
    const result = await refineContent(descValue, "summary");
    if (result && typeof result === "string" && setValue) {
      setValue("basicInfo.description", result, { shouldDirty: true });
      toast.success(tr("refinedSuccess"));
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col items-start gap-5">
      {/* Title Section */}
      <div className="flex w-full items-center justify-between gap-3">
        <TypographyH4>{t("cmpBasicInfoTitle")}</TypographyH4>
        <span className="shrink-0 text-[11px] text-muted-foreground">
          <span className="text-destructive">*</span> {t("requiredFieldsHint")}
        </span>
      </div>
      {/* Form Section */}
      <Input
        placeholder={`${t("cmpBasicInfoCompanyNamePlaceholder")} *`}
        prefix={<Building2 />}
        aria-required="true"
        id="company-name"
        {...register("basicInfo.name")}
        validationMessage={errors!.basicInfo?.name?.message}
      />
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full flex-col items-start gap-2">
          <Textarea
            autoResize
            placeholder={`${t("cmpBasicInfoDescriptionPlaceholder")} *`}
            prefix={<FileText />}
            action={
              descValue ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRefine}
                  disabled={isRefining}
                  className="h-6 gap-1 px-1.5 text-[9px] text-primary hover:bg-primary/5 hover:text-primary"
                >
                  {isRefining ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : (
                    <Sparkles size={10} />
                  )}
                  {tr("aiRefine")}
                </Button>
              ) : undefined
            }
            aria-required="true"
            className="placeholder:text-sm"
            {...register("basicInfo.description")}
            validationMessage={errors!.basicInfo?.description?.message}
          />
        </div>
      </div>
      <div className="field-row w-full">
        <Input
          placeholder={`${t("cmpBasicInfoIndustryPlaceholder")} *`}
          prefix={<Factory />}
          aria-required="true"
          id="industry"
          {...register("basicInfo.industry")}
          validationMessage={errors!.basicInfo?.industry?.message}
        />
        <Input
          type="number"
          placeholder={`${t("cmpBasicInfoCompanySizePlaceholder")} *`}
          prefix={<Users />}
          aria-required="true"
          id="company-size"
          {...register("basicInfo.companySize")}
          validationMessage={errors!.basicInfo?.companySize?.message}
        />
      </div>
      <div className="field-row w-full">
        <Input
          type="number"
          placeholder={`${t("cmpBasicInfoFoundedYearPlaceholder")} *`}
          prefix={<CalendarDays />}
          aria-required="true"
          id="founded-year"
          {...register("basicInfo.foundedYear")}
          validationMessage={errors!.basicInfo?.foundedYear?.message}
        />
        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full flex-col items-start gap-2">
            <Controller
              name="basicInfo.location"
              control={control!}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger
                    className="h-12 text-muted-foreground"
                    aria-required="true"
                  >
                    <MapPin className="mr-2 size-[18px] shrink-0" />
                    <SelectValue
                      placeholder={`${t("cmpBasicInfoLocationPlaceholder")} *`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {locationConstant.map((location) => (
                      <SelectItem key={location} value={location}>
                        {locationLabels[location] ?? location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <ErrorMessage>{errors!.basicInfo?.location?.message}</ErrorMessage>
        </div>
      </div>

      {/* Website URL and Company Type Section */}
      <div className="field-row w-full">
        {/* Website URL Section */}
        <Input
          placeholder={t("cmpBasicInfoWebsiteUrlPlaceholder")}
          prefix={<Globe2 />}
          id="website-url"
          {...register("basicInfo.websiteUrl")}
          validationMessage={errors!.basicInfo?.websiteUrl?.message}
        />

        {/* Company Type Section */}
        <div className="flex w-full flex-col items-start gap-2">
          <Controller
            name="basicInfo.companyType"
            control={control!}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger className="h-12 text-muted-foreground">
                  <Shapes className="mr-2 size-[18px] shrink-0" />
                  <SelectValue
                    placeholder={t("cmpBasicInfoCompanyTypePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {companyTypeConstant.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <ErrorMessage>{errors!.basicInfo?.companyType?.message}</ErrorMessage>
        </div>
      </div>
    </div>
  );
}
