"use client";

import { Switch } from "@/components/ui/switch";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { cn } from "@/lib/utils";
import { useProfileAnalyticsStore } from "@/stores/apis/users/profile-analytics.store";
import { LucideEyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";
import { IPrivacySectionProps } from "./props";

/*
  The one privacy switch that pairs with the analytics widget above. Shares
  the same store — flipping the switch triggers a PATCH, and the returned
  value is folded back into `data.browsePrivately` so the widget's "browsing
  privately" chip updates without a re-fetch.
*/
export function PrivacySection({ className }: IPrivacySectionProps) {
  const t = useTranslations("privacy");

  const data = useProfileAnalyticsStore((s) => s.data);
  const loaded = useProfileAnalyticsStore((s) => s.loaded);
  const loading = useProfileAnalyticsStore((s) => s.loading);
  const savingPrivacy = useProfileAnalyticsStore((s) => s.savingPrivacy);
  const fetch = useProfileAnalyticsStore((s) => s.fetch);
  const updatePrivacy = useProfileAnalyticsStore((s) => s.updatePrivacy);

  useEffect(() => {
    if (!loaded && !loading) fetch();
  }, [loaded, loading, fetch]);

  const enabled = data?.browsePrivately ?? false;

  const handleToggle = async (next: boolean) => {
    const ok = await updatePrivacy({ browsePrivately: next });
    if (ok) toast.success(next ? t("nowPrivateToast") : t("nowVisibleToast"));
    else toast.error(useProfileAnalyticsStore.getState().error ?? "");
  };

  return (
    <section
      className={cn(
        "flex w-full flex-col gap-4 border border-border bg-card p-4 shadow-hard sm:p-5",
        className,
      )}
    >
      <header>
        <h2 className="text-lg font-black tracking-[-0.02em]">
          {t("sectionTitle")}
        </h2>
        <TypographyMuted className="mt-0.5 text-xs">
          {t("sectionDescription")}
        </TypographyMuted>
      </header>

      <div className="flex items-start justify-between gap-3 border border-border bg-background p-3 shadow-hard-xs">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <LucideEyeOff className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-sm font-black tracking-[-0.01em]">
              {t("browsePrivatelyLabel")}
            </p>
            <TypographyMuted className="mt-1 text-xs">
              {t("browsePrivatelyHint")}
            </TypographyMuted>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={handleToggle}
          disabled={savingPrivacy || !loaded}
          aria-label={t("browsePrivatelyLabel")}
        />
      </div>
    </section>
  );
}
