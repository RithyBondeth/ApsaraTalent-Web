"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ICallOverlayProps } from "./props";

function formatCallDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

/**
 * Floating in-call card — displayed while a call is active (connecting or connected).
 *
 * Layout (fixed, bottom-right corner):
 *   ┌─────────────────────────────┐
 *   │  [Avatar]  Alice Chen       │
 *   │            Connecting…      │
 *   │      [🎤 Mute]  [📞 End]   │
 *   └─────────────────────────────┘
 *
 * The remote audio is played through a hidden <audio> element driven by `remoteStream`.
 */
export function CallOverlay(props: ICallOverlayProps) {
  /* --------------------------------- Props --------------------------------- */
  const { status, caller, callee, isMuted, remoteStream, onMute, onEnd } =
    props;

  /* -------------------------------- All States ------------------------------ */
  const [elapsed, setElapsed] = useState(0);
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
  const partner = caller ?? callee;
  const partnerInitials = partner?.name
    .split(" ")
    .map((namePart: string) => namePart[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const statusLabel =
    status === "calling"
      ? "Calling…"
      : status === "connecting"
        ? "Connecting…"
        : status === "connected"
          ? formatCallDuration(elapsed)
          : status === "ended"
            ? "Call ended"
            : "";
  const muteLabel = isMuted ? "Unmute" : "Mute";

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Call Actions ─────────────────────────────────────────
  const handleMuteToggle = () => onMute();
  const handleEndCall = () => onEnd();

  if (!partner) return null;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <>
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      <div className="fixed bottom-6 right-6 z-50 w-72 bg-background border border-border rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={partner.avatar} alt={partner.name} />
            <AvatarFallback className="text-sm font-medium">
              {partnerInitials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <TypographyP className="[&:not(:first-child)]:mt-0 font-semibold text-sm text-foreground truncate leading-tight">
              {partner.name}
            </TypographyP>
            <TypographyMuted
              className={`text-xs leading-tight tabular-nums ${
                status === "connected"
                  ? "text-green-500"
                  : status === "ended"
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {statusLabel}
            </TypographyMuted>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={handleMuteToggle}
              disabled={status === "ended"}
              className={`h-11 w-11 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none ${
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

          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={handleEndCall}
              className="h-11 w-11 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 flex items-center justify-center transition-colors shadow-md"
              aria-label="End call"
            >
              <PhoneOff className="h-5 w-5 text-white" />
            </button>
            <span className="text-[10px] text-muted-foreground">End</span>
          </div>
        </div>
      </div>
    </>
  );
}
