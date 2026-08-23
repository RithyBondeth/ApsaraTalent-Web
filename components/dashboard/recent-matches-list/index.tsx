"use client";

import CachedAvatar from "@/components/ui/cached-avatar";
import { LucideHandshake } from "lucide-react";
import { IRecentMatchesListProps } from "./props";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { timeAgo } from "@/utils/functions/date";
import { getNameInitials } from "@/utils/functions/text";
import { useTranslations } from "next-intl";

export function RecentMatchesList({
  matches,
  isEmployee,
}: IRecentMatchesListProps) {
  /* --------------------------------- Utils -------------------------------- */
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");

  /* --------------------------- Empty List State --------------------------- */
  if (!matches || matches.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center border border-dashed border-border bg-muted/20 px-5 py-8 text-center"
      >
        <span className="mb-3 grid size-11 place-items-center bg-primary/10 text-primary">
          <LucideHandshake className="size-5" aria-hidden />
        </span>
        <TypographyMuted className="text-sm text-muted-foreground">
          {t("noMatchesYet", {
            role: isEmployee ? t("company") : t("candidate"),
          })}
        </TypographyMuted>
      </div>
    );
  }

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {matches.map((match) => (
        <div
          key={match.id}
          className="flex items-center gap-3 border border-border bg-muted/25 p-3 transition-all hover:-translate-y-0.5 hover:bg-muted/45"
        >
          {/* Avatar Section */}
          <CachedAvatar
            src={match.avatar}
            alt={match.name}
            className="size-10 shrink-0 !rounded-none border border-border"
            rounded="md"
            preload={true}
            showLoadingState={true}
          >
            {getNameInitials(match.name)}
          </CachedAvatar>

          {/* Info Section */}
          <div className="min-w-0 flex-1">
            <TypographyP className="truncate text-sm font-medium [&:not(:first-child)]:mt-0">
              {match.name}
            </TypographyP>
            <TypographyMuted className="text-[11px] text-muted-foreground">
              {timeAgo(match.matchDate, tc)}
            </TypographyMuted>
          </div>
        </div>
      ))}
    </div>
  );
}
