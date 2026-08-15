"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { formatDurationClock } from "@/utils/functions/date";
import { getNameInitials } from "@/utils/functions/text";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ICallOverlayProps } from "./props";
import { useTranslations } from "next-intl";

export function CallOverlay(props: ICallOverlayProps) {
  /* --------------------------------- Props --------------------------------- */
  const { status, caller, callee, isMuted, remoteStream, onMute, onEnd } =
    props;

  /* -------------------------------- All States ------------------------------ */
  const [elapsed, setElapsed] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    if (status === "connected") {
      timerRef.current = setInterval(
        () => setElapsed((value) => value + 1),
        1000,
      );
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsed(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  useEffect(() => {
    const audio = remoteAudioRef.current;
    if (!audio) return;

    if (remoteStream) {
      audio.srcObject = remoteStream;
      audio.play().catch(() => {});
      return;
    }

    audio.srcObject = null;
  }, [remoteStream]);

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("message");
  const partner = caller ?? callee;
  const partnerInitials = partner ? getNameInitials(partner.name) : undefined;
  const statusLabel =
    status === "calling"
      ? t("calling")
      : status === "connecting"
        ? t("connecting")
        : status === "connected"
          ? formatDurationClock(elapsed, { padMinutes: true })
          : status === "ended"
            ? t("callEnded")
            : "";
  const muteLabel = isMuted ? t("unmute") : t("mute");

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Call Actions ─────────────────────────────────────────
  const handleMuteToggle = () => onMute();
  const handleEndCall = () => onEnd();

  if (!partner) return null;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <>
      {/* Hidden Audio Section */}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      {/* Call Overlay Section */}
      <div className="fixed bottom-6 right-6 z-50 w-72 rounded-none border border-t-[5px] border-border border-t-foreground bg-card p-4 duration-200 animate-in slide-in-from-bottom-4">
        <div className="mb-4 flex items-center gap-3">
          {/* Partner Avatar Section */}
          <Avatar className="h-10 w-10 shrink-0 rounded-none border border-border">
            <AvatarImage src={partner.avatar} alt={partner.name} />
            <AvatarFallback className="rounded-none text-sm font-medium">
              {partnerInitials}
            </AvatarFallback>
          </Avatar>

          {/* Partner Name and Status Label Section */}
          <div className="min-w-0">
            <TypographyP className="truncate text-sm font-medium leading-tight text-foreground [&:not(:first-child)]:mt-0">
              {partner.name}
            </TypographyP>
            <TypographyMuted
              className={`text-xs tabular-nums leading-tight ${
                status === "connected"
                  ? "text-success"
                  : status === "ended"
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {statusLabel}
            </TypographyMuted>
          </div>
        </div>

        {/* Call Actions Section */}
        <div className="flex items-center justify-center gap-4">
          {/* Mute Button Section */}
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={handleMuteToggle}
              disabled={status === "ended"}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-40 ${
                isMuted
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
              aria-label={muteLabel}
            >
              {isMuted ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
            <span className="text-[10px] text-muted-foreground">
              {muteLabel}
            </span>
          </div>

          {/* End Call Button Section */}
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={handleEndCall}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive shadow-md transition-colors hover:bg-destructive/90 active:bg-destructive/80"
              aria-label="End call"
            >
              <PhoneOff className="h-5 w-5 text-white" />
            </button>
            <span className="text-[10px] text-muted-foreground">
              {t("endCall")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
