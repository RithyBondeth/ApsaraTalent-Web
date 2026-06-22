"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LucideTarget,
  LucideRotateCcw,
  LucideAlertCircle,
  LucideLoader2,
  LucideCheckCircle2,
} from "lucide-react";
import { API_AI_SKILL_GAP_STREAM_URL } from "@/utils/constants/apis/matching.api.constant";
import { ISkillGapMissing, ISkillGapSummary } from "@/utils/interfaces/resume";
import { streamFetch } from "@/utils/functions/stream-fetch";
import { AiQuotaBadge } from "@/components/utils/feedback/ai-quota-badge";
import { useLocale, useTranslations } from "next-intl";
import MissingCard from "./missing-card";
import { IAiSkillGapModalProps } from "./props";

/* ---------------------------------- Helpers ---------------------------------- */
const GAP_COLOR: Record<string, string> = {
  none: "border-green-500/30 bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-300",
  small:
    "border-blue-500/30 bg-blue-50 dark:bg-blue-900/10 text-blue-800 dark:text-blue-300",
  moderate:
    "border-amber-500/30 bg-amber-50 dark:bg-amber-900/10 text-amber-800 dark:text-amber-300",
  large:
    "border-red-500/30 bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-300",
};

export function AiSkillGapModal(props: IAiSkillGapModalProps) {
  /* ---------------------------------- Props ---------------------------------- */
  const { eid, cid, companyName, compact } = props;

  /* ---------------------------------- Utils ---------------------------------- */
  const t = useTranslations("matching");
  const locale = useLocale();

  /* -------------------------------- All States ------------------------------- */
  const [open, setOpen] = useState<boolean>(false);
  const [matched, setMatched] = useState<string[]>([]);
  const [missing, setMissing] = useState<ISkillGapMissing[]>([]);
  const [summary, setSummary] = useState<ISkillGapSummary | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const hasData = matched.length > 0 || missing.length > 0 || summary !== null;

  /* ---------------------------------- Methods --------------------------------- */
  // ── Handle Stream Analysis ──────────────────────
  const streamAnalysis = async () => {
    setOpen(true);
    setGenerating(true);
    setError(null);
    setMatched([]);
    setMissing([]);
    setSummary(null);

    let lineBuffer = "";
    const receivedMatched: string[] = [];
    const receivedMissing: ISkillGapMissing[] = [];

    const tryParseLine = (line: string) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      try {
        const obj = JSON.parse(trimmed) as Record<string, unknown>;
        if (obj.t === "matched" && typeof obj.skill === "string") {
          receivedMatched.push(obj.skill);
          flushSync(() => setMatched([...receivedMatched]));
        } else if (obj.t === "missing" && typeof obj.skill === "string") {
          receivedMissing.push(obj as unknown as ISkillGapMissing);
          flushSync(() => setMissing([...receivedMissing]));
        } else if (obj.t === "summary") {
          flushSync(() => setSummary(obj as unknown as ISkillGapSummary));
        }
      } catch {
        // Incomplete JSON fragment — wait for more chunks
      }
    };

    try {
      await streamFetch(
        API_AI_SKILL_GAP_STREAM_URL(eid, cid, locale),
        { method: "GET" },
        (event) => {
          if (event.t === "chunk") {
            lineBuffer += event.v;
            const lines = lineBuffer.split("\n");
            lineBuffer = lines.pop() ?? "";
            lines.forEach(tryParseLine);
          } else if (event.t === "done") {
            tryParseLine(lineBuffer); // flush any remaining content
          } else if (event.t === "error") {
            console.warn("[SkillGap] Stream error:", event.v);
            // Surface the server's message when the AI quota / rate limit is hit.
            setError(event.code === 429 ? event.v : t("skillGapFailed"));
          }
        },
      );
    } catch (err) {
      console.warn("[SkillGap] Fetch failed:", err);
      setError(t("skillGapFailed"));
    }

    setGenerating(false);
  };

  // ── Handle Open ─────────────────────────────────
  const handleOpen = () => {
    if (hasData && !generating) {
      setOpen(true);
      return;
    }
    streamAnalysis();
  };

  // ── Handle Regenerate ───────────────────────────
  const handleRegenerate = () => {
    streamAnalysis();
  };

  // ── Handle Derived Display Values ───────────────
  const gapStyle = summary
    ? (GAP_COLOR[summary.overallGap] ?? GAP_COLOR.moderate)
    : "";
  const gapLabel = summary
    ? summary.overallGap === "none"
      ? t("gapNone")
      : summary.overallGap === "small"
        ? t("gapSmall")
        : summary.overallGap === "moderate"
          ? t("gapModerate")
          : t("gapLarge")
    : "";

  /* -------------------------------- Render UI --------------------------------- */
  return (
    <>
      {/* Trigger Button Section */}
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs gap-1.5 px-2.5 sm:px-3"
        onClick={handleOpen}
      >
        <LucideTarget className="size-3.5 text-primary shrink-0" />
        <span className={compact ? "hidden sm:inline" : undefined}>
          {t("skillGap")}
        </span>
      </Button>

      {/* Dialog Section */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl flex flex-col p-0 gap-0">
          {/* Header Section */}
          <DialogHeader className="shrink-0 px-5 pt-5 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3 pr-8">
              <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <LucideTarget className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base font-semibold leading-tight text-left truncate">
                  {t("aiSkillGap", { name: companyName })}
                </DialogTitle>
              </div>
              {missing.length > 0 && (
                <span className="shrink-0 text-xs font-medium bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                  {generating
                    ? t("skillGapBadge", { count: missing.length }) + "…"
                    : t("skillGapBadge", { count: missing.length })}
                </span>
              )}
            </div>
            {/* AI Quota Badge Section */}
            <div className="mt-3">
              <AiQuotaBadge />
            </div>
          </DialogHeader>

          {/* Scrollable Body Section */}
          <div className="overflow-y-auto overscroll-contain max-h-[60vh] px-5 py-4 space-y-4">
            {/* Skeleton Generating (Section With No Data Yet) */}
            {generating && !hasData && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-border/60 bg-card px-4 py-4 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-48 rounded" />
                    <div className="rounded-xl bg-primary/5 border border-primary/10 px-3 py-2.5 space-y-1.5">
                      <Skeleton className="h-2.5 w-16 rounded" />
                      <Skeleton
                        className={`h-3 rounded ${i % 2 === 0 ? "w-full" : "w-4/5"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State Section (No Data and Not Generating) */}
            {error && !generating && !hasData && (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="size-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
                  <LucideAlertCircle className="size-7 text-destructive/70" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t("somethingWentWrong")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-[280px]">
                    {error}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={handleRegenerate}
                >
                  <LucideRotateCcw className="size-3.5" />
                  {t("tryAgain")}
                </Button>
              </div>
            )}

            {/* Matched Skills Section */}
            {matched.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                  {t("matchedSkills")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {matched.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 animate-in fade-in-0 duration-200"
                    >
                      <LucideCheckCircle2 className="size-3 shrink-0" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills Section */}
            {missing.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("missingSkills")}
                </p>
                {missing.map((item, i) => (
                  <MissingCard key={i} {...item} />
                ))}
              </div>
            )}

            {/* Generating More Indicator Section (Streaming with data already visible) */}
            {generating && hasData && (
              <div className="flex items-center gap-2 py-2 px-4 text-xs text-primary">
                <LucideLoader2 className="size-3.5 animate-spin shrink-0" />
                <span>{t("skillGapGenerating")}</span>
              </div>
            )}

            {/* Summary Box Section */}
            {summary && (
              <div
                className={`rounded-2xl border px-4 py-4 ${gapStyle} animate-in fade-in-0 slide-in-from-bottom-2 duration-300`}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-70">
                  {t("skillGapSummary")}
                </p>
                <p className="text-sm font-semibold leading-snug">{gapLabel}</p>
                {summary.estimatedWeeks > 0 && (
                  <p className="text-xs opacity-70 mt-1">
                    {t("estimatedTime", { weeks: summary.estimatedWeeks })}
                  </p>
                )}
                {summary.topPriority && (
                  <p className="text-xs opacity-80 mt-2 leading-relaxed border-t border-current/10 pt-2.5">
                    {summary.topPriority}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer Section */}
          {!error && (
            <div className="shrink-0 px-5 py-4 border-t border-border/60 bg-muted/20 flex items-center justify-end gap-3">
              {generating && !hasData ? (
                <Skeleton className="h-9 w-36 rounded-lg" />
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={handleRegenerate}
                  disabled={generating}
                >
                  <LucideRotateCcw className="size-3.5" />
                  {t("regenerateAnalysis")}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AiSkillGapModal;
