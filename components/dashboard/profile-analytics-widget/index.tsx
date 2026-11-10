"use client";

import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { cn } from "@/lib/utils";
import { useProfileAnalyticsStore } from "@/stores/apis/users/profile-analytics.store";
import { formatShortDate } from "@/utils/functions/date";
import {
  LucideBellRing,
  LucideEye,
  LucideEyeOff,
  LucideSearch,
  LucideUserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { IProfileAnalyticsWidgetProps } from "./props";

/*
  Three stat tiles + a most-recent-viewers list. Renders whether the reader
  is an employee or a company — companies see viewers too (recruiters
  comparing notes), and the empty state reads the same for both.

  Deliberately no dark: variants — every colour is a token so light and dark
  fall out of the theme swap.
*/
export function ProfileAnalyticsWidget({
  className,
}: IProfileAnalyticsWidgetProps) {
  const t = useTranslations("profileAnalytics");

  const data = useProfileAnalyticsStore((s) => s.data);
  const loading = useProfileAnalyticsStore((s) => s.loading);
  const loaded = useProfileAnalyticsStore((s) => s.loaded);
  const fetch = useProfileAnalyticsStore((s) => s.fetch);

  useEffect(() => {
    if (!loaded && !loading) fetch();
  }, [loaded, loading, fetch]);

  const tiles = [
    {
      icon: LucideEye,
      label: t("profileViews7d"),
      value: data?.profileViews7d,
    },
    {
      icon: LucideBellRing,
      label: t("profileViews30d"),
      value: data?.profileViews30d,
    },
    {
      icon: LucideSearch,
      label: t("searchAppearances30d"),
      value: data?.searchAppearances30d,
    },
  ] as const;

  return (
    <section
      className={cn(
        "flex w-full flex-col gap-4 border border-border bg-card p-4 shadow-hard sm:p-5",
        className,
      )}
      aria-labelledby="profile-analytics-heading"
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="profile-analytics-heading"
            className="text-base font-black tracking-[-0.02em] sm:text-lg"
          >
            {t("title")}
          </h2>
          <TypographyMuted className="mt-0.5 text-xs">
            {t("subtitle")}
          </TypographyMuted>
        </div>
        {data?.browsePrivately && (
          <span className="inline-flex items-center gap-1 border border-border bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            <LucideEyeOff className="size-3" />
            {t("privateChip")}
          </span>
        )}
      </header>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="flex items-center gap-3 border border-border bg-background p-3 shadow-hard-xs"
          >
            <div className="grid size-9 shrink-0 place-items-center bg-primary text-primary-foreground">
              <tile.icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-black tabular-nums leading-tight">
                {typeof tile.value === "number" ? tile.value : "—"}
              </p>
              <TypographyMuted className="text-[11px]">
                {tile.label}
              </TypographyMuted>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {t("recentViewers")}
        </h3>
        {!loaded && loading ? (
          <TypographyMuted className="text-sm">…</TypographyMuted>
        ) : !data || data.recentViewers.length === 0 ? (
          <TypographyMuted className="text-sm">
            {t("noRecentViewers")}
          </TypographyMuted>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {data.recentViewers.map((viewer, index) => {
              const anonymous = viewer.viewerId === null;
              return (
                <li
                  key={`${viewer.viewerId ?? "anon"}-${viewer.viewedAt}-${index}`}
                  className="flex items-center gap-3 border border-border bg-background p-2 shadow-hard-xs"
                >
                  {viewer.viewerAvatar ? (
                    // Kept as a plain img: the URL comes from a signed avatar
                    // path the profile pages already fetch elsewhere, and
                    // running the recent-viewers list through next/image would
                    // ask each viewer's host to whitelist every avatar CDN
                    // this platform stores.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={viewer.viewerAvatar}
                      alt=""
                      className="size-8 shrink-0 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-muted text-muted-foreground">
                      <LucideUserRound className="size-4" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {anonymous
                        ? t("anonymousViewer")
                        : (viewer.viewerName ?? t("anonymousViewer"))}
                    </p>
                    <TypographyMuted className="text-[11px]">
                      {formatShortDate(viewer.viewedAt)}
                    </TypographyMuted>
                  </div>
                  {!anonymous && viewer.viewerRole && (
                    <span className="inline-flex items-center border border-border bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                      {t(`role.${viewer.viewerRole}`)}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
