"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoaderCircle, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ILogoutConfirmationDialogProps } from "./props";

export function LogoutConfirmationDialog(
  props: ILogoutConfirmationDialogProps,
) {
  /* ------------------------------ Props ------------------------------ */
  const {
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    cancelLabel,
    confirmLabel,
  } = props;

  /* ---------------------------- All States ---------------------------- */
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  /* ---------------------------- All Effects ---------------------------- */
  useEffect(() => {
    if (!open) setIsPending(false);
  }, [open]);

  /* ----------------------------- Methods ------------------------------ */
  // ── Handle OpenChange Function ────────────
  const handleOpenChange = (nextOpen: boolean) => {
    if (!isPending) onOpenChange(nextOpen);
  };

  // ── Handle Confirm Function ───────────────
  const handleConfirm = async () => {
    if (isPending) return;

    setIsPending(true);
    try {
      await onConfirm();
    } finally {
      setIsPending(false);
    }
  };

  /* --------------------------- Render UI ----------------------------- */
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="logout-dialog w-[calc(100%-1.5rem)] max-w-md rounded-none border border-foreground/20 bg-card p-0 shadow-[9px_9px_0_hsl(var(--foreground)/0.12),0_24px_70px_hsl(var(--foreground)/0.18)] sm:rounded-none"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          cancelButtonRef.current?.focus();
        }}
      >
        {/* Dialog Header Section */}
        <header className="logout-dialog-header relative overflow-hidden border-b border-foreground bg-foreground p-5 text-background sm:p-6">
          <div className="relative z-[2] flex items-start gap-4 pr-10">
            <div className="flex size-12 shrink-0 items-center justify-center border border-background/25 bg-background/10 sm:size-14">
              <LogOut className="size-5 sm:size-6" strokeWidth={1.6} />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="pixel-label mb-2 text-[9px] opacity-60">
                Apsara Talent
              </p>
              <DialogTitle className="text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl">
                {title}
              </DialogTitle>
            </div>
          </div>
        </header>

        <div className="p-5 sm:p-6">
          {/* Dialog Description Section */}
          <div className="flex items-start gap-3 border border-border bg-muted/45 p-4">
            <span className="mt-1 size-2 shrink-0 bg-destructive" aria-hidden />
            <DialogDescription className="text-sm leading-6 text-muted-foreground sm:text-[15px]">
              {description}
            </DialogDescription>
          </div>

          {/* Dialog Footer Section */}
          <DialogFooter className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-2 sm:space-x-0">
            <Button
              ref={cancelButtonRef}
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              className="h-11 w-full rounded-none"
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={handleConfirm}
              className="h-11 w-full rounded-none"
            >
              {isPending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              {confirmLabel}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
