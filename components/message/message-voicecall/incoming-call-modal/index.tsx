"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Phone, PhoneOff } from "lucide-react";
import { IIncomingCallModalProps } from "./props";
import { useTranslations } from "next-intl";
import { getNameInitials } from "@/utils/functions/text";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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
    <Dialog open>
      <DialogContent
        className="max-w-sm items-center gap-5 [&>button]:hidden"
        onPointerDownOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        {/* Incoming Voice Call Label Section */}
        <div className="space-y-1 text-center">
          <TypographyMuted className="pixel-label text-xs text-muted-foreground">
            {t("incomingVoiceCall")}
          </TypographyMuted>
        </div>

        {/* Caller Avatar Section */}
        {/* Two square rings expanding on a stagger — square because the avatar
            and the rest of the surface are, and the previous round rings around
            a square avatar read as a rendering fault. They sit behind the
            avatar and are purely decorative. */}
        <div className="relative flex items-center justify-center">
          <span
            aria-hidden
            className="absolute h-16 w-16 border-2 border-success opacity-0 motion-safe:animate-call-ring"
          />
          <span
            aria-hidden
            // Inline, not an arbitrary class: the `animate-*` shorthand resets
            // animation-delay, so a `[animation-delay:…]` utility next to it is
            // silently overridden and both rings pulse as one.
            style={{ animationDelay: "0.9s" }}
            className="absolute h-16 w-16 border-2 border-success opacity-0 motion-safe:animate-call-ring"
          />
          <Avatar className="relative z-10 h-16 w-16 border-2 border-foreground motion-safe:animate-call-pulse">
            <AvatarImage src={caller.avatar} alt={caller.name} />
            <AvatarFallback className="text-lg font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Caller Name and Status Label Section */}
        <div className="space-y-1 text-center">
          <DialogTitle className="text-lg font-medium leading-tight text-foreground">
            {caller.name}
          </DialogTitle>
          <TypographyMuted className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            {t("calling")}
            {/* Three dots cycling, so the dialog reads as live while it waits. */}
            <span aria-hidden className="flex gap-0.5">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className="h-1 w-1 bg-muted-foreground motion-safe:animate-call-dot"
                  style={{ animationDelay: `${index * 0.16}s` }}
                />
              ))}
            </span>
          </TypographyMuted>
        </div>

        {/* Call Actions Section */}
        <div className="flex items-center gap-6 pt-1">
          {/* Decline Call Button Section */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={handleDeclineCall}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive shadow-lg transition-colors hover:bg-destructive/90 active:bg-destructive/80"
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
              className="flex h-14 w-14 items-center justify-center rounded-full bg-success shadow-lg transition-colors hover:bg-success/90 active:bg-success/80 motion-safe:animate-call-pulse"
              aria-label="Accept call"
            >
              <Phone className="h-6 w-6 text-white" />
            </button>
            <span className="text-xs text-muted-foreground">{t("accept")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
