"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useModerationStore } from "@/stores/apis/moderation/moderation.store";
import { getNameInitials } from "@/utils/functions/text";
import { LucideShieldBan } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";
import { SettingWrapper } from "../setting-wrapper";

export function BlockedUsersSection() {
  /* ---------------------------------- Utils --------------------------------- */
  const tS = useTranslations("setting");
  const tM = useTranslations("moderation");

  /* ----------------------------- API Integration ---------------------------- */
  const {
    blockedUsers,
    loadingBlocked,
    blockedLoaded,
    blocking,
    getBlockedUsers,
    unblockUser,
  } = useModerationStore();

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    if (!blockedLoaded) getBlockedUsers();
  }, [blockedLoaded, getBlockedUsers]);

  /* --------------------------------- Methods -------------------------------- */
  // ── Unblock user ──────────────────────
  const handleUnblock = async (userId: string, name: string) => {
    const toastId = toast.loading(tM("unblocking", { name }));
    const ok = await unblockUser(userId);
    if (ok) {
      toast.success(tM("userUnblocked", { name }), { id: toastId });
    } else {
      toast.error(tM("actionFailed"), { id: toastId });
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <SettingWrapper
      icon={<LucideShieldBan />}
      title={tS("blockedUsers")}
      description={tS("blockedUsersDescription")}
    >
      <div className="flex flex-col">
        {/* Loading Section */}
        {!blockedLoaded && loadingBlocked ? (
          <div className="px-4 py-6">
            <TypographyMuted className="text-xs">
              {tS("loading")}
            </TypographyMuted>
          </div>
        ) : blockedUsers.length === 0 ? (
          <div className="px-4 py-6">
            <TypographyMuted className="text-xs">
              {tS("noBlockedUsers")}
            </TypographyMuted>
          </div>
        ) : (
          /* ── Blocked Users List Section ────────────────────── */
          blockedUsers.map((u, index) => (
            <div key={u.id}>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={u.avatar ?? ""} alt={u.name} />
                    <AvatarFallback className="text-xs font-medium">
                      {getNameInitials(u.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">{u.name}</span>
                </div>
                {/* Unblock Button Section */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={blocking}
                  onClick={() => handleUnblock(u.id, u.name)}
                  className="shrink-0 text-xs h-8"
                >
                  {tM("unblock")}
                </Button>
              </div>
              {/* Separator Section */}
              {index < blockedUsers.length - 1 && <Separator />}
            </div>
          ))
        )}
      </div>
    </SettingWrapper>
  );
}
