"use client";

import CachedAvatar from "@/components/ui/cached-avatar";
import { Handshake } from "lucide-react";
import { IRecentMatchesListProps } from "./props";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { timeAgo } from "@/utils/functions/date";
import { useTranslations } from "next-intl";

export function RecentMatchesList({
  matches,
  isEmployee,
}: IRecentMatchesListProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("dashboard");

  /* --------------------------- Empty List State --------------------------- */
  if (!matches || matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Handshake className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <TypographyMuted className="text-sm text-muted-foreground">
          {t("noMatchesYet", { role: isEmployee ? t("company") : t("candidate") })}
        </TypographyMuted>
      </div>
    );
  }

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {matches.map((match) => (
        <div
          key={match.id}
          className="flex items-center gap-3 rounded-xl border border-border/50 bg-accent/30 p-3 transition-colors hover:bg-accent/60"
        >
          <CachedAvatar
            src={match.avatar}
            alt={match.name}
            className="size-10 shrink-0 ring-1 ring-border"
            rounded="md"
            preload={true}
            showLoadingState={true}
          >
            {match.name.slice(0, 2)}
          </CachedAvatar>
          <div className="flex-1 min-w-0">
            <TypographyP className="[&:not(:first-child)]:mt-0 text-sm font-medium truncate">
              {match.name}
            </TypographyP>
            <TypographyMuted className="text-[11px] text-muted-foreground">
              {timeAgo(match.matchDate)}
            </TypographyMuted>
          </div>
        </div>
      ))}
    </div>
  );
}
