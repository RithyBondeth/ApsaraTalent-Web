"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Bot as Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAiQuotaStore } from "@/stores/apis/ai/get-ai-quota.store";

export function AiQuotaBadge({ className }: { className?: string }) {
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
    return <div className={cn("h-6 w-36 animate-pulse bg-muted", className)} />;
  }

  /* ------------------------------- Empty State ------------------------------ */
  if (!data) return null;

  /* --------------------------------- Helpers -------------------------------- */
  const { used, limit, remaining } = data.daily;
  const remainingRatio = limit > 0 ? remaining / limit : 0;
  const remainingPct = Math.max(
    0,
    Math.min(100, Math.round(remainingRatio * 100)),
  );

  // Quota really is a severity scale, so it reads from the status ramp. Each
  // token already resolves per theme — no `dark:` twin needed.
  const tone =
    remainingRatio > 0.5
      ? {
          text: "text-success-accent",
          bar: "bg-success",
          ring: "border-success-border bg-success-subtle",
        }
      : remainingRatio > 0.2
        ? {
            text: "text-warning-accent",
            bar: "bg-warning",
            ring: "border-warning-border bg-warning-subtle",
          }
        : {
            text: "text-destructive-accent",
            bar: "bg-destructive",
            ring: "border-destructive-border bg-destructive-subtle",
          };

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 border px-2.5 py-1",
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
      <span className={cn("whitespace-nowrap text-xs font-medium", tone.text)}>
        {t("usesLeftToday", { remaining, limit })}
      </span>
      <span className="h-1.5 w-10 overflow-hidden rounded-full bg-foreground/10">
        <span
          className={cn("block h-full rounded-full transition-all", tone.bar)}
          style={{ width: `${remainingPct}%` }}
        />
      </span>
    </div>
  );
}
