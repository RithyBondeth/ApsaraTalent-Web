"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CallStatus, ICallParticipant } from "@/stores/call.store";

// ── Helper: format elapsed call seconds as MM:SS ──────────────────────────────
function formatCallDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

interface CallOverlayProps {
  status: CallStatus;
  /** For the receiver: the person who called. */
  caller: ICallParticipant | null;
  /** For the initiator: the person being called. */
  callee: ICallParticipant | null;
  isMuted: boolean;
  callStartedAt: Date | null;
  /** Remote MediaStream — played via hidden <audio autoPlay>. */
  remoteStream: MediaStream | null;
  onMute: () => void;
  onEnd: () => void;
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
export function CallOverlay({
  status,
  caller,
  callee,
  isMuted,
  remoteStream,
  onMute,
  onEnd,
}: CallOverlayProps) {
  // Duration timer — updates every second once connected
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hidden audio element for remote stream playback
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (status === "connected") {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsed(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // Wire remote stream to the hidden <audio> element
  useEffect(() => {
    const audio = remoteAudioRef.current;
    if (!audio) return;
    if (remoteStream) {
      audio.srcObject = remoteStream;
      audio.play().catch(() => {});
    } else {
      audio.srcObject = null;
    }
  }, [remoteStream]);

  const partner = caller ?? callee;
  if (!partner) return null;

  const initials = partner.name
    .split(" ")
    .map((n) => n[0])
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

  return (
    <>
      {/* Hidden audio element for remote voice playback */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      {/* Floating card */}
      <div className="fixed bottom-6 right-6 z-50 w-72 bg-background border border-border rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-200">
        {/* Partner info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={partner.avatar} alt={partner.name} />
            <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-foreground truncate leading-tight">
              {partner.name}
            </p>
            <p
              className={`text-xs leading-tight tabular-nums ${
                status === "connected"
                  ? "text-green-500"
                  : status === "ended"
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {statusLabel}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4">
          {/* Mute toggle */}
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={onMute}
              disabled={status === "ended"}
              className={`h-11 w-11 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none ${
                isMuted
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
            <span className="text-[10px] text-muted-foreground">
              {isMuted ? "Unmute" : "Mute"}
            </span>
          </div>

          {/* End call */}
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={onEnd}
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
