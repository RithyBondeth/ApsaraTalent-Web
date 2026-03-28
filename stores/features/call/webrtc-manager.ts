import { CALL_CONNECT_TIMEOUT_MS } from "./utils";
import { CallEndReason } from "./types";

// ── WebRTC session singletons ────────────────────────────────────────────────
let _pc: RTCPeerConnection | null = null;
let _pendingOffer: RTCSessionDescriptionInit | null = null;
let _pendingRemoteIceCandidates: RTCIceCandidateInit[] = [];
let _ringTimeout: ReturnType<typeof setTimeout> | null = null;
let _connectTimeout: ReturnType<typeof setTimeout> | null = null;

export const getPc = () => _pc;
export const setPc = (pc: RTCPeerConnection | null) => {
  _pc = pc;
};

export const getPendingOffer = () => _pendingOffer;
export const setPendingOffer = (offer: RTCSessionDescriptionInit | null) => {
  _pendingOffer = offer;
};

export const getPendingIceCandidates = () => _pendingRemoteIceCandidates;
export const clearPendingIceCandidates = () => {
  _pendingRemoteIceCandidates = [];
};
export const addPendingIceCandidate = (candidate: RTCIceCandidateInit) => {
  _pendingRemoteIceCandidates.push(candidate);
};

// ── Helpers ──────────────────────────────────────────────────────────────────
export function closePc() {
  if (_pc) {
    try {
      _pc.close();
    } catch {
      /* ignore */
    }
    _pc = null;
  }
}

export function stopStream(stream: MediaStream | null): null {
  stream?.getTracks().forEach((t) => t.stop());
  return null;
}

export function clearRingTimeout() {
  if (_ringTimeout) {
    clearTimeout(_ringTimeout);
    _ringTimeout = null;
  }
}

export const setRingTimeout = (
  timeout: ReturnType<typeof setTimeout> | null,
) => {
  _ringTimeout = timeout;
};

export function clearConnectTimeout() {
  if (_connectTimeout) {
    clearTimeout(_connectTimeout);
    _connectTimeout = null;
  }
}

export function armConnectTimeout(endCall: (reason: CallEndReason) => void) {
  clearConnectTimeout();
  _connectTimeout = setTimeout(() => {
    endCall("error");
  }, CALL_CONNECT_TIMEOUT_MS);
}

export async function flushPendingIceCandidates() {
  if (!_pc?.remoteDescription || _pendingRemoteIceCandidates.length === 0)
    return;

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
