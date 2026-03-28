"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Loader2 } from "lucide-react";
import ApsaraLoadingSpinner from "@/components/utils/feedback/apsara-loading-spinner";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

export type TLoadingStep = {
  label: string;
  /** 0–100 progress value at which this step becomes "done" */
  completeAt: number;
};

type Props = {
  loading: boolean;
  title: string;
  subTitle?: string;
  /** When provided, renders the step-progress UI instead of the plain spinner */
  steps?: TLoadingStep[];
  /** 0–100 */
  progress?: number;
};

export default function LoadingDialog(props: Props) {
  const { loading, title, subTitle, steps, progress = 0 } = props;
  const hasProgress = steps && steps.length > 0;

  return (
    <Dialog open={loading}>
      <DialogContent
        className="max-w-sm overflow-hidden border-border/60 bg-background/95 backdrop-blur-sm shadow-2xl [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="loading-dialog-orb absolute -top-16 -right-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
          <div className="loading-dialog-orb absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center justify-center gap-4 py-2">
          <div className="loading-dialog-spinner-wrap">
            <ApsaraLoadingSpinner size={64} loop />
          </div>

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
                        <CheckCircle2
                          size={14}
                          className="shrink-0 text-primary"
                        />
                      ) : active ? (
                        <Loader2
                          size={14}
                          className="shrink-0 animate-spin text-primary"
                        />
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
            (subTitle || title) && (
              <DialogDescription asChild>
                <TypographyMuted className="text-center text-xs">
                  {subTitle ?? "Please wait while we process your request."}
                </TypographyMuted>
              </DialogDescription>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
