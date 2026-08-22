import MetaChip from "@/components/utils/data-display/meta-chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Tag from "@/components/utils/data-display/tag";
import {
  LucideAlarmClock,
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideCircleDollarSign,
  LucideGraduationCap,
  LucideMapPin,
  LucideUsers,
  LucideMoveUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ISearchCompanyCardProps } from "./props";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { memo } from "react";
import { useTranslations } from "next-intl";
import {
  formatAvailabilityWords,
  translateLocation,
} from "@/utils/functions/text";
import { useSalaryText } from "@/hooks/utils/use-salary-text";

const SearchCompanyCard = memo(function SearchCompanyCard(
  props: ISearchCompanyCardProps,
) {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const t = useTranslations("searchEmployee");
  const tl = useTranslations("locations");
  const salaryText = useSalaryText();

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <article className="group w-full overflow-hidden rounded-none border border-l-[5px] border-border border-l-foreground bg-card shadow-hard transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/35 hover:border-l-foreground hover:shadow-hard-lg">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        {/* Header Section: Avatar, Title, Name and Industry */}
        <div className="flex gap-4">
          <Avatar
            rounded="md"
            className="size-14 flex-shrink-0 !rounded-none border border-border sm:size-16"
          >
            <AvatarFallback className="text-xs font-semibold">
              {props.company.name.slice(0, 3).toUpperCase()}
            </AvatarFallback>
            <AvatarImage src={props.company.avatar} alt={props.company.name} />
          </Avatar>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-black leading-tight tracking-[-0.02em] sm:text-lg">
              {props.title}
            </h3>
            <TypographyMuted className="mt-0.5 truncate text-sm text-muted-foreground">
              {props.company.name}
            </TypographyMuted>
            <TypographyP className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground [&:not(:first-child)]:mt-0">
              {props.company.industry}
            </TypographyP>
          </div>
        </div>

        {/* CompanySize Section */}
        <div className="flex flex-wrap gap-2">
          <MetaChip
            icon={<LucideUsers />}
            text={`${props.company.companySize} ${t("employees")}`}
            className="rounded-none border border-border bg-muted/45"
          />
          <MetaChip
            icon={<LucideMapPin />}
            text={translateLocation(props.company.location, tl)}
            className="rounded-none border border-border bg-muted/45"
          />
          <MetaChip
            icon={<LucideBriefcaseBusiness />}
            text={formatAvailabilityWords(props.type)}
            className="rounded-none border border-border bg-muted/45"
          />
        </div>

        {/* Education & Experience Requirements Section */}
        <div className="flex flex-wrap gap-2">
          <MetaChip
            icon={<LucideGraduationCap />}
            text={`${t("educationLabel")}: ${props.education}`}
            className="rounded-none border border-border bg-muted/45"
          />
          <MetaChip
            icon={<LucideBriefcaseBusiness />}
            text={`${t("experienceLabel")}: ${props.experience}`}
            className="rounded-none border border-border bg-muted/45"
          />
        </div>

        {/* Description Section */}
        {props.description && (
          <TypographyMuted className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {props.description}
          </TypographyMuted>
        )}

        {/* Skills Tags Section */}
        {props.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {props.skills.slice(0, 6).map((item, index) => (
              <Tag label={item} key={index} />
            ))}
            {props.skills.length > 6 && (
              <span className="self-center text-[11px] font-semibold text-muted-foreground">
                +{props.skills.length - 6}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Bar Section */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <MetaChip
            icon={<LucideCircleDollarSign />}
            text={salaryText(props)}
            className="rounded-none border border-border bg-card"
          />
          <MetaChip
            icon={<LucideAlarmClock />}
            text={props.postedDate}
            className="rounded-none border border-border bg-card"
          />
        </div>
        <Button
          size="sm"
          className="flex-shrink-0 rounded-none text-xs"
          onClick={() => router.push(`/feed/company/${props.id}`)}
        >
          <LucideBuilding className="size-3.5" />
          {t("viewCompany")}
          <LucideMoveUpRight className="size-3.5" />
        </Button>
      </div>
    </article>
  );
});

export default SearchCompanyCard;
