"use client";

import { useEffect, useRef, useState } from "react";
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
  const { eid, cid, companyName, compact, autoOpen } = props;

  /* --------------------------------- Utils -------------------------------- */
  const t = useTranslations("matching");
  const locale = useLocale();

  /* ------------------------------- All States ----------------------------- */
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IAiMatchExplanationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const autoOpenRef = useRef<boolean>(autoOpen ?? false);

  /* ---------------------------- API Integration --------------------------- */
  const { fetchMatchExplanation } = useAiMatchExplanationStore();

  /* ------------------------------ Effects ------------------------------- */
  useEffect(() => {
    if (!autoOpenRef.current) return;
    autoOpenRef.current = false;
    triggerRef.current?.click();
  }, []);

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
        <LucideSparkles className="size-3.5 shrink-0 text-primary" />
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
          <DialogHeader className="shrink-0 border-b border-border/60 px-4 pb-3 pt-5 sm:px-5">
            <DialogTitle className="flex items-center gap-2 pr-8 text-left text-base sm:text-left">
              <LucideSparkles className="size-4 shrink-0 text-primary" />
              <span className="truncate">{t("aiMatchAnalysis")}</span>
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Content Section */}
          <div className="scrollbar-none relative z-10 max-h-[66dvh] min-h-[120px] overflow-y-auto overscroll-contain sm:max-h-[72dvh]">
            {/* Loading Skeleton Section */}
            {loading && (
              <>
                {/* Hero Skeleton Section */}
                <div className="flex items-center gap-3 bg-muted/30 px-4 py-5 sm:gap-4 sm:px-5">
                  <div className="relative flex size-[72px] shrink-0 items-center justify-center sm:size-[88px]">
                    <div className="absolute inset-0 animate-pulse rounded-full border-[7px] border-muted" />
                    <div className="flex flex-col items-center gap-1">
                      <Skeleton className="h-4 w-7 rounded-none sm:h-5 sm:w-8" />
                      <Skeleton className="h-2 w-6 rounded-none sm:w-7" />
                    </div>
                  </div>
                  {/* Company Name Line and Verdict Pill Section */}
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Skeleton className="h-3 w-24 rounded-none" />
                    <Skeleton className="h-6 w-20 rounded-none" />
                  </div>
                </div>

                {/* Body Skeleton Section */}
                <div className="flex flex-col gap-5 px-4 py-4 sm:px-5">
                  {/* Explanation Paragraph Section */}
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-full rounded-none" />
                    <Skeleton className="h-4 w-full rounded-none" />
                    <Skeleton className="h-4 w-5/6 rounded-none" />
                  </div>

                  {/* Strengths Section */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 shrink-0 rounded-full bg-green-400/80" />
                      <Skeleton className="h-3 w-20 rounded-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex animate-pulse items-start gap-2.5 rounded-none border border-l-[4px] border-green-200 border-l-green-500 bg-green-50/80 px-3 py-2.5 dark:border-green-800 dark:bg-green-900/20"
                        >
                          <div className="mt-0.5 size-3.5 shrink-0 rounded-full bg-green-200 dark:bg-green-700/50" />
                          <div className="flex flex-1 flex-col gap-1.5">
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
                      <span className="size-2 shrink-0 rounded-full bg-amber-400/80" />
                      <Skeleton className="h-3 w-28 rounded-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {[0, 1].map((i) => (
                        <div
                          key={i}
                          className="flex animate-pulse items-start gap-2.5 rounded-none border border-l-[4px] border-amber-200 border-l-amber-500 bg-amber-50/80 px-3 py-2.5 dark:border-amber-800 dark:bg-amber-900/20"
                        >
                          <div className="mt-0.5 size-3.5 shrink-0 rounded-full bg-amber-200 dark:bg-amber-700/50" />
                          <div className="flex flex-1 flex-col gap-1.5">
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
              <div className="flex flex-col items-center gap-3 px-4 py-10 text-center sm:px-5">
                <div className="flex size-12 items-center justify-center rounded-none border border-destructive/20 bg-destructive/10">
                  <LucideAlertCircle className="size-6 text-destructive/70" />
                </div>
                <p className="max-w-[260px] text-sm text-destructive">
                  {error}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-1 gap-1.5 text-xs"
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
                  className={`flex items-center gap-3 px-4 py-5 sm:gap-4 sm:px-5 ${heroBg(data.score)}`}
                >
                  <ScoreRing score={data.score} />
                  <div className="flex min-w-0 flex-col gap-2">
                    <p className="truncate text-xs text-muted-foreground">
                      {t("vsCompany", { name: companyName })}
                    </p>
                    <span
                      className={`border-current/15 w-fit rounded-none border px-2.5 py-1 text-xs font-semibold ${verdictColor(data.verdict)}`}
                    >
                      {data.verdict}
                    </span>
                  </div>
                </div>

                {/* Body Section */}
                <div className="flex flex-col gap-5 px-4 py-4 sm:px-5">
                  {/* Explanation Section */}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {data.explanation}
                  </p>

                  {/* Strengths Section */}
                  {data.strengths.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 shrink-0 rounded-full bg-green-500" />
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                          {t("strengths")}
                        </p>
                      </div>
                      <ul className="flex flex-col gap-1.5">
                        {data.strengths.map((s, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 rounded-none border border-l-[4px] border-green-200 border-l-green-500 bg-green-50/80 px-3 py-2.5 dark:border-green-800 dark:bg-green-900/20"
                          >
                            <LucideCheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-green-500" />
                            <span className="text-sm leading-snug text-foreground/85">
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
                        <span className="size-2 shrink-0 rounded-full bg-amber-500" />
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                          {t("areasToImprove")}
                        </p>
                      </div>
                      <ul className="flex flex-col gap-1.5">
                        {data.gaps.map((g, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 rounded-none border border-l-[4px] border-amber-200 border-l-amber-500 bg-amber-50/80 px-3 py-2.5 dark:border-amber-800 dark:bg-amber-900/20"
                          >
                            <LucideAlertCircle className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                            <span className="text-sm leading-snug text-foreground/85">
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
            <div className="flex shrink-0 items-center justify-end border-t border-border/60 bg-muted/30 px-4 py-3 sm:px-5">
              {loading ? (
                <Skeleton className="h-7 w-24 rounded-none" />
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
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
