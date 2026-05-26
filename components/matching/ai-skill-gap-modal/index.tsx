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
  LucideBookOpen,
} from "lucide-react";
import { API_AI_SKILL_GAP_STREAM_URL } from "@/utils/constants/apis/matching.api.constant";
import { ISkillGapMissing, ISkillGapSummary } from "@/utils/interfaces/resume";
import { streamFetch } from "@/utils/functions/stream-fetch";
import { useTranslations } from "next-intl";

/* ------------------------------------------------------------------ */
/*  Colour maps                                                          */
/* ------------------------------------------------------------------ */
const CRITICALITY_COLOR: Record<string, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  low: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
};

const GAP_COLOR: Record<string, string> = {
  none: "border-green-500/30 bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-300",
  small:
    "border-blue-500/30 bg-blue-50 dark:bg-blue-900/10 text-blue-800 dark:text-blue-300",
  moderate:
    "border-amber-500/30 bg-amber-50 dark:bg-amber-900/10 text-amber-800 dark:text-amber-300",
  large:
    "border-red-500/30 bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-300",
};

/* ------------------------------------------------------------------ */
/*  Missing skill card sub-component                                     */
/* ------------------------------------------------------------------ */
function MissingCard({ item }: { item: ISkillGapMissing }) {
  const t = useTranslations("matching");
  const chipColor =
    CRITICALITY_COLOR[item.criticality] ?? "bg-muted text-muted-foreground";
  const critLabel =
    item.criticality === "high"
      ? t("criticalityHigh")
      : item.criticality === "medium"
        ? t("criticalityMedium")
        : t("criticalityLow");

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm px-4 py-4 flex flex-col gap-2.5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {/* Skill name + criticality badge */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-foreground leading-snug">
          {item.skill}
        </p>
        <span
          className={`shrink-0 inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${chipColor}`}
        >
          {critLabel}
        </span>
      </div>

      {/* Positions that need this skill */}
      {item.positions.length > 0 && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">{t("neededFor")}:</span>{" "}
          {item.positions.join(", ")}
        </p>
      )}

      {/* Learning tip */}
      <div className="rounded-xl bg-primary/5 border border-primary/10 px-3 py-2.5 flex gap-2">
        <LucideBookOpen className="size-3.5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
            {t("learningTip")}
          </p>
          <p className="text-xs text-foreground/80 leading-relaxed">
            {item.tip}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Props                                                                */
/* ------------------------------------------------------------------ */
interface Props {
  eid: string;
  cid: string;
  companyName: string;
  /** When true the trigger shows icon-only on mobile (< sm) and full label on sm+. */
  compact?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Modal                                                                */
/* ------------------------------------------------------------------ */
export function AiSkillGapModal({ eid, cid, companyName, compact }: Props) {
  const t = useTranslations("matching");

  /* ---------------------------------------------------------------- */
  /*  State                                                             */
  /* ---------------------------------------------------------------- */
  const [open, setOpen] = useState(false);
  const [matched, setMatched] = useState<string[]>([]);
  const [missing, setMissing] = useState<ISkillGapMissing[]>([]);
  const [summary, setSummary] = useState<ISkillGapSummary | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasData = matched.length > 0 || missing.length > 0 || summary !== null;

  /* ---------------------------------------------------------------- */
  /*  Stream                                                            */
  /* ---------------------------------------------------------------- */
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
        API_AI_SKILL_GAP_STREAM_URL(eid, cid),
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
            setError(t("skillGapFailed"));
          }
        },
      );
    } catch (err) {
      console.warn("[SkillGap] Fetch failed:", err);
      setError(t("skillGapFailed"));
    }

    setGenerating(false);
  };

  const handleOpen = () => {
    if (hasData && !generating) {
      setOpen(true);
      return;
    }
    streamAnalysis();
  };

  const handleRegenerate = () => {
    streamAnalysis();
  };

  /* ---------------------------------------------------------------- */
  /*  Derived display values                                            */
  /* ---------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------- */
  /*  Render                                                            */
  /* ---------------------------------------------------------------- */
  return (
    <>
      {/* Trigger button */}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl flex flex-col p-0 gap-0">
          {/* ── Header ─────────────────────────────────────────── */}
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
          </DialogHeader>

          {/* ── Scrollable body ─────────────────────────────────── */}
          <div className="overflow-y-auto overscroll-contain max-h-[60vh] px-5 py-4 space-y-4">
            {/* Skeleton — generating with no data yet */}
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

            {/* Error state — no data and not generating */}
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

            {/* ── Matched skills section ──────────────────────── */}
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

            {/* ── Missing skills section ──────────────────────── */}
            {missing.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("missingSkills")}
                </p>
                {missing.map((item, i) => (
                  <MissingCard key={i} item={item} />
                ))}
              </div>
            )}

            {/* Generating more indicator — streaming with data already visible */}
            {generating && hasData && (
              <div className="flex items-center gap-2 py-2 px-4 text-xs text-primary">
                <LucideLoader2 className="size-3.5 animate-spin shrink-0" />
                <span>{t("skillGapGenerating")}</span>
              </div>
            )}

            {/* ── Summary box ─────────────────────────────────── */}
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

          {/* ── Footer ─────────────────────────────────────────── */}
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
