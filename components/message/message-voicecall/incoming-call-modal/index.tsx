"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Phone, PhoneOff } from "lucide-react";
import { IIncomingCallModalProps } from "./props";
import { useTranslations } from "next-intl";
import { getNameInitials } from "@/utils/functions/text";

export function IncomingCallModal(props: IIncomingCallModalProps) {
  /* --------------------------------- Props --------------------------------- */
  const { caller, onAccept, onDecline } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("message");
  const initials = getNameInitials(caller.name);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Call Actions ─────────────────────────────────────────
  const handleAcceptCall = () => onAccept();
  const handleDeclineCall = () => onDecline();

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm duration-200 animate-in fade-in">
      <div className="flex w-80 flex-col items-center gap-5 rounded-none border border-t-[5px] border-border border-t-foreground bg-card p-6 shadow-[7px_7px_0_hsl(var(--foreground)/0.14)] duration-200 animate-in zoom-in-95">
        {/* Incoming Voice Call Label Section */}
        <div className="space-y-1 text-center">
          <TypographyMuted className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {t("incomingVoiceCall")}
          </TypographyMuted>
        </div>

        {/* Caller Avatar Section */}
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-green-400 opacity-20" />
          <span className="absolute inline-flex h-16 w-16 rounded-full border-2 border-green-500/30 bg-green-500/10" />
          <Avatar className="relative z-10 h-16 w-16 rounded-none border-2 border-background">
            <AvatarImage src={caller.avatar} alt={caller.name} />
            <AvatarFallback className="rounded-none text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Caller Name and Status Label Section */}
        <div className="space-y-1 text-center">
          <h3 className="text-lg font-semibold leading-tight text-foreground">
            {caller.name}
          </h3>
          <TypographyMuted className="text-sm text-muted-foreground">
            {t("calling")}
          </TypographyMuted>
        </div>

        {/* Call Actions Section */}
        <div className="flex items-center gap-6 pt-1">
          {/* Decline Call Button Section */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={handleDeclineCall}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 shadow-lg transition-colors hover:bg-red-600 active:bg-red-700"
              aria-label="Decline call"
            >
              <PhoneOff className="h-6 w-6 text-white" />
            </button>
            <span className="text-xs text-muted-foreground">
              {t("decline")}
            </span>
          </div>

          {/* Accept Call Button Section */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={handleAcceptCall}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition-colors hover:bg-green-600 active:bg-green-700"
              aria-label="Accept call"
            >
              <Phone className="h-6 w-6 text-white" />
            </button>
            <span className="text-xs text-muted-foreground">{t("accept")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
