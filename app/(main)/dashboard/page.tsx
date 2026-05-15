"use client";

import { useAnalyticsStore } from "@/stores/apis/matching/analytics.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { LucideUsers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { statisticCardConstants } from "@/utils/constants/dashboard.constant";
import dynamic from "next/dynamic";
import { DashboardChartSkeleton } from "@/components/dashboard/skeleton";
import { RecentMatchesList } from "@/components/dashboard/recent-matches-list";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import StatisticCard from "@/components/dashboard/statistic-card";
import { DashboardLoadingSkeleton } from "@/components/dashboard/skeleton";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { matchingBannerSvg } from "@/utils/constants/asset.constant";
import { TypographyP } from "@/components/utils/typography/typography-p";

const WeeklyActivityChart = dynamic(
  () =>
    import("@/components/dashboard/weekly-activity-chart").then(
      (m) => m.WeeklyActivityChart,
    ),
  { loading: () => <DashboardChartSkeleton />, ssr: false },
);

const MatchRateRadial = dynamic(
  () =>
    import("@/components/dashboard/match-rate-radial").then(
      (m) => m.MatchRateRadial,
    ),
  { loading: () => <DashboardChartSkeleton />, ssr: false },
);

export default function DashboardPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("dashboard");

  /* ----------------------------- API Integration ---------------------------- */
  const { user } = useGetCurrentUserStore();
  const { data, loading, error, queryAnalytics } = useAnalyticsStore();

  /* -------------------------------- All States ------------------------------ */
  const hasFetched = useRef<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!user || hasFetched.current) return;

    const role = user.role;
    const id =
      role === "employee"
        ? user.employee?.id
        : role === "company"
          ? user.company?.id
          : null;

    if (id && role) {
      hasFetched.current = true;
      queryAnalytics(id, role);
    }
  }, [user, queryAnalytics]);

  const isEmployee = user?.role === "employee";

  /* ---------------------------- Loading State ------------------------------ */
  if (loading || !data) return <DashboardLoadingSkeleton />;

  /* ----------------------------- Error State ------------------------------- */
  if (error)
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-destructive">
        {error}
      </div>
    );

  /* ------------------------------- Render UI ------------------------------- */
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 animate-page-in">
      {/* Banner Section */}
      <div className="w-full flex items-center justify-between gap-6 lg:gap-10 tablet-xl:flex-col tablet-xl:items-center rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-6 py-8 sm:px-8">
        <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
          <TypographyH2 className="leading-relaxed tablet-xl:text-center">
            {isEmployee ? t("bannerTitleEmployee") : t("bannerTitleCompany")}
          </TypographyH2>
          <TypographyH4 className="leading-relaxed tablet-xl:text-center">
            {isEmployee
              ? t("bannerSubtitle1Employee")
              : t("bannerSubtitle1Company")}
          </TypographyH4>
          <TypographyH4 className="leading-relaxed tablet-xl:text-center">
            {isEmployee
              ? t("bannerSubtitle2Employee")
              : t("bannerSubtitle2Company")}
          </TypographyH4>
          <TypographyMuted className="leading-relaxed tablet-xl:text-center">
            {isEmployee ? t("bannerMutedEmployee") : t("bannerMutedCompany")}
          </TypographyMuted>
        </div>
        {mounted && (
          <Image
            src={matchingBannerSvg}
            alt="dashboard"
            height={250}
            width={350}
            className="h-auto max-w-[340px] tablet-xl:!w-full"
            priority
          />
        )}
      </div>

      {/* Stat Cards Row Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statisticCardConstants.map((card, index) => (
          <StatisticCard
            key={index}
            icon={card.icon}
            value={data[card.key]}
            label={t(card.translationKey)}
            suffix={card.suffix}
            color={card.color}
            bgColor={card.bgColor}
          />
        ))}
      </div>

      {/* Charts Row Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
        {/* Weekly Activity Bar Chart Section */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/60 p-5 sm:p-6">
          {/* Weekly Activity Header Section */}
          <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
            <div className="flex flex-col items-start gap-2">
              <TypographyH4>{t("weeklyActivity")}</TypographyH4>
              <TypographyP className="!m-0 text-xs text-muted-foreground">
                {t("weeklyActivityDescription")}
              </TypographyP>
            </div>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-primary" />
                {t("likes")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-pink-500" />
                {t("received")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-emerald-500" />
                {t("matches")}
              </span>
            </div>
          </div>
          {/* Weekly Activity Bar Chart Section */}
          <WeeklyActivityChart data={data.weeklyActivity} />
        </div>

        {/* Match Rate Radial Chart Section */}
        <div className="bg-card rounded-2xl border border-border/60 p-5 sm:p-6 flex flex-col">
          {/* Match Rate Header Section */}
          <div className="flex flex-col items-start gap-2">
            <TypographyH4>{t("matchRate")}</TypographyH4>
            <TypographyP className="!m-0 text-xs text-muted-foreground">
              {t("matchRateDescription")}
            </TypographyP>
          </div>
          {/* Match Rate Chart Section */}
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <MatchRateRadial rate={data.matchRate} />
          </div>
        </div>
      </div>

      {/* Recent Match Row Section */}
      <div className="bg-card rounded-2xl border border-border/60 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <LucideUsers className="h-4.5 w-4.5 text-primary" />
          <TypographyH4>{t("recentMatches")}</TypographyH4>
        </div>
        <RecentMatchesList
          matches={data.recentMatches}
          isEmployee={isEmployee}
        />
      </div>
    </div>
  );
}
