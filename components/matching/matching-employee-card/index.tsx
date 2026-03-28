import MetaChip from "@/components/utils/data-display/meta-chip";
import { availabilityWordsFormat } from "@/utils/functions/availability-word-format";
import {
  LucideBriefcaseBusiness,
  LucideCalendarCheck,
  LucideClock,
  LucideMapPin,
  LucideMessageCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import Tag from "@/components/utils/data-display/tag";
import { IMatchingEmployeeCardProps } from "./props";
import { getAvailabilityStyleClass } from "@/utils/extensions/get-availability-class";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

export default function MatchingEmployeeCard(
  props: IMatchingEmployeeCardProps,
) {
  /* ---------------------------------- Utils --------------------------------- */
  const availLabel = availabilityWordsFormat(props.availability);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-primary/20">
      <div className="p-4 sm:p-5 flex gap-4 sm:gap-5">
        {/* Avatar */}
        <Avatar
          rounded="md"
          className="size-16 sm:size-20 flex-shrink-0 ring-[2px] ring-border/40"
        >
          <AvatarFallback className="text-sm font-semibold">
            {props.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
          <AvatarImage src={props.avatar} />
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-bold leading-tight truncate">
                {props.name}
              </h3>
              <TypographyMuted className="text-sm text-muted-foreground mt-0.5">
                @{props.username}
              </TypographyMuted>
            </div>
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${getAvailabilityStyleClass(props.availability)}`}
            >
              {availLabel}
            </span>
          </div>

          {/* Description */}
          {props.description && (
            <TypographyMuted className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {props.description}
            </TypographyMuted>
          )}

          {/* Skills Tags */}
          {props.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {props.skills.map((skill, index) => (
                <Tag label={skill} key={index} />
              ))}
            </div>
          )}

          {/* Meta Chips */}
          <div className="flex flex-wrap gap-2">
            <MetaChip
              icon={<LucideBriefcaseBusiness />}
              text={props.position}
            />
            <MetaChip icon={<LucideClock />} text={props.experience} />
            <MetaChip icon={<LucideMapPin />} text={props.location} />
          </div>
        </div>
      </div>

      {/* Action Bar */}
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
