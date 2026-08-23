import MetaChip from "@/components/utils/data-display/meta-chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Tag from "@/components/utils/data-display/tag";
import {
  LucideGraduationCap,
  LucideMapPin,
  LucideUser,
  LucideMoveUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ISearchEmployeeCardProps } from "./props";
import { AvailabilityBadge } from "@/components/utils/data-display/availability-badge";
import { AVATAR_INITIALS_LENGTH } from "@/utils/constants/ui.constant";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useTranslations } from "next-intl";
import { translateLocation } from "@/utils/functions/text";

export default function SearchEmployeeCard(props: ISearchEmployeeCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const t = useTranslations("searchCompany");
  const tl = useTranslations("locations");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <article className="group w-full overflow-hidden rounded-none border border-border bg-card shadow-hard transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/35 hover:border-l-foreground hover:shadow-hard-lg">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        {/* Header Section: Avatar, Name, Job and Availability */}
        <div className="flex gap-4">
          <Avatar
            rounded="md"
            className="size-14 flex-shrink-0 !rounded-none border border-border sm:size-16"
          >
            <AvatarImage src={props.avatar} />
            <AvatarFallback className="text-xs font-semibold">
              {props.username?.slice(0, AVATAR_INITIALS_LENGTH)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-base font-black leading-tight tracking-[-0.02em] sm:text-lg">
                  {props.job}
                </h3>
                <TypographyP className="mt-0.5 text-sm font-medium text-muted-foreground [&:not(:first-child)]:mt-0">
                  {props.firstname} {props.lastname}
                </TypographyP>
              </div>
              <AvailabilityBadge
                availability={props.availability}
                className="flex-shrink-0 whitespace-nowrap"
              />
            </div>
          </div>
        </div>

        {/* YearOfExperience, Location, Availability and Education Section */}
        <div className="flex flex-wrap gap-2">
          <MetaChip
            icon={<LucideUser />}
            text={`${props.yearOfExperience} ${t("yrsExp")}`}
            className="rounded-none border border-border bg-muted/45"
          />
          <MetaChip
            icon={<LucideMapPin />}
            text={translateLocation(props.location, tl)}
            className="rounded-none border border-border bg-muted/45"
          />
          <MetaChip
            icon={<LucideGraduationCap />}
            text={props.education}
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
        <span className="min-w-0 truncate text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {props.username || `${props.firstname} ${props.lastname}`}
        </span>
        <Button
          size="sm"
          className="flex-shrink-0 rounded-none text-xs"
          onClick={() => router.push(`/feed/employee/${props.id}`)}
        >
          <LucideUser className="size-3.5" />
          {t("viewProfile")}
          <LucideMoveUpRight className="size-3.5" />
        </Button>
      </div>
    </article>
  );
}
