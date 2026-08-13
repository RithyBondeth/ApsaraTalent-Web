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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup } from "@/components/ui/radio-group";
import RadioGroupItemWithLabel from "@/components/ui/radio-group-item";
import { Textarea } from "@/components/ui/textarea";
import { useModerationStore } from "@/stores/apis/moderation/moderation.store";
import { TReportReason } from "@/utils/types/moderation/report.type";
import { Ban, Flag, MoreVertical, ShieldOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IUserModerationMenuProps } from "./props";
import { REPORT_REASONS } from "@/utils/constants/moderation.constant";
import { cn } from "@/lib/utils";

export default function UserModerationMenu(props: IUserModerationMenuProps) {
  /* --------------------------------- Props --------------------------------- */
  const {
    targetId,
    targetName,
    align = "end",
    triggerClassName = "h-8 w-8 sm:h-9 sm:w-9",
    variant = "default",
  } = props;

  /* --------------------------------- Utils --------------------------------- */
  const t = useTranslations("moderation");
  const router = useRouter();
  const isEditorial = variant === "editorial";

  /* ------------------------------- All States ------------------------------ */
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const [reason, setReason] = useState<TReportReason>("spam");
  const [details, setDetails] = useState<string>("");

  /* ---------------------------- API Integration ---------------------------- */
  const {
    blocking,
    reporting,
    getBlockStatus,
    blockUser,
    unblockUser,
    reportUser,
  } = useModerationStore();
  // Read this target's status only — keyed so other profiles can't leak state.
  const status = useModerationStore((s) => s.statusByTarget[targetId]);

  /* -------------------------------- Effects -------------------------------- */
  useEffect(() => {
    if (targetId) getBlockStatus(targetId);
  }, [targetId, getBlockStatus]);

  /* ------------------------------- Computed -------------------------------- */
  const blockedByMe = status?.blockedByMe ?? false;

  /* -------------------------------- Methods -------------------------------- */
  // ── Handle block toggle ──────────────
  const handleBlockToggle = async (): Promise<void> => {
    if (blockedByMe) {
      const toastId = toast.loading(t("unblocking", { name: targetName }));
      const ok = await unblockUser(targetId);
      if (ok) {
        toast.success(t("userUnblocked", { name: targetName }), {
          id: toastId,
        });
      } else {
        toast.error(t("actionFailed"), { id: toastId });
      }
    } else {
      const toastId = toast.loading(t("blocking", { name: targetName }));
      const ok = await blockUser(targetId);
      if (ok) {
        toast.success(t("userBlocked", { name: targetName }), { id: toastId });
        router.push("/feed");
      } else {
        toast.error(t("actionFailed"), { id: toastId });
      }
    }
  };

  // ── Handle submit report ──────────────
  const handleSubmitReport = async (): Promise<void> => {
    const ok = await reportUser({
      reportedId: targetId,
      reason,
      details: details.trim() || undefined,
    });
    if (ok) {
      toast.success(t("reportSubmitted"));
      setReportOpen(false);
      setDetails("");
      setReason("spam");
    } else {
      toast.error(t("actionFailed"));
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <>
      {/* Dropdown Menu Section */}
      <DropdownMenu>
        {/* Dropdown Menu Trigger Section */}
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(isEditorial && "rounded-none", triggerClassName)}
            aria-label={t("moreOptions")}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        {/* Dropdown Menu Content Section */}
        <DropdownMenuContent
          align={align}
          className={cn(
            "w-44",
            isEditorial &&
              "rounded-none border-border bg-popover p-0 shadow-[6px_6px_0_hsl(var(--foreground)/0.09)]",
          )}
        >
          <DropdownMenuItem
            onClick={handleBlockToggle}
            disabled={blocking}
            className={cn(
              "gap-2",
              isEditorial &&
                "min-h-11 rounded-none px-3 py-2.5 font-medium focus:bg-muted",
            )}
          >
            {blockedByMe ? (
              <>
                <ShieldOff className="h-4 w-4" />
                {t("unblock")}
              </>
            ) : (
              <>
                <Ban className="h-4 w-4" />
                {t("block")}
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator
            className={cn(isEditorial && "m-0 bg-border")}
          />

          {/* Report Section */}
          <DropdownMenuItem
            onClick={() => setReportOpen(true)}
            className={cn(
              "gap-2 text-destructive focus:text-destructive",
              isEditorial &&
                "min-h-11 rounded-none px-3 py-2.5 font-medium focus:bg-destructive/10",
            )}
          >
            <Flag className="h-4 w-4" />
            {t("report")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Report Dialog Section */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        {/* Report Dialog Content Section */}
        <DialogContent
          className={cn(
            "sm:max-w-md",
            isEditorial &&
              "rounded-none border-border p-0 sm:rounded-none [&>button]:rounded-none",
          )}
        >
          {/* Report Dialog Header Section */}
          <DialogHeader
            className={cn(
              isEditorial && "border-b border-border px-5 pb-4 pt-5 pr-14",
            )}
          >
            <DialogTitle>
              {t("reportDialogTitle", { name: targetName })}
            </DialogTitle>
            <DialogDescription>
              {t("reportDialogDescription")}
            </DialogDescription>
          </DialogHeader>

          {/* Report Dialog Body Section: Reason and Details */}
          <div
            className={cn(
              "flex flex-col gap-4 py-2",
              isEditorial && "px-5 py-5",
            )}
          >
            <RadioGroup
              value={reason}
              onValueChange={(v) => setReason(v as TReportReason)}
              className="flex flex-col gap-2.5"
            >
              {REPORT_REASONS.map((r) => (
                <RadioGroupItemWithLabel
                  key={r.value}
                  value={r.value}
                  id={`report-${r.value}`}
                  htmlFor={`report-${r.value}`}
                  className={cn(
                    isEditorial &&
                      "min-h-11 border border-border px-3 py-2.5 [&>button]:rounded-none",
                  )}
                >
                  {t(r.labelKey)}
                </RadioGroupItemWithLabel>
              ))}
            </RadioGroup>

            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={t("reportDetailsPlaceholder")}
              maxLength={1000}
              className={cn(
                "min-h-24 resize-none",
                isEditorial && "rounded-none",
              )}
            />
          </div>

          {/* Report Dialog Footer Section: Cancel and Submit Buttons */}
          <DialogFooter
            className={cn(
              "gap-2 sm:gap-2",
              isEditorial &&
                "grid grid-cols-2 border-t border-border px-5 pb-5 pt-4 [&>button]:w-full [&>button]:rounded-none",
            )}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setReportOpen(false)}
              disabled={reporting}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleSubmitReport}
              disabled={reporting}
            >
              {reporting ? t("submittingReport") : t("submitReport")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
