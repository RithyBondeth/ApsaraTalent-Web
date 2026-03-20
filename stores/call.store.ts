import { create } from "zustand";
import io from "socket.io-client";
import { getApiOrigin, normalizeMediaUrl } from "@/utils/functions/normalize-media-url";

type SocketInstance = ReturnType<typeof io>;

// ── Module-level singleton ───────────────────────────────────────────────────
// RTCPeerConnection lives at module scope — same pattern as `_socket` in
// chat.store.ts — so React StrictMode's double-invoke doesn't destroy the
// connection between the two mounts.
let _pc: RTCPeerConnection | null = null;
let _pendingOffer: RTCSessionDescriptionInit | null = null;
let _pendingRemoteIceCandidates: RTCIceCandidateInit[] = [];
let _ringTimeout: ReturnType<typeof setTimeout> | null = null;
let _connectTimeout: ReturnType<typeof setTimeout> | null = null;

const FALLBACK_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

async function fetchIceServers(): Promise<RTCIceServer[]> {
  try {
    const res = await fetch(`${getApiOrigin()}/auth/ice-servers`);
    const data = await res.json();
    return (data.iceServers as RTCIceServer[]) ?? FALLBACK_ICE_SERVERS;
  } catch {
    return FALLBACK_ICE_SERVERS;
  }
}

/** How long (ms) to wait for the callee to answer before treating it as missed. */
const CALL_RING_TIMEOUT_MS = 30_000;

/** How long (ms) to show "Call ended / declined" before resetting to idle. */
const CALL_END_DISMISS_MS = 2_000;
/** How long (ms) to wait in "connecting" before failing the call. */
const CALL_CONNECT_TIMEOUT_MS = 25_000;

// ── Types ────────────────────────────────────────────────────────────────────
export type CallStatus =
  | "idle"
  | "calling"      // Initiator: offer sent, waiting for callee to pick up
  | "ringing"      // Receiver: IncomingCallModal is visible
  | "connecting"   // ICE negotiation — audio not yet flowing
  | "connected"    // Audio flowing ✓
  | "ended";       // Transient — shown briefly before → idle

export type CallEndReason = "declined" | "ended" | "missed" | "error";

export interface ICallParticipant {
  userId: string;
  name: string;
  avatar: string;
}

const normalizeParticipantAvatar = (
  participant: ICallParticipant,
): ICallParticipant => ({
  ...participant,
  avatar: normalizeMediaUrl(participant.avatar) || participant.avatar,
});

// ── SocketInstance payload types ──────────────────────────────────────────────────────
export interface CallOfferPayload {
  callId: string;
  callerId: string;
  callerName: string;
  callerAvatar: string;
  offer: RTCSessionDescriptionInit;
}

