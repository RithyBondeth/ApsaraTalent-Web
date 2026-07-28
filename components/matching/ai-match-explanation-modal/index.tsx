"use client";

import { useRef, useState } from "react";
import { useAiMatchExplanationStore } from "@/stores/apis/matching/ai-match-explanation.store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LucideSparkles,
  LucideCheckCircle2,
  LucideAlertCircle,
  LucideRotateCcw,
} from "lucide-react";
import { IAiMatchExplanationResponse } from "@/utils/interfaces/resume";
import { useLocale, useTranslations } from "next-intl";
import { IAiMatchExplanationModalProps } from "./props";
import ScoreRing from "./score-ring";

/* ---------------------------------- Helper ----------------------------------- */
function isMatchExplanation(
  value: unknown,
): value is IAiMatchExplanationResponse {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.score === "number" &&
    Number.isFinite(data.score) &&
    data.score >= 0 &&
    data.score <= 100 &&
    typeof data.verdict === "string" &&
    typeof data.explanation === "string" &&
    Array.isArray(data.strengths) &&
    data.strengths.every((item) => typeof item === "string") &&
    Array.isArray(data.gaps) &&
    data.gaps.every((item) => typeof item === "string")
  );
}

export function AiMatchExplanationModal(props: IAiMatchExplanationModalProps) {
  /* --------------------------------- Props -------------------------------- */
  const { eid, cid, companyName, compact } = props;

  /* --------------------------------- Utils -------------------------------- */
  const t = useTranslations("matching");
  const locale = useLocale();

  /* ------------------------------- All States ----------------------------- */
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IAiMatchExplanationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* ---------------------------- API Integration --------------------------- */
  const { fetchMatchExplanation } = useAiMatchExplanationStore();

  /* -------------------------------- Methods ------------------------------- */
  // ── Handle Fetch Explanation ──────────────────────
  const fetchExplanation = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMatchExplanation(eid, cid, locale);
      if (!isMatchExplanation(res)) throw new Error("Invalid response");
      setData(res);
    } catch {
      setError(t("analysisFailed"));
    } finally {
      setLoading(false);
    }
  };

  // ── Handle Open ──────────────────────────────────
  const handleOpen = () => {
    if (data) {
      setOpen(true);
      return;
    }
    fetchExplanation();
  };

  // ── Handle Reanalyze ─────────────────────────────
  const handleReanalyze = () => {
    setData(null);
    fetchExplanation();
  };

  // ── Verdict Color ────────────────────────────────
  const verdictColor = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes("strong"))
      return "text-green-800 bg-green-100 dark:text-green-300 dark:bg-green-900/30";
    if (v.includes("good"))
      return "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
    if (v.includes("partial"))
      return "text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30";
    return "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
  };

  // ── Hero Background ───────────────────────────────
  const heroBg = (score: number) =>
    score >= 75
      ? "bg-green-50/70 dark:bg-green-900/15"
      : score >= 50
        ? "bg-amber-50/70 dark:bg-amber-900/15"
        : "bg-red-50/70 dark:bg-red-900/15";

  /* ---------------------------------- Render UI ---------------------------------- */
  return (
    <>
      {/* Trigger Button Section */}
      <Button
        ref={triggerRef}
        size="sm"
        variant="outline"
        className="h-8 gap-1.5 rounded-none px-2.5 text-xs sm:px-3"
        aria-label={t("aiScore")}
        onClick={handleOpen}
      >
        <LucideSparkles className="size-3.5 text-primary shrink-0" />
        <span className={compact ? "hidden sm:inline" : undefined}>
          {t("aiScore")}
        </span>
      </Button>

      {/* Dialog Section */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="rounded-none border-t-[5px] border-t-foreground shadow-[6px_6px_0_hsl(var(--foreground)/0.1)]"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          {/* Header Section */}
          <DialogHeader className="px-4 sm:px-5 pt-5 pb-3 shrink-0 border-b border-border/60">
            <DialogTitle className="flex items-center gap-2 text-base text-left sm:text-left pr-8">
              <LucideSparkles className="size-4 text-primary shrink-0" />
              <span className="truncate">{t("aiMatchAnalysis")}</span>
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Content Section */}
          <div className="overflow-y-auto scrollbar-none overscroll-contain min-h-[120px] max-h-[66dvh] sm:max-h-[72dvh] relative z-10">
            {/* Loading Skeleton Section */}
            {loading && (
              <>
                {/* Hero Skeleton Section */}
                <div className="px-4 sm:px-5 py-5 flex items-center gap-3 sm:gap-4 bg-muted/30">
                  <div className="relative flex items-center justify-center size-[72px] sm:size-[88px] shrink-0">
                    <div className="absolute inset-0 rounded-full border-[7px] border-muted animate-pulse" />
                    <div className="flex flex-col items-center gap-1">
                      <Skeleton className="h-4 sm:h-5 w-7 sm:w-8 rounded-none" />
                      <Skeleton className="h-2 w-6 sm:w-7 rounded-none" />
                    </div>
                  </div>
                  {/* Company Name Line and Verdict Pill Section */}
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <Skeleton className="h-3 w-24 rounded-none" />
                    <Skeleton className="h-6 w-20 rounded-none" />
                  </div>
                </div>

                {/* Body Skeleton Section */}
                <div className="px-4 sm:px-5 py-4 flex flex-col gap-5">
                  {/* Explanation Paragraph Section */}
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-full rounded-none" />
                    <Skeleton className="h-4 w-full rounded-none" />
                    <Skeleton className="h-4 w-5/6 rounded-none" />
                  </div>

                  {/* Strengths Section */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-green-400/80 shrink-0" />
                      <Skeleton className="h-3 w-20 rounded-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 border border-green-200 border-l-[4px] border-l-green-500 bg-green-50/80 dark:border-green-800 dark:bg-green-900/20 rounded-none px-3 py-2.5 animate-pulse"
                        >
                          <div className="size-3.5 mt-0.5 shrink-0 rounded-full bg-green-200 dark:bg-green-700/50" />
                          <div className="flex-1 flex flex-col gap-1.5">
                            <div className="h-3 w-full rounded-none bg-green-100 dark:bg-green-900/30" />
                            <div
                              className={`h-3 rounded-none bg-green-100 dark:bg-green-900/30 ${i === 0 ? "w-3/4" : i === 1 ? "w-4/5" : "w-2/3"}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gaps Section */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-400/80 shrink-0" />
                      <Skeleton className="h-3 w-28 rounded-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {[0, 1].map((i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 border border-amber-200 border-l-[4px] border-l-amber-500 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-900/20 rounded-none px-3 py-2.5 animate-pulse"
                        >
                          <div className="size-3.5 mt-0.5 shrink-0 rounded-full bg-amber-200 dark:bg-amber-700/50" />
                          <div className="flex-1 flex flex-col gap-1.5">
                            <div className="h-3 w-full rounded-none bg-amber-100 dark:bg-amber-900/30" />
                            <div
                              className={`h-3 rounded-none bg-amber-100 dark:bg-amber-900/30 ${i === 0 ? "w-4/5" : "w-3/5"}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Error State Section */}
            {error && !loading && (
              <div className="px-4 sm:px-5 py-10 flex flex-col items-center gap-3 text-center">
                <div className="size-12 rounded-none border border-destructive/20 bg-destructive/10 flex items-center justify-center">
                  <LucideAlertCircle className="size-6 text-destructive/70" />
                </div>
                <p className="text-sm text-destructive max-w-[260px]">
                  {error}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1.5 mt-1"
                  onClick={handleReanalyze}
                >
                  <LucideRotateCcw className="size-3.5" />
                  {t("tryAgain")}
                </Button>
              </div>
            )}

            {/* Data Section */}
            {data && !loading && (
              <>
                {/* Score Hero Section */}
                <div
                  className={`px-4 sm:px-5 py-5 flex items-center gap-3 sm:gap-4 ${heroBg(data.score)}`}
                >
                  <ScoreRing score={data.score} />
                  <div className="flex flex-col gap-2 min-w-0">
                    <p className="text-xs text-muted-foreground truncate">
                      {t("vsCompany", { name: companyName })}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-none border border-current/15 w-fit ${verdictColor(data.verdict)}`}
                    >
                      {data.verdict}
                    </span>
                  </div>
                </div>

                {/* Body Section */}
                <div className="px-4 sm:px-5 py-4 flex flex-col gap-5">
                  {/* Explanation Section */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.explanation}
                  </p>

                  {/* Strengths Section */}
                  {data.strengths.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-green-500 shrink-0" />
                        <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
                          {t("strengths")}
                        </p>
                      </div>
                      <ul className="flex flex-col gap-1.5">
                        {data.strengths.map((s, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 border border-green-200 border-l-[4px] border-l-green-500 bg-green-50/80 dark:border-green-800 dark:bg-green-900/20 rounded-none px-3 py-2.5"
                          >
                            <LucideCheckCircle2 className="size-3.5 mt-0.5 shrink-0 text-green-500" />
                            <span className="text-sm text-foreground/85 leading-snug">
                              {s}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Gaps Section */}
                  {data.gaps.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                        <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
                          {t("areasToImprove")}
                        </p>
                      </div>
                      <ul className="flex flex-col gap-1.5">
                        {data.gaps.map((g, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 border border-amber-200 border-l-[4px] border-l-amber-500 bg-amber-50/80 dark:border-amber-800 dark:bg-amber-900/20 rounded-none px-3 py-2.5"
                          >
                            <LucideAlertCircle className="size-3.5 mt-0.5 shrink-0 text-amber-500" />
                            <span className="text-sm text-foreground/85 leading-snug">
                              {g}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Section */}
          {!error && (
            <div className="shrink-0 px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end">
              {loading ? (
                <Skeleton className="h-7 w-24 rounded-none" />
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1.5"
                  onClick={handleReanalyze}
                >
                  <LucideRotateCcw className="size-3.5" />
                  {t("reanalyze")}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
