"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMyApplicationsStore } from "@/stores/apis/job/my-applications.store";
import { LucideLoader2, LucideSend } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ApplicationStatusBadge } from "../application-status-badge";
import { IApplyJobDialogProps } from "./props";

const NOTE_MAX_LENGTH = 1000;

export function ApplyJobDialog({
  jobId,
  jobTitle,
  existingStatus,
  fullWidth,
}: IApplyJobDialogProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("application");

  /* -------------------------------- All States ------------------------------ */
  const [open, setOpen] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  /* ----------------------------- API Integration ---------------------------- */
  const { applyToJob, applying } = useMyApplicationsStore();

  /* --------------------------------- Methods -------------------------------- */
  const handleSubmit = useCallback(async () => {
    const created = await applyToJob({
      jobId,
      coverLetterNote: note.trim() || undefined,
    });

    if (created) {
      toast.success(t("applySuccess", { job: jobTitle }));
      setOpen(false);
      setNote("");
      return;
    }

    toast.error(useMyApplicationsStore.getState().error ?? t("applyError"));
  }, [applyToJob, jobId, jobTitle, note, t]);

  /*
    An application that is still open is not something to re-submit, so the
    button gives way to the stage it has reached. A withdrawn or rejected one
    leaves the button in place — the API revives a withdrawn row rather than
    refusing it, so re-applying is a real action rather than a dead end.
  */
  const isOpenApplication =
    existingStatus !== undefined &&
    existingStatus !== "withdrawn" &&
    existingStatus !== "rejected";

  /* -------------------------------- Render UI -------------------------------- */
  if (isOpenApplication)
    return (
      <div className={cn("flex items-center gap-2", fullWidth && "w-full")}>
        <span className="text-xs font-medium text-muted-foreground">
          {t("alreadyApplied")}
        </span>
        <ApplicationStatusBadge status={existingStatus} />
      </div>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={cn("rounded-none", fullWidth && "w-full")}>
          <LucideSend className="size-3.5" />
          {existingStatus ? t("applyAgain") : t("apply")}
        </Button>
      </DialogTrigger>

      <DialogContent variant="default" size="md">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-bold leading-tight tracking-tight">
            {t("applyDialogTitle")}
          </DialogTitle>
          <DialogDescription className="leading-6">
            {t("applyDialogDescription", { job: jobTitle })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label
            htmlFor="cover-letter-note"
            className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {t("coverLetterNote")}
          </label>
          <Textarea
            id="cover-letter-note"
            value={note}
            maxLength={NOTE_MAX_LENGTH}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t("coverLetterNotePlaceholder")}
            className="min-h-32 rounded-none"
          />
          <p className="text-right text-xs text-muted-foreground">
            {t("charactersLeft", { count: NOTE_MAX_LENGTH - note.length })}
          </p>
        </div>

        <DialogFooter className="gap-2 sm:space-x-0">
          <Button
            variant="outline"
            type="button"
            className="min-w-24 rounded-none"
            onClick={() => setOpen(false)}
            disabled={applying}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            className="min-w-24 rounded-none"
            onClick={handleSubmit}
            disabled={applying}
          >
            {applying ? (
              <LucideLoader2 className="size-4 animate-spin" />
            ) : (
              <LucideSend className="size-4" />
            )}
            {t("submitApplication")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
