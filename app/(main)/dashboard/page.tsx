"use client";

import {
  TAnalyticsData,
  useAnalyticsStore,
} from "@/stores/apis/matching/analytics.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import {
  Bookmark,
  Heart,
  HeartHandshake,
  Handshake,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { DashboardSkeleton } from "./skeleton";
import { WeeklyActivityChart } from "./_components/weekly-activity-chart";
import { MatchRateRadial } from "./_components/match-rate-radial";
import { RecentMatchesList } from "./_components/recent-matches-list";

/* ─── Stat card config ─── */
type StatCardConfig = {
  key: keyof TAnalyticsData;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  suffix?: string;
};

const statCards: StatCardConfig[] = [
  {
    key: "totalLikesGiven",
    label: "Likes Given",
    icon: Heart,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    key: "totalLikesReceived",
    label: "Likes Received",
    icon: HeartHandshake,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    key: "totalMatches",
    label: "Total Matches",
    icon: Handshake,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    key: "totalFavorites",
    label: "Saved Favorites",
    icon: Bookmark,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

export default function DashboardPage() {
  const { user } = useGetCurrentUserStore();
  const { data, loading, error, fetchAnalytics } = useAnalyticsStore();

  const hasFetched = useRef(false);
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
      fetchAnalytics(id, role);
    }
  }, [user, fetchAnalytics]);

  const isEmployee = user?.role === "employee";

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 animate-page-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your activity overview at a glance.
        </p>
      </div>

      {loading || !data ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-destructive">
          {error}
        </div>
      ) : (
        <>
          {/* ── Stat Cards Row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              const value = data[card.key];

              return (
                <div
                  key={card.key}
                  className="group relative overflow-hidden bg-card rounded-2xl border border-border/60 p-4 sm:p-5 transition-all duration-300 hover:shadow-md hover:border-border"
                >
                  {/* Subtle gradient bg on hover */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${card.bgColor}`}
                    style={{ opacity: 0 }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.bgColor}`}
                      >
                        <Icon className={`h-4.5 w-4.5 ${card.color}`} />
                      </div>
                      <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {typeof value === "number" ? value : 0}
                      {card.suffix ?? ""}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
                      {card.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Charts Row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Weekly Activity Bar Chart — takes 2 cols */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border/60 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold">Weekly Activity</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your activity over the last 7 days
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-primary" />
                    Likes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-pink-500" />
                    Received
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-emerald-500" />
                    Matches
                  </span>
                </div>
              </div>
              <WeeklyActivityChart data={data.weeklyActivity} />
            </div>

            {/* Match Rate Radial Chart — takes 1 col */}
            <div className="bg-card rounded-2xl border border-border/60 p-5 sm:p-6 flex flex-col">
              <div className="mb-2">
                <h2 className="text-base font-semibold">Match Rate</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Percentage of likes that became matches
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center min-h-[200px]">
                <MatchRateRadial rate={data.matchRate} />
              </div>
            </div>
          </div>

          {/* ── Recent Matches Row ── */}
          <div className="bg-card rounded-2xl border border-border/60 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4.5 w-4.5 text-primary" />
              <h2 className="text-base font-semibold">Recent Matches</h2>
            </div>
            <RecentMatchesList
              matches={data.recentMatches}
              isEmployee={isEmployee}
            />
          </div>
        </>
      )}
    </div>
  );
}
