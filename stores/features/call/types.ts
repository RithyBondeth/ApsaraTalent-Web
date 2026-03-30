import io from "socket.io-client";

export type SocketInstance = ReturnType<typeof io>;

export type TCallStatus =
  | "idle"
  | "calling" // Initiator: offer sent, waiting for callee to pick up
  | "ringing" // Receiver: IncomingCallModal is visible
  | "connecting" // ICE negotiation — audio not yet flowing
  | "connected" // Audio flowing ✓
  | "ended"; // Transient — shown briefly before → idle

export type CallEndReason = "declined" | "ended" | "missed" | "error";

export interface ICallParticipant {
  userId: string;
  name: string;
  avatar: string;
}

// ── SocketInstance payload types ──────────────────────────────────────────────────────
export interface ICallOfferPayload {
  callId: string;
  callerId: string;
  callerName: string;
  callerAvatar: string;
  offer: RTCSessionDescriptionInit;
}

export interface ICallAnswerPayload {
  callId: string;
  answer: RTCSessionDescriptionInit;
}

export interface IIceCandidatePayload {
  callId: string;
  candidate: RTCIceCandidateInit;
}

// ── Call State ───────────────────────────────────────────────────────────
export type TCallState = {
  status: TCallStatus;
  callId: string | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  /** Populated for the receiver (incoming call). */
  caller: ICallParticipant | null;
  /** Populated for the initiator (outgoing call). */
  callee: ICallParticipant | null;
  callStartedAt: Date | null;

  // ── Actions ─────────────────────────────────────────────────────────────
  /**
   * Called once from chat.store.ts `connect()` after the socket connects.
   * Registers all incoming signaling event listeners on the socket.
   */
  initCallSignaling: (socket: SocketInstance) => void;

  /**
   * Initiates an outgoing voice call to the given chat partner.
   * Caller side: idle → calling
   */
  initiateCall: (callee: ICallParticipant) => Promise<void>;

  /**
   * Accepts an incoming call.
   * Receiver side: ringing → connecting
   */
  answerCall: () => Promise<void>;

  /**
   * Rejects an incoming call without answering.
   * Receiver side: ringing → idle
   */
  declineCall: () => void;

  /**
   * Hangs up the current call (works for both initiator and receiver).
   * Both sides: connected/connecting/calling → ended → idle
   */
  endCall: (reason?: CallEndReason) => void;

  /** Toggles local microphone mute state. */
  toggleMute: () => void;

  // ── Internal signal handlers (called by socket listeners) ───────────────
  _handleOffer: (data: ICallOfferPayload) => void;
  _handleAnswer: (data: ICallAnswerPayload) => void;
  _handleIceCandidate: (data: IIceCandidatePayload) => void;
  _handleCallEnd: (data: { callId: string; reason?: CallEndReason }) => void;
};
