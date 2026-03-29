"use client";

import { useCallStore } from "@/stores/features/call/call.store";
import { CallOverlay } from "../call-overlay";
import { IncomingCallModal } from "../incoming-call-modal";

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
      {/* Incoming Call Modal Section */}
      {showIncomingCall && caller && (
        <IncomingCallModal
          caller={caller}
          onAccept={answerCall}
          onDecline={declineCall}
        />
      )}

      {/* Call Overlay Section */}
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
