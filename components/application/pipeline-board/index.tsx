"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/utils/functions/date";
import { getScoreTone } from "@/utils/functions/ui";
import {
  APPLICATION_STATUS_TRANSITIONS,
  TApplicationStatus,
} from "@/utils/types/application/application-status.type";
import {
  LucideArrowRight,
  LucideLoader2,
  LucideMessageSquare,
  LucideX,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { IPipelineBoardProps } from "./props";

/*
  The board is deliberately click-and-move rather than drag-and-drop: adding a
  DnD library for one page has a real bundle and accessibility cost, and the
  per-card "advance" button already offers the one legal next stage at every
  step. Multi-move lives in the bulk toolbar above.

  Columns match `PIPELINE_COLUMN_ORDER` on the server so an add-a-column change
  is one place, not two. Terminal buckets (HIRED, REJECTED, WITHDRAWN) are not
  on the board — those live on the analytics dashboard, not the recruiter's
  daily view.
*/
const COLUMNS: TApplicationStatus[] = [
  "pending",
  "shortlisted",
  "interviewing",
  "offered",
];

export function PipelineBoard({
  applications,
  selectedIds,
  updatingId,
  onToggleSelect,
  onAdvance,
  onReject,
  onOpenActivity,
}: IPipelineBoardProps) {
  const t = useTranslations("application");

  const byColumn = useMemo(() => {
    const map = new Map<TApplicationStatus, typeof applications>();
    for (const status of COLUMNS) map.set(status, []);
    for (const app of applications) {
      const bucket = map.get(app.status);
      if (bucket) bucket.push(app);
    }
    return map;
  }, [applications]);

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((status) => {
        const rows = byColumn.get(status) ?? [];
        const nextStage = APPLICATION_STATUS_TRANSITIONS[status].filter(
          (s) => s !== "rejected",
        )[0];
        const canReject =
          APPLICATION_STATUS_TRANSITIONS[status].includes("rejected");

        return (
          <section
            key={status}
            className="flex flex-col gap-2 border border-border bg-muted/40 p-3 shadow-hard-xs"
          >
            <header className="flex items-center justify-between gap-2 pb-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.14em] text-foreground">
                  {t(`status.${status}`)}
                </h3>
                <TypographyMuted className="text-[11px] tabular-nums">
                  {t("pipeline.columnCount", { count: rows.length })}
                </TypographyMuted>
              </div>
            </header>

            {rows.length === 0 ? (
              <TypographyMuted className="border border-dashed border-border/60 p-3 text-xs">
                {t("pipeline.emptyColumn")}
              </TypographyMuted>
            ) : (
              <ul className="flex flex-col gap-2">
                {rows.map((application) => {
                  const isSelected = selectedIds.has(application.id);
                  const isUpdating = updatingId === application.id;
                  const score = application.matchScore;
                  const tone =
                    typeof score === "number" ? getScoreTone(score) : null;

                  return (
                    <li
                      key={application.id}
                      className={cn(
                        "border bg-card p-3 shadow-hard-xs transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-foreground/35",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => onToggleSelect(application.id)}
                          aria-label={t("pipeline.select", {
                            name:
                              application.employeeName ?? t("unnamedApplicant"),
                          })}
                          className="mt-1"
                        />

                        {/*
                          Score chip mirrors the list view so a candidate's fit
                          reads the same wherever the recruiter meets them.
                        */}
                        <div
                          className={cn(
                            "grid size-9 shrink-0 place-items-center border text-xs font-black tabular-nums",
                            tone ? tone.border : "border-border",
                            tone ? tone.text : "text-muted-foreground",
                          )}
                          aria-label={
                            typeof score === "number"
                              ? t("fitScoreLabel", { score })
                              : t("fitScoreUnknown")
                          }
                        >
                          {typeof score === "number" ? score : "—"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-black leading-tight tracking-[-0.01em]">
                            {application.employeeName ?? t("unnamedApplicant")}
                          </h4>
                          <TypographyMuted className="mt-0.5 text-[11px]">
                            {t("appliedOn", {
                              date: formatShortDate(application.appliedAt),
                            })}
                          </TypographyMuted>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-7 rounded-none px-2 text-xs"
                          onClick={() => onOpenActivity(application)}
                        >
                          <LucideMessageSquare className="size-3" />
                          {t("pipeline.activity")}
                        </Button>
                        {canReject && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 rounded-none px-2 text-xs"
                            disabled={isUpdating}
                            onClick={() => onReject(application)}
                          >
                            <LucideX className="size-3" />
                            {t("reject")}
                          </Button>
                        )}
                        {nextStage && (
                          <Button
                            type="button"
                            size="sm"
                            className="h-7 rounded-none px-2 text-xs"
                            disabled={isUpdating}
                            onClick={() => onAdvance(application.id, nextStage)}
                          >
                            {isUpdating ? (
                              <LucideLoader2 className="size-3 animate-spin" />
                            ) : (
                              <LucideArrowRight className="size-3" />
                            )}
                            {t(`advanceTo.${nextStage}`)}
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
