"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { API_ACCOUNT_EXPORT_URL } from "@/utils/constants/apis/user-api/user.api.constant";
import { LucideDownload, LucideShieldAlert, LucideTrash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { SettingWrapper } from "../setting-wrapper";
import { EWebAnalyticsEvent } from "@/lib/posthog/event";
import { useAnalytics } from "@/components/utils/analytics/use-analytics";
import { IDangerZoneSectionProps } from "./props";

/**
 * The "danger zone" — export everything about your account, or delete it.
 *
 * Sits at the bottom of the settings page on purpose: both actions are
 * terminal (or slow-terminal, for delete) and shouldn't share the visual
 * weight of preferences and switches above.
 *
 * Export is a plain anchor, not a fetch. That's what makes the browser save
 * the file into Downloads with the filename the server sets, rather than
 * opening it as a blob URL. `download` on the anchor is a hint, not a
 * command — the `Content-Disposition` header does the actual work.
 * `rel="noopener"` is superstition on a same-origin link but costs nothing.
 */
export function DangerZoneSection(props: IDangerZoneSectionProps) {
  /* --------------------------------- Props --------------------------------- */
  const { onRequestDeletion, processing } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("setting");
  const { capture } = useAnalytics();

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <SettingWrapper
      icon={<LucideShieldAlert />}
      title={t("dangerZone")}
      description={t("dangerZoneDescription")}
    >
      <div className="flex flex-col">
        {/* Export data Section */}
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
          <div className="min-w-0">
            <span className="text-sm font-medium">{t("exportData")}</span>
            <TypographyMuted className="text-xs leading-5">
              {t("exportDataDescription")}
            </TypographyMuted>
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit">
            <a
              href={API_ACCOUNT_EXPORT_URL}
              // Downloads inherit the axios `withCredentials: true` for
              // same-origin requests — the browser attaches the auth cookies
              // automatically. No need to route through JS.
              download
              rel="noopener"
              onClick={() => capture(EWebAnalyticsEvent.ACCOUNT_EXPORT_CLICKED)}
            >
              <LucideDownload aria-hidden />
              {t("exportDataAction")}
            </a>
          </Button>
        </div>

        <Separator />

        {/* Delete account Section */}
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
          <div className="min-w-0">
            <span className="text-sm font-medium text-destructive-accent">
              {t("deleteAccount")}
            </span>
            <TypographyMuted className="text-xs leading-5">
              {t("deleteAccountDescription")}
            </TypographyMuted>
          </div>
          <Button
            variant="destructive"
            size="sm"
            disabled={processing}
            onClick={() => {
              capture(EWebAnalyticsEvent.ACCOUNT_DELETE_DIALOG_OPENED);
              onRequestDeletion();
            }}
            className="w-fit"
          >
            <LucideTrash2 aria-hidden />
            {t("deleteAccountAction")}
          </Button>
        </div>
      </div>
    </SettingWrapper>
  );
}
