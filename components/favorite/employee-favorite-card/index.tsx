import MetaChip from "@/components/utils/data-display/meta-chip";
import {
  formatAvailabilityWords,
  getNameInitials,
} from "@/utils/functions/text";
import {
  LucideBookmarkX,
  LucideBriefcaseBusiness,
  LucideClock,
  LucideMapPin,
  MoveUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import Tag from "@/components/utils/data-display/tag";
import { IFavoriteEmployeeCardProps } from "./props";
import { getAvailabilityStyleClass } from "@/utils/functions/ui/get-availability-class";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useTranslations } from "next-intl";
import { translateLocation } from "@/utils/functions/text";

export default function FavoriteEmployeeCard(
  props: IFavoriteEmployeeCardProps,
) {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const t = useTranslations("favorite");
  const tl = useTranslations("locations");
  const availLabel = formatAvailabilityWords(props.availability);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <article
      className={`group w-full overflow-hidden rounded-none border border-border border-l-[5px] border-l-foreground bg-card shadow-[5px_5px_0_hsl(var(--foreground)/0.055)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/35 hover:border-l-foreground hover:shadow-[8px_8px_0_hsl(var(--foreground)/0.08)]${props.isRemoving ? " animate-card-pop-shrink" : ""}`}
    >
      <div className="p-4 sm:p-5 flex gap-4 sm:gap-5">
        {/* Avatar Section */}
        <Avatar
          rounded="md"
          className="size-14 flex-shrink-0 !rounded-none border border-border sm:size-16"
        >
          <AvatarFallback className="text-sm font-semibold">
            {getNameInitials(props.name)}
          </AvatarFallback>
          <AvatarImage src={props.avatar} />
        </Avatar>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-black leading-tight tracking-[-0.02em] sm:text-lg">
                {props.name}
              </h3>
              <TypographyMuted className="text-sm text-muted-foreground mt-0.5">
                @{props.username}
              </TypographyMuted>
            </div>
            <span
              className={`flex-shrink-0 whitespace-nowrap rounded-none border border-current/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${getAvailabilityStyleClass(props.availability)}`}
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
              {props.skills.slice(0, 6).map((skill, index) => (
                <Tag label={skill} key={index} neutral className="!rounded-none border border-border hover:shadow-none" />
              ))}
            </div>
          )}

          {/* Meta Chips Section */}
          <div className="flex flex-wrap gap-2">
            <MetaChip
              icon={<LucideBriefcaseBusiness />}
              text={props.position}
              className="rounded-none border border-border bg-muted/45"
            />
            <MetaChip
              icon={<LucideClock />}
              text={t("yrsExp", { years: props.experience })}
              className="rounded-none border border-border bg-muted/45"
            />
            <MetaChip
              icon={<LucideMapPin />}
              text={translateLocation(props.location, tl)}
              className="rounded-none border border-border bg-muted/45"
            />
          </div>
        </div>
      </div>

      {/* Action Bar Section: View and Remove Buttons */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
        <Button
          variant="outline"
          size="sm"
          className="rounded-none border-destructive/30 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={props.onRemoveFromFavorite}
        >
          <LucideBookmarkX className="size-3.5" />
          {t("remove")}
        </Button>
        <Button
          size="sm"
          className="rounded-none text-xs"
          onClick={() => router.replace(`/feed/employee/${props.id}`)}
        >
          {t("viewDetail")}
          <MoveUpRight className="size-3.5" />
        </Button>
      </div>
    </article>
  );
}
