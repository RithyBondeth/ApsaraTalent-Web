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
import { TLoadingStep } from "@/utils/interfaces/ui/loading.interface";

/* --------------------------------- Helper --------------------------------- */
interface ILoadingDialogProps {
  loading: boolean;
  title: string;
  subTitle?: string;
  steps?: TLoadingStep[];
  progress?: number;
}

export default function LoadingDialog(props: ILoadingDialogProps) {
  /* --------------------------------- Props --------------------------------- */
  const { loading, title, subTitle, steps, progress = 0 } = props;
  /* ---------------------------------- Utils -------------------------------- */
  const hasProgress = steps && steps.length > 0;

  /* -------------------------------- Render UI ------------------------------ */
  return (
    <Dialog open={loading}>
      <DialogContent
        className="max-w-sm overflow-hidden border-border/60 bg-background/95 backdrop-blur-sm shadow-2xl [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Background Orbs Section */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="loading-dialog-orb absolute -top-16 -right-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
          <div className="loading-dialog-orb absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
        </div>

        {/* Main Content Section */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center gap-4 py-2">
          {/* Loading Spinner Section */}
          <div className="loading-dialog-spinner-wrap">
            <ApsaraLoadingSpinner size={64} loop />
          </div>

          {/* Title Section */}
          <DialogTitle className="text-center text-base">{title}</DialogTitle>

          {/* Progress Section */}
          {hasProgress ? (
            <div className="w-full flex flex-col gap-3">
              {/* Progress Bar Section */}
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Percentage Label Section */}
              <TypographyMuted className="text-xs text-muted-foreground text-center tabular-nums">
                {Math.round(progress)}%
              </TypographyMuted>

              {/* Step List Section */}
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
            /* Subtitle Section */
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