export interface CallAnswerPayload {
  callId: string;
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidatePayload {
  callId: string;
  candidate: RTCIceCandidateInit;
}

// ── Store interface ───────────────────────────────────────────────────────────
interface CallState {
  status: CallStatus;
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
  _handleOffer: (data: CallOfferPayload) => void;
  _handleAnswer: (data: CallAnswerPayload) => void;
  _handleIceCandidate: (data: IceCandidatePayload) => void;
  _handleCallEnd: (data: { callId: string; reason?: CallEndReason }) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
/** Safely close and nullify the RTCPeerConnection. */
function closePc() {
  if (_pc) {
    try { _pc.close(); } catch { /* ignore */ }
    _pc = null;
  }
}

/** Stop all tracks on a MediaStream and return null. */
function stopStream(stream: MediaStream | null): null {
  stream?.getTracks().forEach((t) => t.stop());
  return null;
}

function clearRingTimeout() {
  if (_ringTimeout) { clearTimeout(_ringTimeout); _ringTimeout = null; }
}

function clearConnectTimeout() {
  if (_connectTimeout) {
    clearTimeout(_connectTimeout);
    _connectTimeout = null;
  }
}

function armConnectTimeout() {
  clearConnectTimeout();
  _connectTimeout = setTimeout(() => {
    if (useCallStore.getState().status === "connecting") {
      useCallStore.getState().endCall("error");
    }
  }, CALL_CONNECT_TIMEOUT_MS);
}

async function flushPendingIceCandidates() {
  if (!_pc?.remoteDescription || _pendingRemoteIceCandidates.length === 0) return;

  const queued = [..._pendingRemoteIceCandidates];
  _pendingRemoteIceCandidates = [];

  for (const candidate of queued) {
    try {
      await _pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.warn("[Call] addIceCandidate (flush) failed:", err);
    }
  }
}

// ── Grab socket from chat store (lazy to avoid circular import) ───────────────
function getSocketInstance(): SocketInstance | null {
  // Dynamic require at call time — avoids circular dep at module init
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useChatStore } = require("./chat.store") as typeof import("./chat.store");
  return useChatStore.getState().socket;
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useCallStore = create<CallState>((set, get) => ({
  status: "idle",
  callId: null,
  localStream: null,
  remoteStream: null,
  isMuted: false,
  caller: null,
  callee: null,
  callStartedAt: null,

  // ── initCallSignaling ──────────────────────────────────────────────────────
  initCallSignaling: (socket) => {
    // Use get() inside each callback (not a one-time snapshot) so the
    // handlers always call the LATEST version of the action functions.
    socket.off("incomingCall");
    socket.off("callAnswered");
    socket.off("remoteIceCandidate");
    socket.off("callDeclined");
    socket.off("callEnded");

    socket.on("incomingCall", (data: CallOfferPayload) => get()._handleOffer(data));
    socket.on("callAnswered", (data: CallAnswerPayload) => get()._handleAnswer(data));
    socket.on("remoteIceCandidate", (data: IceCandidatePayload) => get()._handleIceCandidate(data));
    socket.on("callDeclined", (data: { callId: string }) =>
      get()._handleCallEnd({ callId: data.callId, reason: "declined" }),
    );
    socket.on("callEnded", (data: { callId: string; reason?: CallEndReason }) =>
      get()._handleCallEnd(data),
    );
  },

  // ── initiateCall ──────────────────────────────────────────────────────────
  initiateCall: async (callee: ICallParticipant) => {
    const socket = getSocketInstance();
    if (!socket?.connected) return;
    if (get().status !== "idle") return; // Already in a call
    _pendingRemoteIceCandidates = [];
    _pendingOffer = null;
    clearConnectTimeout();

    // Get microphone
    let localStream: MediaStream;
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      console.warn("[Call] Microphone access denied");
      return;
    }

    const callId = crypto.randomUUID();

    // Create peer connection with Twilio TURN servers
    const iceServers = await fetchIceServers();
    const pc = new RTCPeerConnection({ iceServers });
    _pc = pc;

    // Add local tracks
    localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

    // ICE candidates → signal to callee
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("iceCandidate", {
          callId,
          targetUserId: callee.userId,
          candidate: e.candidate.toJSON(),
        });
      }
    };

    // Remote track → remoteStream
    pc.ontrack = (e) => {
      const [remoteStream] = e.streams;
      if (remoteStream) set({ remoteStream });
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === "connected") {
        clearConnectTimeout();
        set({ status: "connected", callStartedAt: new Date() });
      } else if (state === "failed" || state === "closed") {
        clearConnectTimeout();
        get().endCall("error");
      }
    };

    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    set({
      status: "calling",
      callId,
      localStream,
      callee: normalizeParticipantAvatar(callee),
      isMuted: false,
    });

    socket.emit("callOffer", { callId, receiverId: callee.userId, offer });

    // Auto-cancel after ring timeout if callee doesn't answer
    clearRingTimeout();
    _ringTimeout = setTimeout(() => {
      if (get().status === "calling") {
        get().endCall("missed");
      }
    }, CALL_RING_TIMEOUT_MS);
  },

  // ── answerCall ─────────────────────────────────────────────────────────────
  answerCall: async () => {
    const socket = getSocketInstance();
    if (!socket?.connected) return;

    const { callId, caller } = get();
    if (!callId || !caller || !_pendingOffer) return;

    // Get microphone
    let localStream: MediaStream;
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      console.warn("[Call] Microphone access denied");
      get().declineCall();
      return;
    }

    const iceServers = await fetchIceServers();
    const pc = new RTCPeerConnection({ iceServers });
    _pc = pc;

    localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("iceCandidate", {
          callId,
          targetUserId: caller.userId,
          candidate: e.candidate.toJSON(),
        });
      }
    };

    pc.ontrack = (e) => {
      const [remoteStream] = e.streams;
      if (remoteStream) set({ remoteStream });
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === "connected") {
        set({ status: "connected", callStartedAt: new Date() });
      } else if (state === "failed" || state === "closed") {
        get().endCall("error");
      }
    };

    await pc.setRemoteDescription(_pendingOffer);
    _pendingOffer = null;
    await flushPendingIceCandidates();

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    set({ status: "connecting", localStream, isMuted: false });
    armConnectTimeout();

    socket.emit("callAnswer", { callId, callerId: caller.userId, answer });
  },

  // ── declineCall ────────────────────────────────────────────────────────────
  declineCall: () => {
    const socket = getSocketInstance();
    const { callId, caller } = get();

    if (socket?.connected && callId && caller) {
      socket.emit("callDecline", { callId, callerId: caller.userId });
    }

    _pendingOffer = null;
    _pendingRemoteIceCandidates = [];
    clearRingTimeout();
    clearConnectTimeout();
    closePc();

    set((state) => ({
      status: "idle",
      callId: null,
      caller: null,
      localStream: stopStream(state.localStream),
      remoteStream: stopStream(state.remoteStream),
      isMuted: false,
    }));
  },

  // ── endCall ────────────────────────────────────────────────────────────────
  endCall: (reason: CallEndReason = "ended") => {
    const socket = getSocketInstance();
    const { callId, caller, callee } = get();

    const targetUserId = caller?.userId ?? callee?.userId;
    if (socket?.connected && callId && targetUserId) {
      socket.emit("callEnd", { callId, targetUserId, reason });
    }

    clearRingTimeout();
    clearConnectTimeout();
    closePc();
    _pendingOffer = null;
    _pendingRemoteIceCandidates = [];

    set((state) => ({
      status: "ended",
      localStream: stopStream(state.localStream),
      remoteStream: stopStream(state.remoteStream),
    }));

    // Brief "ended" state so the overlay can show a message, then → idle
    setTimeout(() => {
      set({
        status: "idle",
        callId: null,
        caller: null,
        callee: null,
        callStartedAt: null,
        isMuted: false,
      });
    }, CALL_END_DISMISS_MS);
  },

  // ── toggleMute ─────────────────────────────────────────────────────────────
  toggleMute: () => {
    const { localStream, isMuted } = get();
    if (!localStream) return;
    localStream.getAudioTracks().forEach((t) => {
      t.enabled = isMuted; // toggle: if currently muted → enable, vice versa
    });
    set({ isMuted: !isMuted });
  },

  // ── _handleOffer (incomingCall) ────────────────────────────────────────────
  _handleOffer: (data: CallOfferPayload) => {
    if (get().status !== "idle") {
      // Already in a call — auto-decline the new one
      const socket = getSocketInstance();
      socket?.emit("callDecline", { callId: data.callId, callerId: data.callerId });
      return;
    }

    _pendingOffer = data.offer;
    _pendingRemoteIceCandidates = [];
    set({
      status: "ringing",
      callId: data.callId,
      caller: {
        userId: data.callerId,
        name: data.callerName,
        avatar:
          normalizeMediaUrl(data.callerAvatar) ||
          data.callerAvatar ||
          "/avatars/default.png",
      },
    });
  },

  // ── _handleAnswer (callAnswered) ───────────────────────────────────────────
  _handleAnswer: async (data: CallAnswerPayload) => {
    clearRingTimeout();
    if (!_pc) return;
    try {
      await _pc.setRemoteDescription(data.answer);
      await flushPendingIceCandidates();
      set({ status: "connecting" });
      armConnectTimeout();
    } catch (err) {
      console.error("[Call] setRemoteDescription failed:", err);
      get().endCall("error");
    }
  },

  // ── _handleIceCandidate ────────────────────────────────────────────────────
  _handleIceCandidate: async (data: IceCandidatePayload) => {
    if (!_pc || !_pc.remoteDescription) {
      _pendingRemoteIceCandidates.push(data.candidate);
      return;
    }
    try {
      await _pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (err) {
      console.warn("[Call] addIceCandidate failed:", err);
    }
  },

  // ── _handleCallEnd ─────────────────────────────────────────────────────────
  _handleCallEnd: (data: { callId: string; reason?: CallEndReason }) => {
    const { callId, status } = get();
    if (callId !== data.callId) return; // Stale / different call
    if (status === "idle") return; // Already cleaned up

    clearRingTimeout();
    clearConnectTimeout();
    closePc();
    _pendingOffer = null;
    _pendingRemoteIceCandidates = [];

    set((state) => ({
      status: "ended",
      localStream: stopStream(state.localStream),
      remoteStream: stopStream(state.remoteStream),
    }));

    setTimeout(() => {
      set({
        status: "idle",
        callId: null,
        caller: null,
        callee: null,
        callStartedAt: null,
        isMuted: false,
      });
    }, CALL_END_DISMISS_MS);
  },
}));
