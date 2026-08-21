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
        "group w-full overflow-hidden rounded-none border border-l-[5px] border-border border-l-foreground bg-card shadow-hard transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/35 hover:border-l-foreground hover:shadow-hard-lg",
        props.isRemoving && "animate-card-pop-shrink",
      )}
    >
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
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
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-black leading-tight tracking-[-0.02em] sm:text-lg">
                {props.name}
              </h3>
              <TypographyMuted className="mt-0.5 text-sm text-muted-foreground">
                @{props.username}
              </TypographyMuted>
            </div>
            <span
              className={`border-current/15 flex-shrink-0 whitespace-nowrap rounded-none border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${getAvailabilityStyleClass(props.availability)}`}
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
                  className="!rounded-none border border-border hover:shadow-none"
                />
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
