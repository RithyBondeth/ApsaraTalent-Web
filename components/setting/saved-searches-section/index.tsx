"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { cn } from "@/lib/utils";
import { useSavedSearchesStore } from "@/stores/apis/job/saved-searches.store";
import { formatShortDate } from "@/utils/functions/date";
import {
  ISavedSearch,
  TSavedSearchFrequency,
} from "@/utils/interfaces/saved-search/saved-search.interface";
import {
  LucideBellRing,
  LucideBellOff,
  LucideLoader2,
  LucideTrash2,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";
import { ISavedSearchesSectionProps } from "./props";

export function SavedSearchesSection({
  className,
}: ISavedSearchesSectionProps) {
  const t = useTranslations("savedSearch");

  const items = useSavedSearchesStore((s) => s.items);
  const previews = useSavedSearchesStore((s) => s.previews);
  const previewErrors = useSavedSearchesStore((s) => s.previewErrors);
  const fetchPreview = useSavedSearchesStore((s) => s.fetchPreview);
  const loading = useSavedSearchesStore((s) => s.loading);
  const loaded = useSavedSearchesStore((s) => s.loaded);
  const updatingId = useSavedSearchesStore((s) => s.updatingId);
  const deletingId = useSavedSearchesStore((s) => s.deletingId);
  const fetchAll = useSavedSearchesStore((s) => s.fetchAll);
  const update = useSavedSearchesStore((s) => s.update);
  const remove = useSavedSearchesStore((s) => s.remove);

  useEffect(() => {
    if (!loaded && !loading) fetchAll();
  }, [loaded, loading, fetchAll]);

  const handleFrequency = async (
    row: ISavedSearch,
    frequency: TSavedSearchFrequency,
  ) => {
    if (frequency === row.frequency) return;
    const ok = await update(row.id, { frequency });
    if (ok) {
      toast.success(
        frequency === "off"
          ? t("pausedToast", { name: row.name })
          : t("frequencyChangedToast", {
              name: row.name,
              cadence: t(`frequency.${frequency}`),
            }),
      );
    } else {
      toast.error(useSavedSearchesStore.getState().error ?? "");
    }
  };

  const handleDelete = async (row: ISavedSearch) => {
    const ok = await remove(row.id);
    if (ok) toast.success(t("deletedToast", { name: row.name }));
    else toast.error(useSavedSearchesStore.getState().error ?? "");
  };

  return (
    <section className={cn("flex w-full flex-col gap-4", className)}>
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-[-0.02em]">
            {t("sectionTitle")}
          </h2>
          <TypographyMuted className="text-xs">
            {t("sectionDescription")}
          </TypographyMuted>
        </div>
      </header>

      {loading && items.length === 0 ? (
        <TypographyMuted className="text-sm">…</TypographyMuted>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-border p-4">
          <TypographyMuted className="text-sm">
            {t("emptyDescription")}
          </TypographyMuted>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mt-3 rounded-none"
          >
            <Link href="/search/employee">{t("emptyCta")}</Link>
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((row) => {
            const paused = row.frequency === "off";
            const isDeleting = deletingId === row.id;
            const isUpdating = updatingId === row.id;

            return (
              <li
                key={row.id}
                className="flex flex-col gap-3 border border-border bg-card p-4 shadow-hard-xs sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {paused ? (
                      <LucideBellOff className="size-3.5 text-muted-foreground" />
                    ) : (
                      <LucideBellRing className="size-3.5 text-primary" />
                    )}
                    <h3 className="truncate text-sm font-black tracking-[-0.01em]">
                      {row.name}
                    </h3>
                  </div>
                  <TypographyMuted className="mt-1 text-xs">
                    {row.lastNotifiedAt
                      ? t("lastSent", {
                          date: formatShortDate(row.lastNotifiedAt),
                        })
                      : t("notYetSent")}
                  </TypographyMuted>
                  {previewErrors[row.id] ? (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => fetchPreview(row.id)}
                    >
                      {t("previewRetry")}
                    </Button>
                  ) : (
                    <TypographyMuted
                      className="mt-1 text-xs"
                      aria-live="polite"
                    >
                      {previews[row.id]
                        ? t("previewCounts", {
                            total: previews[row.id].totalMatches,
                            newCount: previews[row.id].newMatchCount,
                          })
                        : t("previewLoading")}
                    </TypographyMuted>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={row.frequency}
                    onValueChange={(value) =>
                      handleFrequency(row, value as TSavedSearchFrequency)
                    }
                  >
                    <SelectTrigger
                      className="h-9 w-auto min-w-[8rem] rounded-none"
                      disabled={isUpdating}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">
                        {t("frequency.daily")}
                      </SelectItem>
                      <SelectItem value="weekly">
                        {t("frequency.weekly")}
                      </SelectItem>
                      <SelectItem value="off">{t("frequency.off")}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-none border-destructive/60 text-destructive hover:bg-destructive/10"
                    disabled={isDeleting}
                    onClick={() => handleDelete(row)}
                  >
                    {isDeleting ? (
                      <LucideLoader2 className="size-3.5 animate-spin" />
                    ) : (
                      <LucideTrash2 className="size-3.5" />
                    )}
                    {t("delete")}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
