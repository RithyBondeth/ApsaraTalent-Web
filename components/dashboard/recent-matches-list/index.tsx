"use client";

import CachedAvatar from "@/components/ui/cached-avatar";
import { Handshake } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Handshake className="h-10 w-10 text-muted-foreground/30 mb-3" />
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
          className="flex items-center gap-3 border border-border border-l-[3px] border-l-foreground bg-muted/25 p-3 transition-all hover:-translate-y-0.5 hover:bg-muted/45"
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
          <div className="flex-1 min-w-0">
            <TypographyP className="[&:not(:first-child)]:mt-0 text-sm font-medium truncate">
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
