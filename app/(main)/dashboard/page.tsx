"use client";

import { useAnalyticsStore } from "@/stores/apis/matching/analytics.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { Activity, BarChart3, LucideUsers } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { statisticCardConstants } from "@/utils/constants/dashboard.constant";
import dynamic from "next/dynamic";
import { DashboardChartSkeleton } from "@/components/dashboard/skeleton";
import { RecentMatchesList } from "@/components/dashboard/recent-matches-list";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
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
import { PageState } from "@/components/utils/feedback/page-state";
import { PageBanner } from "@/components/utils/layout/page-banner";

const WeeklyActivityChart = dynamic(
  () =>
    import("@/components/dashboard/weekly-activity-chart").then(
      (m) => m.WeeklyActivityChart,
    ),
  {
    loading: () => <DashboardChartSkeleton variant="activity" />,
    ssr: false,
  },
);

const MatchRateRadial = dynamic(
  () =>
    import("@/components/dashboard/match-rate-radial").then(
      (m) => m.MatchRateRadial,
    ),
  {
    loading: () => <DashboardChartSkeleton variant="rate" />,
    ssr: false,
  },
);

/* ---------------------------------- Helper --------------------------------- */
function SectionHeader({
  number,
  title,
  icon,
}: {
  number: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4 border-b border-border px-6 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <span className="pixel-numeral text-xs text-muted-foreground">
          {number}
        </span>
        <span aria-hidden className="h-3 w-px bg-border" />
        <h2 className="pixel-display text-lg text-foreground sm:text-xl">
          {title}
        </h2>
      </div>
      <div className="grid size-7 shrink-0 place-items-center bg-primary text-primary-foreground">
        {icon}
      </div>
    </div>
  );
}

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
  const analyticsId = isEmployee ? user?.employee?.id : user?.company?.id;

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

  /* ----------------------------- Error State ------------------------------- */
  if (error)
    return (
      <div className="w-full p-6 sm:p-8">
        <PageState
          variant="error"
          title={error}
          compact
          action={{
            label: t("retry"),
            onClick: () => {
              if (analyticsId && user?.role) {
                void queryAnalytics(analyticsId, user.role);
              }
            },
          }}
        />
      </div>
    );

  /* ---------------------------- Loading State ------------------------------ */
  if (loading || !data) return <DashboardLoadingSkeleton />;

  /* ------------------------------- Render UI ------------------------------- */
  return (
    <div className="dashboard-editorial w-full">
      {/* Banner Section */}
      <PageBanner
        eyebrow={t("insightCenter")}
        title={isEmployee ? t("bannerTitleEmployee") : t("bannerTitleCompany")}
        subtitle={`${
          isEmployee
            ? t("bannerSubtitle1Employee")
            : t("bannerSubtitle1Company")
        } ${
          isEmployee
            ? t("bannerSubtitle2Employee")
            : t("bannerSubtitle2Company")
        }`}
      />

      <section className="pixel-band w-full">
        <SectionHeader
          number="01"
          title={t("overview")}
          icon={<Activity className="size-4" />}
        />

        {/* Profile Completeness Card Section */}
        {profileCompletion && (
          <ProfileCompletenessCard
            completion={profileCompletion}
            profileUrl={profileUrl}
          />
        )}

        {/* Stat Cards Row Section — cells of one ruled strip. The 1px gap over
            a border-coloured bed is what draws the hairlines, so the cells
            share every edge instead of each carrying its own box. */}
        <div className="pixel-ruled grid-cols-2 border-x-0 border-b-0 lg:grid-cols-4">
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
      </section>

      {/* Charts Row Section */}
      <section className="pixel-band w-full">
        <SectionHeader
          number="02"
          title={t("performance")}
          icon={<BarChart3 className="size-4" />}
        />
        <div className="pixel-ruled grid-cols-1 border-x-0 border-b-0 lg:grid-cols-3">
          {/* Weekly Activity Bar Chart Section */}
          <div className="p-6 sm:p-8 lg:col-span-2">
            {/* Weekly Activity Header Section */}
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col items-start gap-2">
                <TypographyH4>{t("weeklyActivity")}</TypographyH4>
                <TypographyP className="!m-0 text-xs text-muted-foreground">
                  {t("weeklyActivityDescription")}
                </TypographyP>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 bg-primary" />
                  {t("likes")}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 bg-chart-3" />
                  {t("received")}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 bg-chart-4" />
                  {t("matches")}
                </span>
              </div>
            </div>
            {/* Weekly Activity Bar Chart Section */}
            <WeeklyActivityChart data={data.weeklyActivity} />
          </div>

          {/* Match Rate Radial Chart Section */}
          <div className="flex flex-col p-6 sm:p-8">
            {/* Match Rate Header Section */}
            <div className="flex flex-col items-start gap-2">
              <TypographyH4>{t("matchRate")}</TypographyH4>
              <TypographyP className="!m-0 text-xs text-muted-foreground">
                {t("matchRateDescription")}
              </TypographyP>
            </div>
            {/* Match Rate Chart Section */}
            <div className="flex min-h-[200px] flex-1 items-center justify-center">
              <MatchRateRadial rate={data.matchRate} />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Match Row Section */}
      <section className="pixel-band w-full">
        <SectionHeader
          number="03"
          title={t("recentMatches")}
          icon={<LucideUsers className="size-4" />}
        />
        <div className="p-6 sm:p-8">
          <RecentMatchesList
            matches={data.recentMatches}
            isEmployee={isEmployee}
          />
        </div>
      </section>
    </div>
  );
}
