"use client";

import { useAnalyticsStore } from "@/stores/apis/matching/analytics.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { LucideUsers } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { statisticCardConstants } from "@/utils/constants/dashboard.constant";
import dynamic from "next/dynamic";
import { DashboardChartSkeleton } from "@/components/dashboard/skeleton";
import { RecentMatchesList } from "@/components/dashboard/recent-matches-list";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { FeaturePageHeader } from "@/components/utils/layout/feature-page-header";
import StatisticCard from "@/components/dashboard/statistic-card";
import { ProfileCompletenessCard } from "@/components/dashboard/profile-completeness-card";
import { DashboardLoadingSkeleton } from "@/components/dashboard/skeleton";
import { useTranslations } from "next-intl";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  getEmployeeProfileCompletion,
  getCompanyProfileCompletion,
} from "@/utils/functions/profile";

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

  /* -------------------------------- All States ------------------------------ */
  const hasFetched = useRef<boolean>(false);

  /* ----------------------------- API Integration ---------------------------- */
  const { user } = useGetCurrentUserStore();
  const { data, loading, error, queryAnalytics } = useAnalyticsStore();

  /* --------------------------------- Effects -------------------------------- */
  // ── Query Analytics Effect ─────────────────────
  useEffect(() => {
    if (!user || hasFetched.current) return;

    const role = user.role;
    const id =
      role === USER_ROLE.EMPLOYEE
        ? user.employee?.id
        : role === USER_ROLE.COMPANY
          ? user.company?.id
          : null;

    if (id && role) {
      hasFetched.current = true;
      queryAnalytics(id, role);
    }
  }, [user, queryAnalytics]);

  /* --------------------------- User Role Handling --------------------------- */
  const isEmployee = user?.role === USER_ROLE.EMPLOYEE;
  const profileUrl = `/profile/${user?.role ?? USER_ROLE.EMPLOYEE}`;

  /* -------------------------------- Methods --------------------------------- */
  // ── Profile Completion Function ────────────────
  const profileCompletion = useMemo(() => {
    if (!user) return null;
    if (user.role === USER_ROLE.EMPLOYEE && user.employee)
      return getEmployeeProfileCompletion(user.employee);
    if (user.role === USER_ROLE.COMPANY && user.company)
      return getCompanyProfileCompletion(user.company);
    return null;
  }, [user]);

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
      {/* Compact Introduction Section */}
      <FeaturePageHeader
        title={isEmployee ? t("bannerTitleEmployee") : t("bannerTitleCompany")}
        description={
          isEmployee
            ? t("bannerSubtitle1Employee")
            : t("bannerSubtitle1Company")
        }
      />

      {/* Profile Completeness Card Section */}
      {profileCompletion && (
        <ProfileCompletenessCard
          completion={profileCompletion}
          profileUrl={profileUrl}
        />
      )}

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Weekly Activity Bar Chart Section */}
        <div className="sm:col-span-2 lg:col-span-2 bg-card rounded-2xl border border-border/60 p-5 sm:p-6">
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
                <span className="size-2.5 rounded-full bg-primary/55" />
                {t("received")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[hsl(var(--teal))]" />
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
