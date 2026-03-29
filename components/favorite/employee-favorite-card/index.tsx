import MetaChip from "@/components/utils/data-display/meta-chip";
import { formatAvailabilityWords } from "@/utils/functions/text";
import {
  LucideArrowRight,
  LucideBookmarkX,
  LucideBriefcaseBusiness,
  LucideClock,
  LucideMapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import Tag from "@/components/utils/data-display/tag";
import { IFavoriteEmployeeCardProps } from "./props";
import { getAvailabilityStyleClass } from "@/utils/extensions/get-availability-class";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

export default function FavoriteEmployeeCard(
  props: IFavoriteEmployeeCardProps,
) {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const availLabel = formatAvailabilityWords(props.availability);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={`bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-primary/20${props.isRemoving ? " animate-card-pop-shrink" : ""}`}
    >
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
          {/* Header Section */}
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

          {/* Description Section */}
          {props.description && (
            <TypographyMuted className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {props.description}
            </TypographyMuted>
          )}

          {/* Skills Tags Section */}
          {props.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {props.skills.map((skill, index) => (
                <Tag label={skill} key={index} />
              ))}
            </div>
          )}

          {/* Meta Chips Section */}
          <div className="flex flex-wrap gap-2">
            <MetaChip
              icon={<LucideBriefcaseBusiness />}
              text={props.position}
            />
            <MetaChip
              icon={<LucideClock />}
              text={`${props.experience} yrs exp`}
            />
            <MetaChip icon={<LucideMapPin />} text={props.location} />
          </div>
        </div>
      </div>

      {/* Action Bar Section: View and Remove Buttons */}
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          onClick={props.onRemoveFromFavorite}
        >
          <LucideBookmarkX className="size-3.5" />
          Remove
        </Button>
        <Button
          size="sm"
          className="text-xs"
          onClick={() => router.replace(`/feed/employee/${props.id}`)}
        >
          View Detail
          <LucideArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
