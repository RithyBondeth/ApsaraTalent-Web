"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSavedSearchesStore } from "@/stores/apis/job/saved-searches.store";
import { TSavedSearchFrequency } from "@/utils/interfaces/saved-search/saved-search.interface";
import { LucideBellRing, LucideLoader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ISaveSearchDialogProps } from "./props";

// Server DTO caps the name; kept here so the input's maxLength matches.
const NAME_MAX = 120;

export function SaveSearchDialog({
  open,
  buildFilters,
  suggestedName,
  defaultFrequency = "daily",
  onClose,
  onSaved,
}: ISaveSearchDialogProps) {
  const t = useTranslations("savedSearch");
  const [name, setName] = useState("");
  const [frequency, setFrequency] =
    useState<TSavedSearchFrequency>(defaultFrequency);

  const saving = useSavedSearchesStore((s) => s.saving);
  const create = useSavedSearchesStore((s) => s.create);

  // Reset the form when the dialog opens so a previous draft never leaks in.
  useEffect(() => {
    if (open) {
      setName((suggestedName ?? "").slice(0, NAME_MAX));
      setFrequency(defaultFrequency);
    }
  }, [open, suggestedName, defaultFrequency]);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const created = await create({
      name: trimmed,
      filters: buildFilters(),
      frequency,
    });
    if (created) {
      toast.success(t("saveSuccess", { name: created.name }));
      onSaved?.();
      onClose();
    } else {
      toast.error(useSavedSearchesStore.getState().error ?? "");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent variant="default" size="sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LucideBellRing className="size-4" />
            {t("dialogTitle")}
          </DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="saved-search-name">{t("nameLabel")}</Label>
            <Input
              id="saved-search-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={NAME_MAX}
              placeholder={t("namePlaceholder")}
              className="rounded-none"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="saved-search-frequency">
              {t("frequencyLabel")}
            </Label>
            <Select
              value={frequency}
              onValueChange={(value) =>
                setFrequency(value as TSavedSearchFrequency)
              }
            >
              <SelectTrigger
                id="saved-search-frequency"
                className="rounded-none"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{t("frequency.daily")}</SelectItem>
                <SelectItem value="weekly">{t("frequency.weekly")}</SelectItem>
                <SelectItem value="off">{t("frequency.off")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={onClose}
            disabled={saving}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            className="rounded-none"
            disabled={saving || name.trim().length === 0}
            onClick={handleSubmit}
          >
            {saving ? (
              <LucideLoader2 className="size-3.5 animate-spin" />
            ) : null}
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
