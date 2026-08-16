"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TLoadingStep } from "@/utils/interfaces/ui/loading.interface";
import { Check, LoaderCircle } from "lucide-react";

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
        className="max-w-sm overflow-hidden [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Main Content Section */}
        <div className="relative z-10 flex w-full flex-col items-center justify-center gap-4 py-2">
          {/* Loading Spinner Section */}
          <div className="loading-dialog-spinner-wrap border border-primary/30 bg-primary/5 p-3 text-primary">
            <LoaderCircle className="size-10 animate-spin" />
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
              <TypographyMuted className="pixel-numeral text-center text-xs text-muted-foreground">
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
                        <Check className="size-3.5 shrink-0 text-success-accent" />
                      ) : active ? (
                        <LoaderCircle className="size-3.5 shrink-0 animate-spin text-primary" />
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
