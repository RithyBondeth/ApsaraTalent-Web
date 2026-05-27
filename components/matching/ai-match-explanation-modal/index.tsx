"use client";

import { useState } from "react";
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
import { useTranslations } from "next-intl";

interface Props {
  eid: string;
  cid: string;
  companyName: string;
  /** When true the trigger shows icon-only on mobile (< sm) and full label on sm+. */
  compact?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Score ring                                                           */
/* ------------------------------------------------------------------ */
function ScoreRing({ score }: { score: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center size-[72px] sm:size-[88px] shrink-0">
      {/*
        Explicit width/height attrs are required for Safari — SVG without them
        defaults to 300×150 and ignores CSS size-[] utilities.
        stroke="currentColor" + className="text-muted" is the cross-browser way
        to colour SVG strokes; CSS `stroke-muted` is unreliable in Safari.
      */}
      <svg
        width="72"
        height="72"
        viewBox="0 0 84 84"
        aria-hidden="true"
        className="-rotate-90 sm:w-[88px] sm:h-[88px]"
      >
        {/* Track */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          strokeWidth="7"
          fill="none"
          stroke="currentColor"
          className="text-muted"
        />
        {/* Progress arc */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          strokeWidth="7"
          fill="none"
          stroke={color}
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      {/* Score label — absolute overlay, centred in the ring */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[18px] sm:text-[22px] font-bold tabular-nums leading-none"
          style={{ color }}
        >
          {score}
        </span>
        <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium mt-0.5">
          / 100
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal                                                                */
/* ------------------------------------------------------------------ */
export function AiMatchExplanationModal({
  eid,
  cid,
  companyName,
  compact,
}: Props) {
  const t = useTranslations("matching");

  /* ------------------------------------------------------------------ */
  /*  API                                                                  */
  /* ------------------------------------------------------------------ */
  const { fetchMatchExplanation } = useAiMatchExplanationStore();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IAiMatchExplanationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMatchExplanation(eid, cid);
      setData(res);
    } catch {
      setError(t("analysisFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (data) {
      setOpen(true);
      return;
    }
    fetchExplanation();
  };

  const handleReanalyze = () => {
    setData(null);
    fetchExplanation();
  };

  /* Verdict pill colours */
  const verdictColor = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes("strong"))
      return "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
    if (v.includes("good"))
      return "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
    if (v.includes("partial"))
      return "text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30";
    return "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
  };

  /* Hero background tint based on score */
  const heroBg = (score: number) =>
    score >= 75
      ? "bg-green-50/70 dark:bg-green-900/15"
      : score >= 50
        ? "bg-amber-50/70 dark:bg-amber-900/15"
        : "bg-red-50/70 dark:bg-red-900/15";

  /* ------------------------------------------------------------------ */
  /*  Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <>
      {/* Trigger */}
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs gap-1.5 px-2.5 sm:px-3"
        onClick={handleOpen}
      >
        <LucideSparkles className="size-3.5 text-primary shrink-0" />
        <span className={compact ? "hidden sm:inline" : undefined}>
          {t("aiScore")}
        </span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {/* Header */}
          <DialogHeader className="px-4 sm:px-5 pt-5 pb-3 shrink-0 border-b border-border/60">
            <DialogTitle className="flex items-center gap-2 text-base text-left sm:text-left pr-8">
              <LucideSparkles className="size-4 text-primary shrink-0" />
              <span className="truncate">{t("aiMatchAnalysis")}</span>
            </DialogTitle>
          </DialogHeader>

          {/* ── Scrollable content ────────────────────────────────── */}
          <div className="overflow-y-auto scrollbar-none overscroll-contain min-h-[120px] max-h-[66dvh] sm:max-h-[72dvh] relative z-10">
            {/* ── Loading skeleton — mirrors exact content structure ── */}
            {loading && (
              <>
                {/* Hero skeleton — same layout as real hero, no border (real has none) */}
                <div className="px-4 sm:px-5 py-5 flex items-center gap-3 sm:gap-4 bg-muted/30">
                  <div className="relative flex items-center justify-center size-[72px] sm:size-[88px] shrink-0">
                    <div className="absolute inset-0 rounded-full border-[7px] border-muted animate-pulse" />
                    <div className="flex flex-col items-center gap-1">
                      <Skeleton className="h-4 sm:h-5 w-7 sm:w-8 rounded" />
                      <Skeleton className="h-2 w-6 sm:w-7 rounded" />
                    </div>
                  </div>
                  {/* Company name line + verdict pill — mirrors real hero text */}
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>

                {/* Body skeleton */}
                <div className="px-4 sm:px-5 py-4 flex flex-col gap-5">
                  {/* Explanation paragraph */}
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-5/6 rounded" />
                  </div>

                  {/* Strengths section — green tint + icon mirrors real items */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-green-400/80 shrink-0" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 bg-green-50/80 dark:bg-green-900/20 rounded-lg px-3 py-2.5 animate-pulse"
                        >
                          <div className="size-3.5 mt-0.5 shrink-0 rounded-full bg-green-200 dark:bg-green-700/50" />
                          <div className="flex-1 flex flex-col gap-1.5">
                            <div className="h-3 w-full rounded bg-green-100 dark:bg-green-900/30" />
                            <div
                              className={`h-3 rounded bg-green-100 dark:bg-green-900/30 ${i === 0 ? "w-3/4" : i === 1 ? "w-4/5" : "w-2/3"}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gaps section — amber tint + icon mirrors real items */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-400/80 shrink-0" />
                      <Skeleton className="h-3 w-28 rounded" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {[0, 1].map((i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 bg-amber-50/80 dark:bg-amber-900/20 rounded-lg px-3 py-2.5 animate-pulse"
                        >
                          <div className="size-3.5 mt-0.5 shrink-0 rounded-full bg-amber-200 dark:bg-amber-700/50" />
                          <div className="flex-1 flex flex-col gap-1.5">
                            <div className="h-3 w-full rounded bg-amber-100 dark:bg-amber-900/30" />
                            <div
                              className={`h-3 rounded bg-amber-100 dark:bg-amber-900/30 ${i === 0 ? "w-4/5" : "w-3/5"}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="px-4 sm:px-5 py-10 flex flex-col items-center gap-3 text-center">
                <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center">
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

            {/* Data */}
            {data && !loading && (
              <>
                {/* ── Score hero ── */}
                <div
                  className={`px-4 sm:px-5 py-5 flex items-center gap-3 sm:gap-4 ${heroBg(data.score)}`}
                >
                  <ScoreRing score={data.score} />
                  <div className="flex flex-col gap-2 min-w-0">
                    <p className="text-xs text-muted-foreground truncate">
                      {t("vsCompany", { name: companyName })}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${verdictColor(data.verdict)}`}
                    >
                      {data.verdict}
                    </span>
                  </div>
                </div>

                {/* ── Body ── */}
                <div className="px-4 sm:px-5 py-4 flex flex-col gap-5">
                  {/* Explanation */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.explanation}
                  </p>

                  {/* Strengths */}
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
                            className="flex items-start gap-2.5 bg-green-50/80 dark:bg-green-900/20 rounded-lg px-3 py-2.5"
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

                  {/* Gaps */}
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
                            className="flex items-start gap-2.5 bg-amber-50/80 dark:bg-amber-900/20 rounded-lg px-3 py-2.5"
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

          {/* ── Footer — always in DOM (prevents layout shift) ───────── */}
          {!error && (
            <div className="shrink-0 px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end">
              {loading ? (
                <Skeleton className="h-7 w-24 rounded-md" />
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

export default AiMatchExplanationModal;
