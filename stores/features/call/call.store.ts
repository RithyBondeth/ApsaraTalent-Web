import { create } from "zustand";
import { normalizeMediaUrl } from "@/utils/functions/media";

// 1. Utils
import {
  SocketInstance,
  ICallParticipant,
  ICallOfferPayload,
  ICallAnswerPayload,
  IIceCandidatePayload,
  TCallState,
  CallEndReason,
  TCallStatus, // Add this
} from "./types";

export type {
  TCallStatus,
  ICallParticipant,
  ICallOfferPayload,
  ICallAnswerPayload,
  IIceCandidatePayload,
  TCallState,
  CallEndReason,
};
import {
  fetchIceServers,
  normalizeParticipantAvatar,
  CALL_RING_TIMEOUT_MS,
  CALL_END_DISMISS_MS,
} from "./utils";
import {
  getPc,
  setPc,
  getPendingOffer,
  setPendingOffer,
  getPendingIceCandidates,
  clearPendingIceCandidates,
  addPendingIceCandidate,
  closePc,
  stopStream,
  clearRingTimeout,
  setRingTimeout,
  clearConnectTimeout,
  armConnectTimeout,
  flushPendingIceCandidates,
} from "./webrtc-manager";

function getSocketInstance(): SocketInstance | null {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useChatStore } =
    require("../chat/chat.store") as typeof import("../chat/chat.store");
  return useChatStore.getState().socket;
}

/* ---------------------------------- Store ---------------------------------- */
export const useCallStore = create<TCallState>((set, get) => ({
  // 3. All States
  status: "idle",
  callId: null,
  localStream: null,
  remoteStream: null,
  isMuted: false,
  caller: null,
  callee: null,
  callStartedAt: null,

  // 4. Effects (Signaling & Lifecycle)
  initCallSignaling: (socket) => {
    socket.off("incomingCall");
    socket.off("callAnswered");
    socket.off("remoteIceCandidate");
    socket.off("callDeclined");
    socket.off("callEnded");

    socket.on("incomingCall", (data: ICallOfferPayload) =>
      get()._handleOffer(data),
    );
    socket.on("callAnswered", (data: ICallAnswerPayload) =>
      get()._handleAnswer(data),
    );
    socket.on("remoteIceCandidate", (data: IIceCandidatePayload) =>
      get()._handleIceCandidate(data),
    );
    socket.on("callDeclined", (data: { callId: string }) =>
      get()._handleCallEnd({ callId: data.callId, reason: "declined" }),
    );
    socket.on("callEnded", (data: { callId: string; reason?: CallEndReason }) =>
      get()._handleCallEnd(data),
    );
  },

  // 2. API Integration (Actions with side effects)
  initiateCall: async (callee: ICallParticipant) => {
    const socket = getSocketInstance();
    if (!socket?.connected) return;
    if (get().status !== "idle") return;

    clearPendingIceCandidates();
    setPendingOffer(null);
    clearConnectTimeout();

    let localStream: MediaStream;
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      console.warn("[Call] Microphone access denied");
      return;
    }

    const callId = crypto.randomUUID();
    const iceServers = await fetchIceServers();
    const pc = new RTCPeerConnection({ iceServers });
    setPc(pc);

    localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("iceCandidate", {
          callId,
          targetUserId: callee.userId,
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
        clearConnectTimeout();
        set({ status: "connected", callStartedAt: new Date() });
      } else if (state === "failed" || state === "closed") {
        clearConnectTimeout();
        get().endCall("error");
      }
    };

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

    clearRingTimeout();
    setRingTimeout(
      setTimeout(() => {
        if (get().status === "calling") {
          get().endCall("missed");
        }
      }, CALL_RING_TIMEOUT_MS),
    );
  },

  answerCall: async () => {
    const socket = getSocketInstance();
    if (!socket?.connected) return;

    const { callId, caller } = get();
    const pendingOffer = getPendingOffer();
    if (!callId || !caller || !pendingOffer) return;

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
    setPc(pc);

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

    await pc.setRemoteDescription(pendingOffer);
    setPendingOffer(null);
    await flushPendingIceCandidates();

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    set({ status: "connecting", localStream, isMuted: false });
    armConnectTimeout((reason) => get().endCall(reason));

    socket.emit("callAnswer", { callId, callerId: caller.userId, answer });
  },

  // 5. Methods (Purely local state manipulation or simple emits)
  declineCall: () => {
    const socket = getSocketInstance();
    const { callId, caller } = get();

    if (socket?.connected && callId && caller) {
      socket.emit("callDecline", { callId, callerId: caller.userId });
    }

    setPendingOffer(null);
    clearPendingIceCandidates();
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

  endCall: (reason = "ended") => {
    const socket = getSocketInstance();
    const { callId, caller, callee } = get();

    const targetUserId = caller?.userId ?? callee?.userId;
    if (socket?.connected && callId && targetUserId) {
      socket.emit("callEnd", { callId, targetUserId, reason });
    }

    clearRingTimeout();
    clearConnectTimeout();
    closePc();
    setPendingOffer(null);
    clearPendingIceCandidates();

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

  toggleMute: () => {
    const { localStream, isMuted } = get();
    if (!localStream) return;
    localStream.getAudioTracks().forEach((t) => {
      t.enabled = isMuted;
    });
    set({ isMuted: !isMuted });
  },

  // ── Internal signal handlers (called by socket listeners) ───────────────
  _handleOffer: (data) => {
    if (get().status !== "idle") {
      const socket = getSocketInstance();
      socket?.emit("callDecline", {
        callId: data.callId,
        callerId: data.callerId,
      });
      return;
    }

    setPendingOffer(data.offer);
    clearPendingIceCandidates();
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

  _handleAnswer: async (data) => {
    clearRingTimeout();
    const pc = getPc();
    if (!pc) return;
    try {
      await pc.setRemoteDescription(data.answer);
      await flushPendingIceCandidates();
      set({ status: "connecting" });
      armConnectTimeout((reason) => get().endCall(reason));
    } catch (err) {
      console.error("[Call] setRemoteDescription failed:", err);
      get().endCall("error");
    }
  },

  _handleIceCandidate: async (data) => {
    const pc = getPc();
    if (!pc || !pc.remoteDescription) {
      addPendingIceCandidate(data.candidate);
      return;
    }
    try {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (err) {
      console.warn("[Call] addIceCandidate failed:", err);
    }
  },

  _handleCallEnd: (data) => {
    const { callId, status } = get();
    if (callId !== data.callId) return;
    if (status === "idle") return;

    clearRingTimeout();
    clearConnectTimeout();
    closePc();
    setPendingOffer(null);
    clearPendingIceCandidates();

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
