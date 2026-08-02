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
import Image from "next/image";
import { matchingBannerSvg } from "@/utils/constants/asset.constant";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  getEmployeeProfileCompletion,
  getCompanyProfileCompletion,
} from "@/utils/functions/profile";
import { PageState } from "@/components/utils/feedback/page-state";

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
function SectionHeader({ number, title, icon }: { number: string; title: string; icon: React.ReactNode }) {
  return (
    <div className="flex w-full items-end justify-between gap-4 border-b border-border pb-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-black tracking-[0.16em] text-muted-foreground">{number}</span>
        <h2 className="text-xl font-black tracking-[-0.03em] text-foreground sm:text-2xl">{title}</h2>
      </div>
      <div className="grid size-9 shrink-0 place-items-center bg-primary text-primary-foreground">{icon}</div>
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
      <div className="mx-auto w-full max-w-[1500px] px-3 py-10 sm:px-4 lg:px-5">
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
    <div className="dashboard-editorial mx-auto flex w-full max-w-[1500px] flex-col items-start gap-7 px-3 animate-page-in sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <section className="feed-hero grid min-h-[280px] w-full grid-cols-[minmax(0,1.45fr)_minmax(260px,0.75fr)] overflow-hidden border border-border bg-card tablet-md:grid-cols-1">
        <div className="flex min-w-0 flex-col justify-between gap-8 px-7 py-8 sm:px-9 sm:py-10 tablet-md:gap-5 tablet-md:px-5 tablet-md:py-6">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px w-7 bg-primary" />
            {t("insightCenter")}
          </div>
          <div className="max-w-3xl">
            <h1 className="max-w-[18ch] text-balance text-3xl font-black leading-[1.05] tracking-[-0.045em] text-foreground sm:text-4xl lg:text-5xl">
              {isEmployee ? t("bannerTitleEmployee") : t("bannerTitleCompany")}
            </h1>
            <p className="mt-4 max-w-[60ch] text-sm leading-6 text-muted-foreground sm:text-base">
              {isEmployee ? t("bannerSubtitle1Employee") : t("bannerSubtitle1Company")} {isEmployee ? t("bannerSubtitle2Employee") : t("bannerSubtitle2Company")}
            </p>
          </div>
          <p className="max-w-[70ch] border-l-2 border-foreground pl-3 text-xs leading-5 text-muted-foreground">
            {isEmployee ? t("bannerMutedEmployee") : t("bannerMutedCompany")}
          </p>
        </div>

        <div className="feed-hero-visual">
          <div aria-hidden className="feed-hero-visual-grid" />
          <div className="feed-hero-network-chip"><span className="feed-hero-network-icon" aria-hidden><Activity /></span><span>{t("insightCenter")}</span><span aria-hidden className="feed-hero-network-status" /></div>
          <div aria-hidden className="feed-hero-art-stage">
            <span className="feed-hero-node feed-hero-node-one" /><span className="feed-hero-node feed-hero-node-two" /><span className="feed-hero-node feed-hero-node-three" />
            <div className="feed-hero-art-frame">
              <div className="feed-hero-art-grid" /><div className="feed-hero-art-glow" />
              <Image src={matchingBannerSvg} alt="" height={260} width={360} className="feed-hero-artwork" priority />
              <span className="feed-hero-corner feed-hero-corner-nw" /><span className="feed-hero-corner feed-hero-corner-ne" /><span className="feed-hero-corner feed-hero-corner-sw" /><span className="feed-hero-corner feed-hero-corner-se" />
            </div>
          </div>
          <div aria-hidden className="feed-hero-signal-bars"><span /><span /><span /><span /></div>
        </div>
      </section>

      <section className="flex w-full flex-col gap-5">
        <SectionHeader number="01" title={t("overview")} icon={<Activity className="size-4" />} />

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
      </section>

      {/* Charts Row Section */}
      <section className="flex w-full flex-col gap-5">
      <SectionHeader number="02" title={t("performance")} icon={<BarChart3 className="size-4" />} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Weekly Activity Bar Chart Section */}
        <div className="border border-border border-t-[5px] border-t-primary bg-card p-5 shadow-[5px_5px_0_hsl(var(--foreground)/0.055)] sm:col-span-2 sm:p-6 lg:col-span-2">
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
                <span className="size-2.5 bg-primary" />
                {t("likes")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 bg-pink-500" />
                {t("received")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 bg-emerald-500" />
                {t("matches")}
              </span>
            </div>
          </div>
          {/* Weekly Activity Bar Chart Section */}
          <WeeklyActivityChart data={data.weeklyActivity} />
        </div>

        {/* Match Rate Radial Chart Section */}
        <div className="flex flex-col border border-border border-t-[5px] border-t-primary bg-card p-5 shadow-[5px_5px_0_hsl(var(--foreground)/0.055)] sm:p-6">
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
      </section>

      {/* Recent Match Row Section */}
      <section className="flex w-full flex-col gap-5">
      <SectionHeader number="03" title={t("recentMatches")} icon={<LucideUsers className="size-4" />} />
      <div className="border border-border border-t-[5px] border-t-primary bg-card p-5 shadow-[5px_5px_0_hsl(var(--foreground)/0.055)] sm:p-6">
        <RecentMatchesList
          matches={data.recentMatches}
          isEmployee={isEmployee}
        />
      </div>
      </section>
    </div>
  );
}
