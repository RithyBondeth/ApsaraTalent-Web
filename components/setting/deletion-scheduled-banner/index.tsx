"use client";

import { Button } from "@/components/ui/button";
import { LucideAlertTriangle } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { IDeletionScheduledBannerProps } from "./props";

/** Days between the user's deletion request and the hard-delete cron. */
const GRACE_PERIOD_DAYS = 30;

/**
 * The banner an account owner sees on their settings page after they have
 * requested deletion. It is the surface that hosts the undo — a cancel
 * button that clears the request and returns the account to normal. Without
 * this the deletion would be a one-way door for anyone who closed the
 * confirmation dialog and never came back.
 *
 * Rendered only on the settings page. The dashboard/app doesn't reroute a
 * pending-deletion user — that is a bigger UX decision — so the banner is
 * scoped to where the "cancel" action naturally lives.
 */
export function DeletionScheduledBanner(props: IDeletionScheduledBannerProps) {
  /* --------------------------------- Props --------------------------------- */
  const { requestedAt, processing, onCancel } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("setting");
  const format = useFormatter();

  const scheduledFor = new Date(
    new Date(requestedAt).getTime() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000,
  );
  const scheduledForText = format.dateTime(scheduledFor, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section
      role="alert"
      className="flex flex-col gap-3 border border-destructive-border bg-destructive-subtle p-4 shadow-hard sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="flex items-start gap-3">
        <LucideAlertTriangle
          aria-hidden
          className="mt-0.5 size-5 shrink-0 text-destructive-accent"
        />
        <div>
          <p className="text-sm font-bold text-destructive-accent">
            {t("deletionScheduledTitle")}
          </p>
          <p className="mt-1 text-xs leading-5 text-destructive-accent/90">
            {t("deletionScheduledBody", { date: scheduledForText })}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onCancel}
        disabled={processing}
        className="w-fit"
      >
        {processing ? t("deletionCancelProcessing") : t("deletionCancelAction")}
      </Button>
    </section>
  );
}
