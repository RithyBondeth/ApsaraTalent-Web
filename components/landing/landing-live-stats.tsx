"use client";

import { useEffect } from "react";
import { useGetLandingStatsStore } from "@/stores/apis/users/get-landing-stats.store";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

function renderCount(value: number | null, loaded: boolean): string {
  if (value !== null) return value.toLocaleString();
  return loaded ? "N/A" : "...";
}

export function LandingLiveStats() {
  const stats = useGetLandingStatsStore((state) => state.stats);
  const loading = useGetLandingStatsStore((state) => state.loading);
  const initialized = useGetLandingStatsStore((state) => state.initialized);
  const getLandingStats = useGetLandingStatsStore(
    (state) => state.getLandingStats,
  );

  useEffect(() => {
    void getLandingStats();
  }, [getLandingStats]);

  const loaded = initialized && !loading;
  const users = stats?.users ?? null;
  const companies = stats?.companies ?? null;
  const employees = stats?.employees ?? null;

  return (
    <div className="flex items-center gap-6 2xl:gap-8 pt-3">
      <div className="flex flex-col">
        <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-300">
          {renderCount(users, loaded)}+
        </span>
        <TypographyMuted className="text-xs">Users</TypographyMuted>
      </div>

      <div className="h-8 w-px bg-amber-300/30 dark:bg-amber-500/20" />

      <div className="flex flex-col">
        <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-300">
          {renderCount(companies, loaded)}+
        </span>
        <TypographyMuted className="text-xs">Companies</TypographyMuted>
      </div>

      <div className="h-8 w-px bg-amber-300/30 dark:bg-amber-500/20" />

      <div className="flex flex-col">
        <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-300">
          {renderCount(employees, loaded)}+
        </span>
        <TypographyMuted className="text-xs">Employees</TypographyMuted>
      </div>
    </div>
  );
}
