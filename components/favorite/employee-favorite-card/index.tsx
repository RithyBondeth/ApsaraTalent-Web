import MetaChip from "@/components/utils/data-display/meta-chip";
import { cn } from "@/lib/utils";
import {
  formatAvailabilityWords,
  getNameInitials,
  translateLocation,
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
import { getAvailabilityStyleClass } from "@/utils/functions/ui";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useTranslations } from "next-intl";

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
      className={cn(
        "pixel-wash group w-full overflow-hidden border border-border bg-card hover:border-foreground/35",
        props.isRemoving && "animate-card-pop-shrink",
      )}
    >
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        {/* Avatar Section */}
        <Avatar
          rounded="md"
          className="size-14 flex-shrink-0 border border-border sm:size-16"
        >
          <AvatarFallback className="text-sm font-medium">
            {getNameInitials(props.name)}
          </AvatarFallback>
          <AvatarImage src={props.avatar} />
        </Avatar>

        {/* Content Section */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="pixel-display truncate text-base sm:text-lg">
                {props.name}
              </h3>
              <TypographyMuted className="mt-0.5 text-sm text-muted-foreground">
                @{props.username}
              </TypographyMuted>
            </div>
            <span
              className={`border-current/15 flex-shrink-0 whitespace-nowrap border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] ${getAvailabilityStyleClass(props.availability)}`}
            >
              {availLabel}
            </span>
          </div>

          {/* Description Section */}
          {props.description && (
            <TypographyMuted className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {props.description}
            </TypographyMuted>
          )}

          {/* Skills Tags Section */}
          {props.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {props.skills.slice(0, 6).map((skill, index) => (
                <Tag
                  label={skill}
                  key={index}
                  neutral
                  className="border border-border hover:shadow-none"
                />
              ))}
            </div>
          )}

          {/* Meta Chips Section */}
          <div className="flex flex-wrap gap-2">
            <MetaChip
              icon={<LucideBriefcaseBusiness />}
              text={props.position}
              className="border border-border bg-muted/45"
            />
            <MetaChip
              icon={<LucideClock />}
              text={t("yrsExp", { years: props.experience })}
              className="border border-border bg-muted/45"
            />
            <MetaChip
              icon={<LucideMapPin />}
              text={translateLocation(props.location, tl)}
              className="border border-border bg-muted/45"
            />
          </div>
        </div>
      </div>

      {/* Action Bar Section: View and Remove Buttons */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
        <Button
          variant="outline"
          size="sm"
          className="border-destructive/30 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={props.onRemoveFromFavorite}
        >
          <LucideBookmarkX className="size-3.5" />
          {t("remove")}
        </Button>
        <Button
          size="sm"
          className="text-xs"
          onClick={() => router.replace(`/feed/employee/${props.id}`)}
        >
          {t("viewDetail")}
          <MoveUpRight className="size-3.5" />
        </Button>
      </div>
    </article>
  );
}
