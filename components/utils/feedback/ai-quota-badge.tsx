"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TAiQuotaAction,
  useAiQuotaStore,
} from "@/stores/apis/ai/get-ai-quota.store";

export function AiQuotaBadge({
  className,
  action,
}: {
  className?: string;
  /**
   * Show a per-action cap (e.g. CV generation) instead of the global daily
   * quota. Use on surfaces where the action's own limit is the one the user
   * will actually hit first.
   */
  action?: TAiQuotaAction;
}) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("ai");

  /* ------------------------------ API Integration --------------------------- */
  const { data, loading, fetchQuota } = useAiQuotaStore();

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  /* ------------------------------ Loading State ----------------------------- */
  if (!data && loading) {
    return (
      <div
        className={cn(
          "h-6 w-36 animate-pulse rounded-full bg-muted",
          className,
        )}
      />
    );
  }

  /* ------------------------------- Empty State ------------------------------ */
  if (!data) return null;

  /* --------------------------------- Helpers -------------------------------- */
  // `actions` is absent if the badge renders against an older API build.
  const bucket = (action ? data.actions?.[action] : data.daily) ?? data.daily;
  const { used, limit, remaining } = bucket;
  const labelKey = action === "cvGeneration" ? "cvLeftToday" : "usesLeftToday";
  const tooltipKey =
    action === "cvGeneration" ? "cvUsedTodayTooltip" : "usedTodayTooltip";
  const remainingRatio = limit > 0 ? remaining / limit : 0;
  const remainingPct = Math.max(
    0,
    Math.min(100, Math.round(remainingRatio * 100)),
  );

  const tone =
    remainingRatio > 0.5
      ? {
          text: "text-emerald-600 dark:text-emerald-400",
          bar: "bg-emerald-500",
          ring: "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/10",
        }
      : remainingRatio > 0.2
        ? {
            text: "text-amber-600 dark:text-amber-400",
            bar: "bg-amber-500",
            ring: "border-amber-500/30 bg-amber-50 dark:bg-amber-900/10",
          }
        : {
            text: "text-red-600 dark:text-red-400",
            bar: "bg-red-500",
            ring: "border-red-500/30 bg-red-50 dark:bg-red-900/10",
          };

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1",
        tone.ring,
        className,
      )}
      title={t(tooltipKey, {
        used,
        limit,
        date: new Date(data.resetsAt).toLocaleString(),
      })}
    >
      <Sparkles className={cn("size-3.5 shrink-0", tone.text)} />
      <span className={cn("text-xs font-medium whitespace-nowrap", tone.text)}>
        {t(labelKey, { remaining, limit })}
      </span>
      <span className="h-1.5 w-10 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <span
          className={cn("block h-full rounded-full transition-all", tone.bar)}
          style={{ width: `${remainingPct}%` }}
        />
      </span>
    </div>
  );
}
