"use client";

import { useEffect } from "react";
import { useGetLandingStatsStore } from "@/stores/apis/users/get-landing-stats.store";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { CountUp } from "@/components/utils/animations/count-up";
import { useTranslations } from "next-intl";

/* ------------------------------------- Helper ------------------------------------- */
function StatValue({
  value,
  loaded,
}: {
  value: number | null;
  loaded: boolean;
}) {
  if (value !== null) {
    return (
      <>
        <CountUp to={value} format />+
      </>
    );
  }
  return <>{loaded ? "N/A" : "..."}</>;
}

export default function LandingLiveStats({
  inverted = false,
}: {
  inverted?: boolean;
}) {
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
    <div
      className={
        inverted
          ? "flex items-center gap-4 border-t border-[hsl(var(--landing-hero-ink)/0.14)] pt-5 sm:gap-7 2xl:gap-9"
          : "flex items-center gap-4 border-t border-border pt-5 sm:gap-7 2xl:gap-9"
      }
    >
      {/* Number of User Section */}
      <div className="flex flex-col">
        <span
          className={
            inverted
              ? "pixel-numeral text-xl text-[hsl(var(--landing-hero-ink))] sm:text-2xl"
              : "pixel-numeral text-xl text-foreground sm:text-2xl"
          }
        >
          <StatValue value={users} loaded={loaded} />
        </span>
        <TypographyMuted
          className={
            inverted
              ? "pixel-label text-[10px] text-[hsl(var(--landing-hero-ink)/0.48)]"
              : "pixel-label text-[10px]"
          }
        >
          {t("statsUsers")}
        </TypographyMuted>
      </div>

      <div
        className={
          inverted
            ? "h-7 w-px bg-[hsl(var(--landing-hero-ink)/0.14)] sm:h-8"
            : "h-7 w-px bg-border sm:h-8"
        }
      />

      {/* Number of Company Section */}
      <div className="flex flex-col">
        <span
          className={
            inverted
              ? "pixel-numeral text-xl text-[hsl(var(--landing-hero-ink))] sm:text-2xl"
              : "pixel-numeral text-xl text-foreground sm:text-2xl"
          }
        >
          <StatValue value={companies} loaded={loaded} />
        </span>
        <TypographyMuted
          className={
            inverted
              ? "pixel-label text-[10px] text-[hsl(var(--landing-hero-ink)/0.48)]"
              : "pixel-label text-[10px]"
          }
        >
          {t("statsCompanies")}
        </TypographyMuted>
      </div>

      <div
        className={
          inverted
            ? "h-7 w-px bg-[hsl(var(--landing-hero-ink)/0.14)] sm:h-8"
            : "h-7 w-px bg-border sm:h-8"
        }
      />

      {/* Number of Employee Section */}
      <div className="flex flex-col">
        <span
          className={
            inverted
              ? "pixel-numeral text-xl text-[hsl(var(--landing-hero-ink))] sm:text-2xl"
              : "pixel-numeral text-xl text-foreground sm:text-2xl"
          }
        >
          <StatValue value={employees} loaded={loaded} />
        </span>
        <TypographyMuted
          className={
            inverted
              ? "pixel-label text-[10px] text-[hsl(var(--landing-hero-ink)/0.48)]"
              : "pixel-label text-[10px]"
          }
        >
          {t("statsEmployees")}
        </TypographyMuted>
      </div>
    </div>
  );
}
