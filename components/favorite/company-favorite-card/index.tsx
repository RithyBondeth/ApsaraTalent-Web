import MetaChip from "@/components/utils/data-display/meta-chip";
import { cn } from "@/lib/utils";
import {
  LucideBookmarkX,
  LucideBriefcaseBusiness,
  LucideBuilding,
  LucideClock,
  LucideMapPin,
  LucideUsers,
  MoveUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import Tag from "@/components/utils/data-display/tag";
import { IFavoriteCompanyCardProps } from "./props";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useTranslations } from "next-intl";
import { translateLocation, getNameInitials } from "@/utils/functions/text";

export default function FavoriteCompanyCard(props: IFavoriteCompanyCardProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const t = useTranslations("favorite");
  const tl = useTranslations("locations");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <article
      className={cn(
        "pixel-wash group w-full overflow-hidden border border-border bg-card hover:border-foreground/35",
        props.isRemoving && "animate-card-pop-shrink",
      )}
    >
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        {/* Avatar Section: Company Avatar */}
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
          {/* Header Section: Company Name, Industry, Founded Year */}
          <div>
            <h3 className="pixel-display truncate text-base sm:text-lg">
              {props.name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <LucideBuilding className="size-3.5" />
                {props.industry}
              </span>
              <span className="inline-flex items-center gap-1">
                <LucideClock className="size-3.5" />
                {t("founded", { year: props.foundedYear })}
              </span>
            </div>
          </div>

          {/* Description Section */}
          {props.description && (
            <TypographyMuted className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {props.description}
            </TypographyMuted>
          )}

          {/* OpenPositions Tags Section: OpenPosition Title Tags */}
          {props.openPosition.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {props.openPosition.slice(0, 6).map((op) => (
                <Tag
                  label={op.title}
                  key={op.id}
                  neutral
                  className="border border-border hover:shadow-none"
                />
              ))}
            </div>
          )}

          {/* Meta Chips Section: Company Size, Open Positions, Location */}
          <div className="flex flex-wrap gap-2">
            <MetaChip
              icon={<LucideUsers />}
              text={t("memberCount", { count: props.companySize })}
              className="border border-border bg-muted/45"
            />
            <MetaChip
              icon={<LucideBriefcaseBusiness />}
              text={t("positionCount", { count: props.openPosition.length })}
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

      {/* Action Bar Section: Remove and View Detail */}
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
          onClick={() => router.replace(`/feed/company/${props.id}`)}
        >
          {t("viewDetail")}
          <MoveUpRight className="size-3.5" />
        </Button>
      </div>
    </article>
  );
}
