"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Loader2 } from "lucide-react";
import ApsaraLoadingSpinner from "../apsara-loading-spinner";
import { TypographyMuted } from "../typography/typography-muted";

export type LoadingStep = {
  label: string;
  /** 0–100 progress value at which this step becomes "done" */
  completeAt: number;
};

type Props = {
  loading: boolean;
  title: string;
  subTitle?: string;
  /** When provided, renders the step-progress UI instead of the plain spinner */
  steps?: LoadingStep[];
  /** 0–100 */
  progress?: number;
};

export default function LoadingDialog(props: Props) {
  const { loading, title, subTitle, steps, progress = 0 } = props;
  const hasProgress = steps && steps.length > 0;

  return (
    <Dialog open={loading}>
      <DialogContent className="max-w-sm" onPointerDownOutside={(e) => e.preventDefault()}>
        <div className="w-full flex flex-col items-center justify-center gap-4 py-2">
          <ApsaraLoadingSpinner size={64} loop />

          <DialogTitle className="text-center text-base">{title}</DialogTitle>

          {hasProgress ? (
            <div className="w-full flex flex-col gap-3">
              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Percentage label */}
              <p className="text-xs text-muted-foreground text-center tabular-nums">
                {Math.round(progress)}%
              </p>

              {/* Step list */}
              <ul className="w-full flex flex-col gap-2 mt-1">
                {steps.map((step, i) => {
                  const done = progress >= step.completeAt;
                  const active =
                    !done &&
                    (i === 0
                      ? progress > 0
                      : progress >= steps[i - 1].completeAt);

                  return (
                    <li
                      key={i}
                      className={`flex items-center gap-2.5 text-xs transition-colors duration-300 ${
                        done
                          ? "text-primary"
                          : active
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 size={14} className="shrink-0 text-primary" />
                      ) : active ? (
                        <Loader2 size={14} className="shrink-0 animate-spin text-primary" />
                      ) : (
                        <span className="w-3.5 h-3.5 shrink-0 rounded-full border border-muted-foreground/40 inline-block" />
                      )}
                      {step.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            subTitle && (
              <TypographyMuted className="text-center text-xs">{subTitle}</TypographyMuted>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
