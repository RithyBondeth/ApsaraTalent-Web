"use client";

import { useState } from "react";
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
} from "@/utils/interfaces/resume";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { streamFetch } from "@/utils/functions/stream-fetch";
import { Badge } from "@/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  Props                                                                */
/* ------------------------------------------------------------------ */
interface Props {
  getCurrentValues: () => IBuildResume;
  onApplySummary: (summary: string) => void;
  onApplySkills: (skills: string[]) => void;
  onApplyExperience: (
    index: number,
    description: string,
    achievements: string[],
  ) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                            */
/* ------------------------------------------------------------------ */
export function AiResumeOptimizerDrawer({
  getCurrentValues,
  onApplySummary,
  onApplySkills,
  onApplyExperience,
}: Props) {
  const [open, setOpen] = useState(false);

  /** True while the SSE stream is active */
  const [generating, setGenerating] = useState(false);
  /** Progressively built result */
  const [data, setData] = useState<IOptimizeResumeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [appliedSummary, setAppliedSummary] = useState(false);
  const [appliedSkills, setAppliedSkills] = useState(false);
  const [appliedExp, setAppliedExp] = useState<Set<number>>(new Set());

  /* analyze ---------------------------------------------------------- */
  const analyze = async () => {
    setOpen(true);
    if (data && !generating) return; // already have data
    setGenerating(true);
    setError(null);
    // Reset partial state
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
        const item = JSON.parse(trimmed);
        let changed = false;
        switch (item.type) {
          case "feedback":
            acc.overallFeedback = item.value ?? "";
            changed = true;
            break;
          case "summary":
            acc.suggestedSummary = item.value ?? "";
            changed = true;
            break;
          case "skill":
            if (item.value) {
              acc.suggestedSkills = [...acc.suggestedSkills, item.value];
              changed = true;
            }
            break;
          case "exp":
            if (item.index !== undefined) {
              acc.experienceSuggestions = [
                ...acc.experienceSuggestions,
                {
                  index: item.index,
                  improvedDescription: item.description ?? "",
                  improvedAchievements: Array.isArray(item.achievements)
                    ? item.achievements
                    : [],
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
        { method: "POST", body: values },
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
            setError("Failed to analyze resume. Please try again.");
            setData(null);
          }
        },
      );
    } catch (err) {
      console.warn("[ResumeOptimizer] Fetch failed:", err);
      setError("Failed to analyze resume. Please try again.");
      setData(null);
    }

    setGenerating(false);
  };

  const handleReanalyze = () => {
    setData(null);
    setAppliedSummary(false);
    setAppliedSkills(false);
    setAppliedExp(new Set());
    analyze();
  };

  /* apply actions ---------------------------------------------------- */
  const handleApplySummary = () => {
    if (!data) return;
    onApplySummary(data.suggestedSummary);
    setAppliedSummary(true);
  };

  const handleApplySkills = () => {
    if (!data) return;
    onApplySkills(data.suggestedSkills);
    setAppliedSkills(true);
  };

  const handleApplyExperience = (index: number) => {
    if (!data) return;
    const s = data.experienceSuggestions.find((e) => e.index === index);
    if (!s) return;
    onApplyExperience(index, s.improvedDescription, s.improvedAchievements);
    setAppliedExp((prev) => new Set(prev).add(index));
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={analyze}
        className="h-8 text-xs gap-1.5"
        title="AI Resume Optimizer"
      >
        <LucideSparkles size={14} className="text-primary" />
        <span className="hidden lg:inline">AI Optimize</span>
        <span className="lg:hidden">Optimize</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md flex flex-col gap-0 p-0"
        >
          <SheetHeader className="px-5 py-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <LucideSparkles className="size-4 text-primary" />
              AI Resume Optimizer
              {generating && (
                <LucideLoader2 className="size-3.5 animate-spin text-primary ml-1" />
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
            {/* Full skeleton — generating with no data yet */}
            {generating && !data?.overallFeedback && (
              <div className="flex flex-col gap-3 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <div className="h-px bg-border my-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            )}

            {/* Error */}
            {error && !generating && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Progressively revealed results */}
            {data && (
              <>
                {/* Overall Feedback */}
                {data.overallFeedback && (
                  <div className="rounded-xl bg-muted/50 border border-border/60 p-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                      Overall Feedback
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {data.overallFeedback}
                    </p>
                  </div>
                )}

                {/* Summary suggestion */}
                {data.suggestedSummary && (
                  <div className="flex flex-col gap-2 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Improved Summary
                      </p>
                      {appliedSummary ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <LucideCheckCircle2 className="size-3" /> Applied
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[11px] px-2"
                          onClick={handleApplySummary}
                          disabled={generating}
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 rounded-lg p-3 border border-border/40">
                      {data.suggestedSummary}
                    </p>
                  </div>
                )}

                {/* Skills suggestions */}
                {data.suggestedSkills.length > 0 && (
                  <div className="flex flex-col gap-2 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Suggested Skills to Add
                      </p>
                      {appliedSkills ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <LucideCheckCircle2 className="size-3" /> Applied
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[11px] px-2"
                          onClick={handleApplySkills}
                          disabled={generating}
                        >
                          Add All
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {data.suggestedSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs gap-1 animate-in zoom-in-75 duration-150"
                        >
                          <LucidePlus className="size-2.5" />
                          {skill}
                        </Badge>
                      ))}
                      {/* Pulsing placeholder while generating skills */}
                      {generating && data.suggestedSkills.length < 6 && (
                        <Skeleton className="h-5 w-20 rounded-full" />
                      )}
                    </div>
                  </div>
                )}

                {/* Experience suggestions */}
                {data.experienceSuggestions.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Experience Improvements
                    </p>
                    {data.experienceSuggestions.map((s) => (
                      <div
                        key={s.index}
                        className="flex flex-col gap-2 rounded-xl border border-border/60 p-3 bg-muted/20 animate-in fade-in-0 slide-in-from-bottom-1 duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-foreground">
                            Position #{s.index + 1}
                          </p>
                          {appliedExp.has(s.index) ? (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <LucideCheckCircle2 className="size-3" /> Applied
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-[11px] px-2"
                              onClick={() => handleApplyExperience(s.index)}
                              disabled={generating}
                            >
                              Apply
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {s.improvedDescription}
                        </p>
                        {s.improvedAchievements.length > 0 && (
                          <ul className="flex flex-col gap-1 mt-1">
                            {s.improvedAchievements.map((a, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-1.5 text-xs text-muted-foreground"
                              >
                                <LucideCheckCircle2 className="size-3 mt-0.5 shrink-0 text-primary/60" />
                                {a}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}

                    {/* Skeleton for next EXP block while still streaming */}
                    {generating && (
                      <div className="flex flex-col gap-2 rounded-xl border border-border/60 p-3 bg-muted/20">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {data && !generating && (
            <div className="px-5 py-3 border-t bg-background">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs gap-1.5"
                onClick={handleReanalyze}
              >
                <LucideSparkles className="size-3.5" />
                Re-analyze
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default AiResumeOptimizerDrawer;
