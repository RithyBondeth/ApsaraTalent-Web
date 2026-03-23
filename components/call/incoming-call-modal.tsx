"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, PhoneOff } from "lucide-react";
import type { ICallParticipant } from "@/stores/features/call.store";

interface IncomingCallModalProps {
  caller: ICallParticipant;
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * Centered modal overlay shown when an incoming voice call arrives.
 *
 * Layout:
 *   ┌──────────────────────────────────────────┐
 *   │        Incoming Voice Call               │
 *   │    [●●●]  Alice Chen  [●●●]              │
 *   │          Calling…                        │
 *   │   [Decline ✕]      [Accept ✓]            │
 *   └──────────────────────────────────────────┘
 *
 * The pulsing ring animation is achieved via Tailwind `animate-ping` on a
 * span positioned behind the avatar.
 */
export function IncomingCallModal({ caller, onAccept, onDecline }: IncomingCallModalProps) {
  const initials = caller.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal card */}
      <div className="bg-background rounded-2xl shadow-2xl border border-border w-80 p-6 flex flex-col items-center gap-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            Incoming Voice Call
          </p>
        </div>

        {/* Avatar with pulsing ring */}
        <div className="relative flex items-center justify-center">
          {/* Outer ping ring */}
          <span className="animate-ping absolute inline-flex h-20 w-20 rounded-full bg-green-400 opacity-20" />
          {/* Inner static ring */}
          <span className="absolute inline-flex h-16 w-16 rounded-full bg-green-500/10 border-2 border-green-500/30" />
          <Avatar className="h-16 w-16 relative z-10">
            <AvatarImage src={caller.avatar} alt={caller.name} />
            <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </div>

        {/* Caller name + status */}
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-lg text-foreground leading-tight">
            {caller.name}
          </h3>
          <p className="text-sm text-muted-foreground">Calling…</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-6 pt-1">
          {/* Decline */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onDecline}
              className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 flex items-center justify-center transition-colors shadow-lg"
              aria-label="Decline call"
            >
              <PhoneOff className="h-6 w-6 text-white" />
            </button>
            <span className="text-xs text-muted-foreground">Decline</span>
          </div>

          {/* Accept */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onAccept}
              className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 active:bg-green-700 flex items-center justify-center transition-colors shadow-lg"
              aria-label="Accept call"
            >
              <Phone className="h-6 w-6 text-white" />
            </button>
            <span className="text-xs text-muted-foreground">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
}
