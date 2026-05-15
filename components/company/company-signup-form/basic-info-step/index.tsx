import { TCompanySignup } from "@/app/(auth)/signup/company/validation";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "@/components/utils/feedback/error-message";
import LabelInput from "@/components/utils/forms/label-input";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { locationConstant } from "@/utils/constants/ui.constant";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";

export default function BasicInfoStepForm({
  register,
  control,
  errors,
}: IStepFormProps<TCompanySignup>) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("auth");
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

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col items-start gap-5">
      {/* Title Section */}
      <TypographyH4>{t("cmpBasicInfoTitle")}</TypographyH4>
      {/* Form Section */}
      <LabelInput
        label={t("cmpBasicInfoCompanyName")}
        input={
          <Input
            placeholder={t("cmpBasicInfoCompanyNamePlaceholder")}
            id="company-name"
            {...register("basicInfo.name")}
            validationMessage={errors!.basicInfo?.name?.message}
          />
        }
      />
      <div className="w-full flex flex-col items-start gap-2">
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">
            {t("cmpBasicInfoDescription")}
          </TypographyMuted>
          <Textarea
            autoResize
            placeholder={t("cmpBasicInfoDescriptionPlaceholder")}
            className="placeholder:text-sm"
            {...register("basicInfo.description")}
            validationMessage={errors!.basicInfo?.description?.message}
          />
        </div>
      </div>
      <div className="w-full flex justify-between items-center gap-3 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
        <LabelInput
          label={t("cmpBasicInfoIndustry")}
          input={
            <Input
              placeholder={t("cmpBasicInfoIndustryPlaceholder")}
              id="industry"
              {...register("basicInfo.industry")}
              validationMessage={errors!.basicInfo?.industry?.message}
            />
          }
        />
        <LabelInput
          label={t("cmpBasicInfoCompanySize")}
          input={
            <Input
              type="number"
              placeholder={t("cmpBasicInfoCompanySizePlaceholder")}
              id="company-size"
              {...register("basicInfo.companySize")}
              validationMessage={errors!.basicInfo?.companySize?.message}
            />
          }
        />
      </div>
      <div className="w-full flex justify-between items-center gap-3 [&>div]:w-1/2 phone-xl:flex-col phone-xl:[&>div]:w-full">
        <LabelInput
          label={t("cmpBasicInfoFoundedYear")}
          input={
            <Input
              type="number"
              placeholder={t("cmpBasicInfoFoundedYearPlaceholder")}
              id="founded-year"
              {...register("basicInfo.foundedYear")}
              validationMessage={errors!.basicInfo?.foundedYear?.message}
            />
          }
        />
        <div className="w-full flex flex-col items-start gap-2">
          <div className="w-full flex flex-col items-start gap-3">
            <TypographyMuted className="text-xs">
              {t("cmpBasicInfoLocations")}
            </TypographyMuted>
            <Controller
              name="basicInfo.location"
              control={control!}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger className="h-12 text-muted-foreground">
                    <SelectValue
                      placeholder={t("cmpBasicInfoLocationPlaceholder")}
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
    </div>
  );
}
