"use client";

import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { cn } from "@/lib/utils";
import { useEmployerAnalyticsStore } from "@/stores/apis/job/employer-analytics.store";
import {
  LucideBriefcase,
  LucideCircleCheckBig,
  LucideLoader2,
  LucideTrendingDown,
  LucideTrendingUp,
  LucideUsers,
  LucideXCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { IEmployerAnalyticsWidgetProps } from "./props";

/*
  Company-side dashboard summary: four overview tiles, an application-volume
  delta chip, a compact funnel, and the top jobs by applicant count. Read-
  only. The data all comes from the ATS pipeline #1 already writes — no
  extra tracking needs to land for these numbers to move.
*/

export function EmployerAnalyticsWidget({
  className,
}: IEmployerAnalyticsWidgetProps) {
  const t = useTranslations("employerAnalytics");

  const data = useEmployerAnalyticsStore((s) => s.data);
  const loading = useEmployerAnalyticsStore((s) => s.loading);
  const loaded = useEmployerAnalyticsStore((s) => s.loaded);
  const error = useEmployerAnalyticsStore((s) => s.error);
  const fetch = useEmployerAnalyticsStore((s) => s.fetch);

  useEffect(() => {
    if (!loaded && !loading) fetch();
  }, [loaded, loading, fetch]);

  if (loading && !data) {
    return (
      <section
        className={cn(
          "flex w-full items-center justify-center border border-border bg-card p-8 shadow-hard",
          className,
        )}
      >
        <LucideLoader2 className="size-5 animate-spin text-muted-foreground" />
      </section>
    );
  }

  if (!data) {
    return (
      <section
        className={cn(
          "flex w-full flex-col gap-2 border border-border bg-card p-4 shadow-hard sm:p-5",
          className,
        )}
      >
        <TypographyMuted className="text-sm">
          {error ?? t("empty")}
        </TypographyMuted>
      </section>
    );
  }

  const deltaSign = data.applicationsDelta.delta;
  const funnelMax = Math.max(1, ...data.funnel.map((s) => s.count));

  return (
    <section
      className={cn(
        "flex w-full flex-col gap-5 border border-border bg-card p-4 shadow-hard sm:p-5",
        className,
      )}
      aria-labelledby="employer-analytics-heading"
    >
      <header>
        <h2
          id="employer-analytics-heading"
          className="text-base font-black tracking-[-0.02em] sm:text-lg"
        >
          {t("title")}
        </h2>
        <TypographyMuted className="mt-0.5 text-xs">
          {t("subtitle")}
        </TypographyMuted>
      </header>

      {/* Overview tiles */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <StatTile
          icon={LucideBriefcase}
          label={t("openPositions")}
          value={data.openPositions}
        />
        <StatTile
          icon={LucideUsers}
          label={t("activePipeline")}
          value={data.activePipeline}
        />
        <StatTile
          icon={LucideCircleCheckBig}
          label={t("hired30d")}
          value={data.hired30d}
        />
        <StatTile
          icon={LucideXCircle}
          label={t("rejected30d")}
          value={data.rejected30d}
        />
      </div>

      {/* Application volume delta chip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-background p-3 shadow-hard-xs">
        <div className="min-w-0">
          <p className="text-sm font-black tracking-[-0.01em]">
            {t("applicationsCurrent", {
              count: data.applicationsDelta.current,
            })}
          </p>
          <TypographyMuted className="mt-0.5 text-[11px]">
            {t("vsPrevious", { previous: data.applicationsDelta.previous })}
          </TypographyMuted>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 border px-2 py-1 text-xs font-black tabular-nums",
            deltaSign > 0
              ? "border-success-border bg-success-subtle text-success-accent"
              : deltaSign < 0
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-border bg-muted text-muted-foreground",
          )}
        >
          {deltaSign > 0 ? (
            <LucideTrendingUp className="size-3" />
          ) : deltaSign < 0 ? (
            <LucideTrendingDown className="size-3" />
          ) : null}
          {deltaSign > 0 ? "+" : ""}
          {deltaSign}
        </span>
        {data.medianDaysToFirstMove !== null && (
          <div className="w-full sm:w-auto">
            <p className="text-sm font-black tabular-nums tracking-[-0.01em]">
              {t("medianDays", { days: data.medianDaysToFirstMove })}
            </p>
            <TypographyMuted className="mt-0.5 text-[11px]">
              {t("medianDaysHint")}
            </TypographyMuted>
          </div>
        )}
      </div>

      {/* Funnel */}
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {t("funnel")}
        </h3>
        <ul className="flex flex-col gap-1">
          {data.funnel.map((stage) => {
            const width = Math.round((stage.count / funnelMax) * 100);
            return (
              <li
                key={stage.status}
                className="flex items-center gap-3 text-xs"
              >
                <span className="w-24 shrink-0 truncate font-semibold text-foreground">
                  {t(`status.${stage.status}`)}
                </span>
                <div
                  aria-hidden
                  className="relative h-5 flex-1 overflow-hidden border border-border bg-muted"
                >
                  <div
                    className="h-full bg-primary transition-[width]"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right font-black tabular-nums">
                  {stage.count}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Top jobs */}
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {t("topJobs")}
        </h3>
        {data.topJobs.length === 0 ? (
          <TypographyMuted className="text-sm">
            {t("topJobsEmpty")}
          </TypographyMuted>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {data.topJobs.map((job) => (
              <li
                key={job.jobId}
                className="flex items-center justify-between gap-3 border border-border bg-background p-2 shadow-hard-xs"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{job.title}</p>
                  <TypographyMuted className="mt-0.5 text-[11px]">
                    {t("perJobBreakdown", {
                      active: job.activePipeline,
                      hired: job.hired,
                      rejected: job.rejected,
                    })}
                  </TypographyMuted>
                </div>
                <span className="text-sm font-black tabular-nums">
                  {job.totalApplicants}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof LucideBriefcase;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 border border-border bg-background p-3 shadow-hard-xs">
      <div className="grid size-9 shrink-0 place-items-center bg-primary text-primary-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-black tabular-nums leading-tight">{value}</p>
        <TypographyMuted className="text-[11px]">{label}</TypographyMuted>
      </div>
    </div>
  );
}
