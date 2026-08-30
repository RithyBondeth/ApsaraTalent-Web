"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { LucideCheckCircle2, LucideLoader2 } from "lucide-react";
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
        size="sm"
        hideClose
        className="bg-background/95 backdrop-blur-sm"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Background Orbs Section */}
        <div className="pointer-events-none absolute inset-0">
          <div className="loading-dialog-orb absolute -right-10 -top-16 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
          <div className="loading-dialog-orb absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
        </div>

        {/* Main Content Section */}
        <div className="relative z-10 flex w-full flex-col items-center justify-center gap-4 py-2">
          {/* Loading Spinner Section */}
          <div className="loading-dialog-spinner-wrap">
            <ApsaraLoadingSpinner size={64} loop />
          </div>

          {/* Title Section */}
          <DialogTitle className="text-center text-base">{title}</DialogTitle>

          {/* Progress Section */}
          {hasProgress ? (
            <div className="flex w-full flex-col gap-3">
              {/* Progress Bar Section */}
              <div className="h-1.5 w-full overflow-hidden bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-700 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Percentage Label Section */}
              <TypographyMuted className="text-center text-xs tabular-nums text-muted-foreground">
                {Math.round(progress)}%
              </TypographyMuted>

              {/* Step List Section */}
              <ul className="mt-1 flex w-full flex-col gap-2">
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
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {done ? (
                        <LucideCheckCircle2
                          size={14}
                          className="shrink-0 text-primary"
                        />
                      ) : active ? (
                        <LucideLoader2
                          size={14}
                          className="shrink-0 animate-spin text-primary"
                        />
                      ) : (
                        <span className="inline-block h-3.5 w-3.5 shrink-0 border border-muted-foreground/40" />
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
