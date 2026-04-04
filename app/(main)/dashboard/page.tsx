"use client";

import { useAnalyticsStore } from "@/stores/apis/matching/analytics.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { LucideUsers } from "lucide-react";
import { useEffect, useRef } from "react";
import { statisticCardConstants } from "@/utils/constants/dashboard.constant";
import dynamic from "next/dynamic";
import { DashboardChartSkeleton } from "@/components/dashboard/skeleton";

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
import { RecentMatchesList } from "@/components/dashboard/recent-matches-list";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
import { TypographyP } from "@/components/utils/typography/typography-p";
import StatisticCard from "@/components/dashboard/statistic-card";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { DashboardLoadingSkeleton } from "@/components/dashboard/skeleton";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  /* ----------------------------- API Integration ---------------------------- */
  const t = useTranslations("dashboard");
  const { user } = useGetCurrentUserStore();
  const { data, loading, error, queryAnalytics } = useAnalyticsStore();

  /* -------------------------------- All States ------------------------------ */
  const hasFetched = useRef<boolean>(false);

  /* --------------------------------- Effects --------------------------------- */
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
      {/* Header Section */}
      <div className="flex flex-col items-start gap-1">
        <TypographyH3>{t("title")}</TypographyH3>
        <TypographyP className="!m-0 text-sm text-muted-foreground">
          {t("description")}
        </TypographyP>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-start gap-2">
              <TypographyH4>{t("weeklyActivity")}</TypographyH4>
              <TypographyP className="!m-0 text-xs text-muted-foreground">
                {t("weeklyActivityDescription")}
              </TypographyP>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
