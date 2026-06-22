"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAiQuotaStore } from "@/stores/apis/ai/get-ai-quota.store";

/**
 * Compact, self-fetching indicator of the user's remaining daily AI usage.
 * Renders nothing until data is available (so it never shows a broken state),
 * and colour-shifts green → amber → red as the quota is consumed.
 *
 * Drop it into any AI feature surface, e.g. <AiQuotaBadge /> in a modal header.
 */
export function AiQuotaBadge({ className }: { className?: string }) {
  const t = useTranslations("ai");
  const { data, loading, fetchQuota } = useAiQuotaStore();

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  // Lightweight placeholder on first load; nothing if the fetch failed.
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
  if (!data) return null;

  const { used, limit, remaining } = data.daily;
  const remainingRatio = limit > 0 ? remaining / limit : 0;
  const remainingPct = Math.max(0, Math.min(100, Math.round(remainingRatio * 100)));

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

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1",
        tone.ring,
        className,
      )}
      title={t("usedTodayTooltip", {
        used,
        limit,
        date: new Date(data.resetsAt).toLocaleString(),
      })}
    >
      <Sparkles className={cn("size-3.5 shrink-0", tone.text)} />
      <span className={cn("text-xs font-medium whitespace-nowrap", tone.text)}>
        {t("usesLeftToday", { remaining, limit })}
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
