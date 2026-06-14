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
import {
  TBlockStatus,
  TReportReason,
  useModerationStore,
} from "@/stores/apis/moderation/moderation.store";
import { Ban, Flag, MoreVertical, ShieldOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface IUserModerationMenuProps {
  /** Target user/employee/company id — the server resolves it to a User id. */
  targetId: string;
  /** Display name used in confirmation/report copy. */
  targetName: string;
  /** Dropdown alignment relative to the trigger. */
  align?: "start" | "end";
  /** Extra classes for the trigger button. */
  triggerClassName?: string;
}

const REPORT_REASONS: { value: TReportReason; labelKey: string }[] = [
  { value: "spam", labelKey: "reasonSpam" },
  { value: "harassment", labelKey: "reasonHarassment" },
  { value: "inappropriate_content", labelKey: "reasonInappropriate" },
  { value: "fake_profile", labelKey: "reasonFakeProfile" },
  { value: "scam", labelKey: "reasonScam" },
  { value: "other", labelKey: "reasonOther" },
];

export default function UserModerationMenu({
  targetId,
  targetName,
  align = "end",
  triggerClassName = "h-8 w-8 sm:h-9 sm:w-9",
}: IUserModerationMenuProps) {
  const t = useTranslations("moderation");

  const {
    status,
    blocking,
    reporting,
    getBlockStatus,
    blockUser,
    unblockUser,
    reportUser,
  } = useModerationStore();

  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState<TReportReason>("spam");
  const [details, setDetails] = useState("");

  // Refresh block status whenever the target changes.
  useEffect(() => {
    if (targetId) getBlockStatus(targetId);
  }, [targetId, getBlockStatus]);

  const blockedByMe = (status as TBlockStatus | null)?.blockedByMe ?? false;

  const handleBlockToggle = async () => {
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

  const handleSubmitReport = async () => {
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

  return (
    <>
      <DropdownMenu>
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
          <DropdownMenuItem
            onClick={() => setReportOpen(true)}
            className="gap-2 text-destructive focus:text-destructive"
          >
            <Flag className="h-4 w-4" />
            {t("report")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("reportDialogTitle", { name: targetName })}
            </DialogTitle>
            <DialogDescription>
              {t("reportDialogDescription")}
            </DialogDescription>
          </DialogHeader>

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
