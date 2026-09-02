"use client";

import { StatusPill } from "@/components/admin/status-pill";
import { Button } from "@/components/ui/button";
import { PageState } from "@/components/utils/feedback/page-state";
import { PageBanner } from "@/components/utils/layout/page-banner";
import { PageBannerSkeleton } from "@/components/utils/layout/page-banner/skeleton";
import { useAdminStore } from "@/stores/apis/admin/admin.store";
import {
  LucideBriefcase,
  LucideBuilding2,
  LucideFlag,
  LucideShieldAlert,
  LucideUserPlus,
  LucideUsers,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";

export default function AdminOverviewPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("admin.overview");

  /* ----------------------------- API Integration ---------------------------- */
  const { overview, loadingOverview, error, getOverview } = useAdminStore();

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    void getOverview();
  }, [getOverview]);

  /* -------------------------------- Render UI ------------------------------- */
  if (loadingOverview && !overview) {
    return (
      <div className="flex flex-col gap-5">
        <PageBannerSkeleton stats={3} />
      </div>
    );
  }

  if (!overview && error) {
    return (
      <PageState
        variant="error"
        title={error}
        action={{ label: t("retry"), onClick: () => void getOverview() }}
      />
    );
  }

  if (!overview) return null;

  const cards = [
    { key: "employees", value: overview.employees, icon: LucideUsers },
    { key: "companies", value: overview.companies, icon: LucideBuilding2 },
    {
      key: "newThisWeek",
      value: overview.newUsersLast7Days,
      icon: LucideUserPlus,
    },
    {
      key: "suspended",
      value: overview.suspendedUsers,
      icon: LucideShieldAlert,
    },
    { key: "banned", value: overview.bannedUsers, icon: LucideShieldAlert },
    { key: "liveJobs", value: overview.liveJobs, icon: LucideBriefcase },
    { key: "hiddenJobs", value: overview.hiddenJobs, icon: LucideBriefcase },
  ] as const;

  return (
    <div className="flex flex-col gap-5">
      {/* Banner Section */}
      <PageBanner
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        stats={[
          {
            label: t("statUsers"),
            value: overview.totalUsers.toLocaleString(),
            icon: LucideUsers,
          },
          {
            label: t("statPendingReports"),
            value: overview.pendingReports.toLocaleString(),
            icon: LucideFlag,
          },
        ]}
      />

      {/* Queue Section — the one thing on this page that is a call to action */}
      <section className="flex flex-wrap items-center justify-between gap-4 border border-border bg-card p-5 shadow-hard">
        <div className="flex items-center gap-3">
          <LucideFlag aria-hidden className="size-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-bold text-foreground">
              {t("queueTitle")}
            </p>
            <p className="text-xs text-muted-foreground">
              {overview.pendingReports === 0
                ? t("queueEmpty")
                : t("queueWaiting", { count: overview.pendingReports })}
            </p>
          </div>
          {overview.pendingReports > 0 ? (
            <StatusPill status="pending" label={t("queueBadge")} />
          ) : null}
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/reports">{t("queueAction")}</Link>
        </Button>
      </section>

      {/* Counts Section */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ key, value, icon: Icon }) => (
          <div
            key={key}
            className="border border-border bg-card p-5 shadow-hard"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon aria-hidden className="size-3.5 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                {t(key)}
              </span>
            </div>
            {/*
              A count the API did not send renders as a dash rather than
              throwing. The overview is the panel's landing page, so one
              missing field taking it down locks an admin out of everything
              — which is exactly what happened when the web ran ahead of an
              API without job moderation.
            */}
            <p className="mt-2 text-3xl font-black tabular-nums tracking-[-0.04em] text-foreground">
              {typeof value === "number" ? value.toLocaleString() : "—"}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
