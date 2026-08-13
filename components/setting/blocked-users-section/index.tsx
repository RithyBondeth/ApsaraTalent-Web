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
import { PageState } from "@/components/utils/feedback/page-state";

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
    error,
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
        {loadingBlocked ? (
          <div className="border-l-[4px] border-l-muted-foreground/25 px-5 py-7">
            <TypographyMuted className="text-xs">
              {tS("loading")}
            </TypographyMuted>
          </div>
        ) : error ? (
          <PageState
            variant="error"
            title={error}
            description={tS("blockedUsersLoadErrorDescription")}
            compact
            className="min-h-0 border-x-0 border-b-0 py-7 shadow-none"
            action={{
              label: tS("retry"),
              onClick: () => void getBlockedUsers(),
            }}
          />
        ) : blockedUsers.length === 0 ? (
          <PageState
            variant="empty"
            title={tS("noBlockedUsers")}
            compact
            className="min-h-0 border-x-0 border-b-0 py-7 shadow-none"
          />
        ) : (
          /* ── Blocked Users List Section ────────────────────── */
          blockedUsers.map((u, index) => (
            <div key={u.id}>
              <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-9 w-9 shrink-0 rounded-none border border-border">
                    <AvatarImage src={u.avatar ?? ""} alt={u.name} />
                    <AvatarFallback className="rounded-none text-xs font-bold">
                      {getNameInitials(u.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm font-medium">{u.name}</span>
                </div>
                {/* Unblock Button Section */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={blocking}
                  onClick={() => handleUnblock(u.id, u.name)}
                  className="h-8 shrink-0 rounded-none text-xs"
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
