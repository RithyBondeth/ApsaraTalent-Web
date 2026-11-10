"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TApplicationStatus } from "@/utils/types/application/application-status.type";
import { LucideChevronDown, LucideLoader2, LucideX } from "lucide-react";
import { useTranslations } from "next-intl";
import { IBulkActionToolbarProps } from "./props";

/*
  Stages a bulk move can target. REJECTED is deliberately absent — it has its
  own button so the reason prompt still runs, and the API drops any bulk row
  whose current stage does not allow the target rather than failing the batch,
  so a "Move to interviewing" applied over a mix of PENDING and OFFERED just
  moves the ones it can.
*/
const BULK_TARGETS: TApplicationStatus[] = [
  "shortlisted",
  "interviewing",
  "offered",
  "hired",
];

export function BulkActionToolbar({
  selectedCount,
  isBusy,
  onClear,
  onMove,
  onRejectSelection,
}: IBulkActionToolbarProps) {
  const t = useTranslations("application");

  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-16 z-40 flex flex-wrap items-center justify-between gap-2 border border-primary bg-card px-3 py-2 shadow-hard-primary-xs">
      <div className="flex items-center gap-3">
        <span className="text-sm font-black tracking-[-0.01em] text-foreground">
          {t("bulk.selectionCount", { count: selectedCount })}
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          onClick={onClear}
        >
          <LucideX className="size-3" />
          {t("bulk.clear")}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-none"
              disabled={isBusy}
            >
              {isBusy ? (
                <LucideLoader2 className="size-3.5 animate-spin" />
              ) : null}
              {t("bulk.moveTo")}
              <LucideChevronDown className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {BULK_TARGETS.map((stage) => (
              <DropdownMenuItem
                key={stage}
                onSelect={() => onMove(stage)}
                className="rounded-none"
              >
                {t(`status.${stage}`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-none border-destructive/60 text-destructive hover:bg-destructive/10"
          disabled={isBusy}
          onClick={onRejectSelection}
        >
          <LucideX className="size-3.5" />
          {t("bulk.rejectSelection")}
        </Button>
      </div>
    </div>
  );
}
