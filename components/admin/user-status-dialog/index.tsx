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
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { IUserStatusDialogProps } from "./props";
import type { TUserStatus } from "@/utils/types/admin/admin.type";

/** The API rejects anything shorter, so the form should too. */
const MIN_REASON_LENGTH = 10;

export function UserStatusDialog({
  open,
  onOpenChange,
  userName,
  currentStatus,
  saving,
  onSubmit,
}: IUserStatusDialogProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("admin.statusDialog");

  /* -------------------------------- All States ------------------------------ */
  const [status, setStatus] = useState<TUserStatus>(
    currentStatus === "active" ? "suspended" : "active",
  );
  const [reason, setReason] = useState("");
  const [until, setUntil] = useState("");

  /* --------------------------------- Effects -------------------------------- */
  // Reset on open, not on close: clearing during the close animation makes the
  // dialog visibly blank out on its way off screen.
  useEffect(() => {
    if (!open) return;
    setStatus(currentStatus === "active" ? "suspended" : "active");
    setReason("");
    setUntil("");
  }, [open, currentStatus]);

  /* --------------------------------- Handlers ------------------------------- */
  const reasonTooShort = reason.trim().length < MIN_REASON_LENGTH;

  const handleSubmit = () => {
    if (reasonTooShort || saving) return;
    onSubmit({
      status,
      reason: reason.trim(),
      // Sent only on a suspension: the API rejects an end date on the other
      // two rather than ignoring it, which is the behaviour we want mirrored
      // here so the two never disagree.
      ...(status === "suspended" && until
        ? { suspendedUntil: new Date(until).toISOString() }
        : {}),
    });
  };

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{t("title", { name: userName })}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Section */}
          <div className="space-y-2">
            <Label htmlFor="admin-status">{t("statusLabel")}</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as TUserStatus)}
            >
              <SelectTrigger id="admin-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t("optionActive")}</SelectItem>
                <SelectItem value="suspended">
                  {t("optionSuspended")}
                </SelectItem>
                <SelectItem value="banned">{t("optionBanned")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expiry Section — suspensions only */}
          {status === "suspended" ? (
            <div className="space-y-2">
              <Label htmlFor="admin-until">{t("untilLabel")}</Label>
              <Input
                id="admin-until"
                type="date"
                value={until}
                min={new Date(Date.now() + 86_400_000)
                  .toISOString()
                  .slice(0, 10)}
                onChange={(event) => setUntil(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t("untilHelp")}</p>
            </div>
          ) : null}

          {/* Reason Section */}
          <div className="space-y-2">
            <Label htmlFor="admin-reason">{t("reasonLabel")}</Label>
            <Textarea
              id="admin-reason"
              rows={4}
              value={reason}
              maxLength={500}
              placeholder={t("reasonPlaceholder")}
              onChange={(event) => setReason(event.target.value)}
            />
            {/* The reason is shown to the affected user, so say so here. */}
            <p className="text-xs text-muted-foreground">{t("reasonHelp")}</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant={status === "active" ? "default" : "destructive"}
            disabled={reasonTooShort || saving}
            onClick={handleSubmit}
          >
            {saving ? t("saving") : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
