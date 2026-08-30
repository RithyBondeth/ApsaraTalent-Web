"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LucideSparkles,
  LucideCheckCircle2,
  LucidePlus,
  LucideLoader2,
} from "lucide-react";
import { API_RESUME_OPTIMIZE_STREAM_URL } from "@/utils/constants/apis/resume.api.constant";
import {
  IOptimizeResumeResponse,
  IExperienceSuggestion,
} from "@/utils/interfaces/resume/ai-resume.interface";
import { streamFetch } from "@/utils/functions/network";
import { AiQuotaBadge } from "@/components/utils/feedback/ai-quota-badge";
import { Badge } from "@/components/ui/badge";
import { IAiOptimizerDrawerProps } from "./props";
import { useTranslations } from "next-intl";

export function AiResumeOptimizerDrawer(props: IAiOptimizerDrawerProps) {
  /* ---------------------------------- Props ---------------------------------- */
  const { getCurrentValues, onApplySummary, onApplySkills, onApplyExperience } =
    props;

  /* ---------------------------------- Utils ---------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- All States -------------------------------- */
  const [open, setOpen] = useState<boolean>(false);
  /** True while the SSE stream is active */
  const [generating, setGenerating] = useState<boolean>(false);
  /** Progressively built result */
  const [data, setData] = useState<IOptimizeResumeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appliedSummary, setAppliedSummary] = useState<boolean>(false);
  const [appliedSkills, setAppliedSkills] = useState<boolean>(false);
  const [appliedExp, setAppliedExp] = useState<Set<number>>(new Set());
  const requestControllerRef = useRef<AbortController | null>(null);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(
    () => () => {
      requestControllerRef.current?.abort();
    },
    [],
  );

  /* ---------------------------------- Methods --------------------------------- */
  // ── Handle Analyze Resume ─────────────────
  const analyze = async (force = false) => {
    setOpen(true);
    if (data && !generating && !force) return;
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    setGenerating(true);
    setError(null);
    setData({
      overallFeedback: "",
      suggestedSummary: "",
      suggestedSkills: [],
      experienceSuggestions: [],
    });

    const values = getCurrentValues();

    // Accumulated result updated as SSE events arrive
    const acc: IOptimizeResumeResponse = {
      overallFeedback: "",
      suggestedSummary: "",
      suggestedSkills: [],
      experienceSuggestions: [],
    };

    // Accumulate raw text chunks and parse complete NDJSON lines client-side.
    let lineBuffer = "";

    const tryParseLine = (line: string) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      try {
        const item: unknown = JSON.parse(trimmed);
        if (!item || typeof item !== "object") return;
        const parsed = item as Record<string, unknown>;
        let changed = false;
        switch (parsed.type) {
          case "feedback":
            if (typeof parsed.value === "string") {
              acc.overallFeedback = parsed.value;
              changed = true;
            }
            break;
          case "summary":
            if (typeof parsed.value === "string") {
              acc.suggestedSummary = parsed.value;
              changed = true;
            }
            break;
          case "skill":
            if (typeof parsed.value === "string" && parsed.value.trim()) {
              acc.suggestedSkills = [...acc.suggestedSkills, parsed.value];
              changed = true;
            }
            break;
          case "exp":
            if (
              typeof parsed.index === "number" &&
              Number.isInteger(parsed.index) &&
              parsed.index >= 0 &&
              typeof parsed.description === "string"
            ) {
              const achievements = Array.isArray(parsed.achievements)
                ? parsed.achievements.filter(
                    (value): value is string => typeof value === "string",
                  )
                : [];
              acc.experienceSuggestions = [
                ...acc.experienceSuggestions,
                {
                  index: parsed.index,
                  improvedDescription: parsed.description,
                  improvedAchievements: achievements,
                } as IExperienceSuggestion,
              ];
              changed = true;
            }
            break;
        }
        // flushSync forces an immediate re-render for each parsed section,
        // bypassing React 18's automatic batching.
        if (changed) flushSync(() => setData({ ...acc }));
      } catch {
        // Incomplete JSON fragment — wait for more chunks
      }
    };

    try {
      await streamFetch(
        API_RESUME_OPTIMIZE_STREAM_URL,
        { method: "POST", body: values, signal: controller.signal },
        (event) => {
          if (event.t === "chunk") {
            lineBuffer += event.v;
            const lines = lineBuffer.split("\n");
            lineBuffer = lines.pop() ?? "";
            lines.forEach(tryParseLine);
          } else if (event.t === "done") {
            tryParseLine(lineBuffer);
          } else if (event.t === "error") {
            console.warn("[ResumeOptimizer] Stream error:", event.v);
            // Surface the server's message when the AI quota / rate limit is hit.
            setError(event.code === 429 ? event.v : t("optimizerFailed"));
            setData(null);
          }
        },
      );
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        console.warn("[ResumeOptimizer] Fetch failed:", err);
        setError(t("optimizerFailed"));
        setData(null);
      }
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setGenerating(false);
      }
    }
  };

  // ── Handle Reanalyze Resume ───────────────
  const handleReanalyze = () => {
    setData(null);
    setAppliedSummary(false);
    setAppliedSkills(false);
    setAppliedExp(new Set());
    void analyze(true);
  };

  // ── Handle Apply Summary ──────────────────
  const handleApplySummary = () => {
    if (!data) return;
    onApplySummary(data.suggestedSummary);
    setAppliedSummary(true);
  };

  // ── Handle Apply Skills ───────────────────
  const handleApplySkills = () => {
    if (!data) return;
    onApplySkills(data.suggestedSkills);
    setAppliedSkills(true);
  };

  // ── Handle Apply Experience ───────────────
  const handleApplyExperience = (index: number) => {
    if (!data) return;
    if (index < 0 || index >= getCurrentValues().experience.length) return;
    const s = data.experienceSuggestions.find((e) => e.index === index);
    if (!s) return;
    onApplyExperience(index, s.improvedDescription, s.improvedAchievements);
    setAppliedExp((prev) => new Set(prev).add(index));
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <>
      {/* Button To Open Drawer Section */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => void analyze()}
        className="h-8 gap-1.5 rounded-none text-xs"
        title={t("aiOptimizerTitle")}
      >
        <LucideSparkles size={14} className="text-primary" />
        <span className="hidden lg:inline">{t("aiOptimize")}</span>
        <span className="lg:hidden">{t("optimize")}</span>
      </Button>

      {/* Drawer Section */}
      <Sheet
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen && generating) requestControllerRef.current?.abort();
        }}
      >
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
        >
          {/* Header Section */}
          <SheetHeader className="border-b px-5 py-4">
            <SheetTitle className="flex items-center gap-2">
              <LucideSparkles className="size-4 text-primary" />
              {t("aiOptimizerTitle")}
              {generating && (
                <LucideLoader2 className="ml-1 size-3.5 animate-spin text-primary" />
              )}
            </SheetTitle>
            {/* AI Quota Badge Section */}
            <div className="mt-3">
              <AiQuotaBadge />
            </div>
          </SheetHeader>

          {/* Content Section */}
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-4">
            {/* Full Skeleton Section (Generating With No Data Yet) */}
            {generating && !data?.overallFeedback && (
              <div className="flex flex-col gap-3 pt-2">
                <Skeleton className="h-4 w-full rounded-none" />
                <Skeleton className="h-4 w-5/6 rounded-none" />
                <Skeleton className="h-4 w-4/6 rounded-none" />
                <div className="my-2 h-px bg-border" />
                <Skeleton className="h-4 w-full rounded-none" />
                <Skeleton className="h-4 w-3/4 rounded-none" />
                <Skeleton className="h-4 w-full rounded-none" />
                <Skeleton className="h-4 w-2/3 rounded-none" />
              </div>
            )}

            {/* Error Section */}
            {error && !generating && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Progressively Revealed Results Section */}
            {data && (
              <>
                {/* Overall Feedback Section */}
                {data.overallFeedback && (
                  <div className="rounded-none border border-border bg-muted/50 p-4 duration-200 animate-in fade-in-0 slide-in-from-bottom-1">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("overallFeedback")}
                    </p>
                    <p className="text-sm leading-relaxed text-foreground">
                      {data.overallFeedback}
                    </p>
                  </div>
                )}

                {/* Summary Suggestion Section */}
                {data.suggestedSummary && (
                  <div className="flex flex-col gap-2 duration-200 animate-in fade-in-0 slide-in-from-bottom-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t("improvedSummary")}
                      </p>
                      {appliedSummary ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <LucideCheckCircle2 className="size-3" />{" "}
                          {t("applied")}
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 rounded-none px-2 text-[11px]"
                          onClick={handleApplySummary}
                          disabled={generating}
                        >
                          {t("apply")}
                        </Button>
                      )}
                    </div>
                    <p className="rounded-none border border-l-[4px] border-border border-l-primary bg-primary/5 p-3 text-sm leading-relaxed text-muted-foreground">
                      {data.suggestedSummary}
                    </p>
                  </div>
                )}

                {/* Skills Suggestions Section */}
                {data.suggestedSkills.length > 0 && (
                  <div className="flex flex-col gap-2 duration-200 animate-in fade-in-0 slide-in-from-bottom-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t("suggestedSkills")}
                      </p>
                      {appliedSkills ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <LucideCheckCircle2 className="size-3" />{" "}
                          {t("applied")}
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-[11px]"
                          onClick={handleApplySkills}
                          disabled={generating}
                        >
                          {t("addAll")}
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {data.suggestedSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="gap-1 text-xs duration-150 animate-in zoom-in-75"
                        >
                          <LucidePlus className="size-2.5" />
                          {skill}
                        </Badge>
                      ))}
                      {/* Pulsing Placeholder While Generating Skills Section */}
                      {generating && data.suggestedSkills.length < 6 && (
                        <Skeleton className="h-5 w-20 rounded-none" />
                      )}
                    </div>
                  </div>
                )}

                {/* Experience Suggestions Section */}
                {data.experienceSuggestions.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("experienceImprovements")}
                    </p>
                    {data.experienceSuggestions.map((s) => (
                      <div
                        key={s.index}
                        className="flex flex-col gap-2 rounded-none border border-border bg-muted/20 p-3 duration-200 animate-in fade-in-0 slide-in-from-bottom-1"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-foreground">
                            {t("positionNumber", { number: s.index + 1 })}
                          </p>
                          {appliedExp.has(s.index) ? (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <LucideCheckCircle2 className="size-3" />{" "}
                              {t("applied")}
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-[11px]"
                              onClick={() => handleApplyExperience(s.index)}
                              disabled={generating}
                            >
                              {t("apply")}
                            </Button>
                          )}
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {s.improvedDescription}
                        </p>
                        {s.improvedAchievements.length > 0 && (
                          <ul className="mt-1 flex flex-col gap-1">
                            {s.improvedAchievements.map((a, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-1.5 text-xs text-muted-foreground"
                              >
                                <LucideCheckCircle2 className="mt-0.5 size-3 shrink-0 text-primary/60" />
                                {a}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}

                    {/* Skeleton For Next EXP Block While Still Streaming Section */}
                    {generating && (
                      <div className="flex flex-col gap-2 rounded-none border border-border bg-muted/20 p-3">
                        <Skeleton className="h-3 w-24 rounded-none" />
                        <Skeleton className="h-3 w-full rounded-none" />
                        <Skeleton className="h-3 w-5/6 rounded-none" />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Re-analyze Button Section */}
          {data && !generating && (
            <div className="border-t bg-background px-5 py-3">
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-1.5 text-xs"
                onClick={handleReanalyze}
              >
                <LucideSparkles className="size-3.5" />
                {t("reanalyze")}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
