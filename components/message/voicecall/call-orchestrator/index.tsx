"use client";

import { useCallStore } from "@/stores/features/call/call.store";
import { IncomingCallModal } from "../incoming-call-modal";
import { CallOverlay } from "../call-overlay";

/**
 * Call Orchestrator — mounts once in the message page layout.
 *
 * Reads `useCallStore` and conditionally renders:
 *   • `IncomingCallModal`  when status === "ringing"
 *   • `CallOverlay`        when status is "calling" | "connecting" | "connected" | "ended"
 *
 * This component is intentionally thin: all state lives in `call.store.ts`.
 */
export function CallOrchestrator() {
  const {
    status,
    caller,
    callee,
    isMuted,
    callStartedAt,
    remoteStream,
    answerCall,
    declineCall,
    endCall,
    toggleMute,
  } = useCallStore();

  return (
    <>
      {/* Incoming call modal (receiver side) */}
      {status === "ringing" && caller && (
        <IncomingCallModal
          caller={caller}
          onAccept={answerCall}
          onDecline={declineCall}
        />
      )}

      {/* In-call / calling / connecting / ended overlay (both sides) */}
      {(status === "calling" ||
        status === "connecting" ||
        status === "connected" ||
        status === "ended") && (
        <CallOverlay
          status={status}
          caller={caller}
          callee={callee}
          isMuted={isMuted}
          callStartedAt={callStartedAt}
          remoteStream={remoteStream}
          onMute={toggleMute}
          onEnd={() => endCall("ended")}
        />
      )}
    </>
  );
}
