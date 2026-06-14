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
import { TBlockStatus } from "@/utils/types/moderation/block.type";
import { TReportReason } from "@/utils/types/moderation/report.type";
import { Ban, Flag, MoreVertical, ShieldOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IUserModerationMenuProps } from "./props";
import { REPORT_REASONS } from "@/utils/constants/moderation";

export default function UserModerationMenu(props: IUserModerationMenuProps) {
  /* --------------------------------- Props --------------------------------- */
  const {
    targetId,
    targetName,
    align = "end",
    triggerClassName = "h-8 w-8 sm:h-9 sm:w-9",
  } = props;

  /* --------------------------------- Utils --------------------------------- */
  const t = useTranslations("moderation");

  /* ------------------------------- All States ------------------------------ */
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const [reason, setReason] = useState<TReportReason>("spam");
  const [details, setDetails] = useState<string>("");

  /* ---------------------------- API Integration ---------------------------- */
  const {
    status,
    blocking,
    reporting,
    getBlockStatus,
    blockUser,
    unblockUser,
    reportUser,
  } = useModerationStore();

  /* -------------------------------- Effects -------------------------------- */
  useEffect(() => {
    if (targetId) getBlockStatus(targetId);
  }, [targetId, getBlockStatus]);

  /* ------------------------------- Computed -------------------------------- */
  const blockedByMe = (status as TBlockStatus | null)?.blockedByMe ?? false;

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
            className={triggerClassName}
            aria-label={t("moreOptions")}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        {/* Dropdown Menu Content Section */}
        <DropdownMenuContent align={align} className="w-44">
          <DropdownMenuItem
            onClick={handleBlockToggle}
            disabled={blocking}
            className="gap-2"
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
          <DropdownMenuSeparator />

          {/* Report Section */}
          <DropdownMenuItem
            onClick={() => setReportOpen(true)}
            className="gap-2 text-destructive focus:text-destructive"
          >
            <Flag className="h-4 w-4" />
            {t("report")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Report Dialog Section */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        {/* Report Dialog Content Section */}
        <DialogContent className="sm:max-w-md">
          {/* Report Dialog Header Section */}
          <DialogHeader>
            <DialogTitle>
              {t("reportDialogTitle", { name: targetName })}
            </DialogTitle>
            <DialogDescription>
              {t("reportDialogDescription")}
            </DialogDescription>
          </DialogHeader>

          {/* Report Dialog Body Section: Reason and Details */}
          <div className="flex flex-col gap-4 py-2">
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
              className="min-h-24 resize-none"
            />
          </div>

          {/* Report Dialog Footer Section: Cancel and Submit Buttons */}
          <DialogFooter className="gap-2 sm:gap-2">
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
