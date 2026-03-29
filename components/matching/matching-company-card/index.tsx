import MetaChip from "@/components/utils/data-display/meta-chip";
import {
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideCalendarCheck,
  LucideClock,
  LucideMapPin,
  LucideMessageCircle,
  LucideUsers,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import Tag from "@/components/utils/data-display/tag";
import { IMatchingCompanyCardProps } from "./props";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

export default function MatchingCompanyCard(props: IMatchingCompanyCardProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-primary/20">
      <div className="p-4 sm:p-5 flex gap-4 sm:gap-5">
        {/* Avatar Section */}
        <Avatar
          rounded="md"
          className="size-16 sm:size-20 flex-shrink-0 ring-[2px] ring-border/40"
        >
          <AvatarFallback className="text-sm font-semibold">
            {props.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
          <AvatarImage src={props.avatar} />
        </Avatar>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Header Section: Name, Industry and Founded Year */}
          <div>
            <h3 className="text-base font-bold leading-tight truncate">
              {props.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <LucideBuilding className="size-3.5" />
                {props.industry}
              </span>
              <span className="inline-flex items-center gap-1">
                <LucideClock className="size-3.5" />
                Founded {props.foundedYear}
              </span>
            </div>
          </div>

          {/* Description Section */}
          {props.description && (
            <TypographyMuted className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {props.description}
            </TypographyMuted>
          )}

          {/* Open Positions Tags Section */}
          {props.openPosition.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {props.openPosition.map((op) => (
                <Tag label={op.title} key={op.id} />
              ))}
            </div>
          )}

          {/* Meta Chips Section */}
          <div className="flex flex-wrap gap-2">
            <MetaChip
              icon={<LucideUsers />}
              text={
                props.companySize <= 1
                  ? `${props.companySize} member`
                  : `${props.companySize} members`
              }
            />
            <MetaChip
              icon={<LucideBriefcaseBusiness />}
              text={
                props.openPosition.length <= 1
                  ? `${props.openPosition.length} position`
                  : `${props.openPosition.length} positions`
              }
            />
            <MetaChip icon={<LucideMapPin />} text={props.location} />
          </div>
        </div>
      </div>

      {/* Action Bar Section: Schedule and Chat Now Buttons */}
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end gap-2">
        {props.onScheduleClick && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={props.onScheduleClick}
          >
            <LucideCalendarCheck className="size-3.5" />
            Schedule
          </Button>
        )}
        <Button size="sm" className="text-xs" onClick={props.onChatNowClick}>
          <LucideMessageCircle className="size-3.5" />
          Chat Now
        </Button>
      </div>
    </div>
  );
}
