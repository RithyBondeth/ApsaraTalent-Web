"use client";

import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideBell,
  LucideBriefcase,
  LucideCalendarCheck,
  LucideMessageSquare,
  LucideSparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { SettingWrapper } from "../setting-wrapper";
import { INotificationSectionProps } from "./props";
import {
  NOTIFICATION_PREFERENCE_CATEGORIES,
  TNotificationPreferenceCategory,
} from "@/utils/types/notification/preference.type";

const CATEGORY_ICONS: Record<TNotificationPreferenceCategory, React.ReactNode> =
  {
    application: <LucideBriefcase />,
    interview: <LucideCalendarCheck />,
    match: <LucideSparkles />,
    message: <LucideMessageSquare />,
  };

export function NotificationSection(props: INotificationSectionProps) {
  /* --------------------------------- Props --------------------------------- */
  const { preferences, loading, saving, onChange } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("setting");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <SettingWrapper
      icon={<LucideBell />}
      title={t("notifications")}
      description={t("notificationsDescription")}
    >
      {loading || !preferences ? (
        <div className="flex flex-col gap-4 p-4">
          {[0, 1, 2, 3].map((row) => (
            <Skeleton key={row} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Master Switches Section */}
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-sm font-medium">
                  {t("emailNotifications")}
                </span>
                <TypographyMuted className="text-xs leading-5">
                  {t("emailNotificationsDescription")}
                </TypographyMuted>
              </div>
              <Switch
                checked={preferences.emailEnabled}
                disabled={saving}
                aria-label={t("emailNotifications")}
                onCheckedChange={(checked) =>
                  onChange({ emailEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-sm font-medium">
                  {t("pushNotifications")}
                </span>
                <TypographyMuted className="text-xs leading-5">
                  {t("pushNotificationsDescription")}
                </TypographyMuted>
              </div>
              <Switch
                checked={preferences.pushEnabled}
                disabled={saving}
                aria-label={t("pushNotifications")}
                onCheckedChange={(checked) =>
                  onChange({ pushEnabled: checked })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Per-Category Section */}
          <div className="flex flex-col">
            {/* Column headers, so two unlabelled switches per row are not a
                guess. Hidden from screen readers because each switch already
                carries its own full label. */}
            <div
              aria-hidden
              className="flex items-center justify-end gap-6 px-4 pt-4 text-xs text-muted-foreground sm:px-5"
            >
              <span className="w-10 text-center">{t("channelEmail")}</span>
              <span className="w-10 text-center">{t("channelPush")}</span>
            </div>

            {NOTIFICATION_PREFERENCE_CATEGORIES.map((category, index) => {
              const channels = preferences.categories[category];
              const isLast =
                index === NOTIFICATION_PREFERENCE_CATEGORIES.length - 1;

              return (
                <React.Fragment key={category}>
                  <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center bg-muted text-foreground [&>svg]:size-4">
                        {CATEGORY_ICONS[category]}
                      </span>
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {t(`category_${category}`)}
                        </span>
                        <TypographyMuted className="text-xs leading-5">
                          {t(`category_${category}_description`)}
                        </TypographyMuted>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-6">
                      <div className="flex w-10 justify-center">
                        <Switch
                          checked={
                            preferences.emailEnabled && channels?.email === true
                          }
                          // The master switch is the stated reason a row is
                          // off. Leaving these live would let someone toggle a
                          // category that still sends nothing.
                          disabled={saving || !preferences.emailEnabled}
                          aria-label={t("categoryChannelLabel", {
                            category: t(`category_${category}`),
                            channel: t("channelEmail"),
                          })}
                          onCheckedChange={(checked) =>
                            onChange({
                              categories: { [category]: { email: checked } },
                            })
                          }
                        />
                      </div>
                      <div className="flex w-10 justify-center">
                        <Switch
                          checked={
                            preferences.pushEnabled && channels?.push === true
                          }
                          disabled={saving || !preferences.pushEnabled}
                          aria-label={t("categoryChannelLabel", {
                            category: t(`category_${category}`),
                            channel: t("channelPush"),
                          })}
                          onCheckedChange={(checked) =>
                            onChange({
                              categories: { [category]: { push: checked } },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {!isLast && <Separator />}
                </React.Fragment>
              );
            })}
          </div>

          <Separator />

          {/* Account Mail Notice Section */}
          <TypographyMuted className="px-4 py-4 text-xs leading-5 sm:px-5">
            {t("accountEmailNotice")}
          </TypographyMuted>
        </div>
      )}
    </SettingWrapper>
  );
}
