"use client";

import { useEffect } from "react";
import { useGetLandingStatsStore } from "@/stores/apis/users/get-landing-stats.store";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useTranslations } from "next-intl";

/* ------------------------------------- Helper -------------------------------------- */
function renderCount(value: number | null, loaded: boolean): string {
  if (value !== null) return value.toLocaleString();
  return loaded ? "N/A" : "...";
}

export default function LandingLiveStats() {
  /* ------------------------------------- Utils ------------------------------------ */
  const t = useTranslations("landing");

  /* -------------------------------- API Integration ------------------------------- */
  const stats = useGetLandingStatsStore((state) => state.stats);
  const loading = useGetLandingStatsStore((state) => state.loading);
  const initialized = useGetLandingStatsStore((state) => state.initialized);
  const getLandingStats = useGetLandingStatsStore(
    (state) => state.getLandingStats,
  );

  /* ------------------------------------ Effects ----------------------------------- */
  useEffect(() => {
    getLandingStats();
  }, [getLandingStats]);

  /* -------------------------------- Computed States ------------------------------- */
  const loaded = initialized && !loading;
  const users = stats?.users ?? null;
  const companies = stats?.companies ?? null;
  const employees = stats?.employees ?? null;

  /* ----------------------------------- Render UI ----------------------------------- */
  return (
    <div className="flex items-center gap-4 sm:gap-6 2xl:gap-8 pt-3">
      {/* Number of User Section */}
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-300">
          {renderCount(users, loaded)}+
        </span>
        <TypographyMuted className="text-[10px] sm:text-xs">
          {t("statsUsers")}
        </TypographyMuted>
      </div>

      <div className="h-6 sm:h-8 w-px bg-amber-300/30 dark:bg-amber-500/20" />

      {/* Number of Company Section */}
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-300">
          {renderCount(companies, loaded)}+
        </span>
        <TypographyMuted className="text-[10px] sm:text-xs">
          {t("statsCompanies")}
        </TypographyMuted>
      </div>

      <div className="h-6 sm:h-8 w-px bg-amber-300/30 dark:bg-amber-500/20" />

      {/* Number of Employee Section */}
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-300">
          {renderCount(employees, loaded)}+
        </span>
        <TypographyMuted className="text-[10px] sm:text-xs">
          {t("statsEmployees")}
        </TypographyMuted>
      </div>
    </div>
  );
}
