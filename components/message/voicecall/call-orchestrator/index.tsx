"use client";

import { useCallStore } from "@/stores/features/call/call.store";
import { CallOverlay } from "../call-overlay";
import { IncomingCallModal } from "../incoming-call-modal";

/**
 * Call Orchestrator — mounts once in the message page layout.
 *
 * Reads `useCallStore` and conditionally renders:
 *   • `IncomingCallModal` when status === "ringing"
 *   • `CallOverlay` when status is "calling" | "connecting" | "connected" | "ended"
 *
 * This component is intentionally thin: all state lives in `call.store.ts`.
 */
export function CallOrchestrator() {
  /* ----------------------------- API Integration ---------------------------- */
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

  /* ---------------------------------- Utils --------------------------------- */
  const showIncomingCall = status === "ringing" && Boolean(caller);
  const showCallOverlay =
    status === "calling" ||
    status === "connecting" ||
    status === "connected" ||
    status === "ended";

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <>
      {showIncomingCall && caller && (
        <IncomingCallModal
          caller={caller}
          onAccept={answerCall}
          onDecline={declineCall}
        />
      )}

      {showCallOverlay && (
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
