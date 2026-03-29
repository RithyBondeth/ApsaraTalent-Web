import { getApiOrigin, normalizeMediaUrl } from "@/utils/functions/media";
import { ICallParticipant } from "./types";

export const FALLBACK_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

/** How long (ms) to wait for the callee to answer before treating it as missed. */
export const CALL_RING_TIMEOUT_MS = 30_000;

/** How long (ms) to show "Call ended / declined" before resetting to idle. */
export const CALL_END_DISMISS_MS = 2_000;

/** How long (ms) to wait in "connecting" before failing the call. */
export const CALL_CONNECT_TIMEOUT_MS = 25_000;

export async function fetchIceServers(): Promise<RTCIceServer[]> {
  try {
    const res = await fetch(`${getApiOrigin()}/auth/ice-servers`);
    const data = await res.json();
    return (data.iceServers as RTCIceServer[]) ?? FALLBACK_ICE_SERVERS;
  } catch {
    return FALLBACK_ICE_SERVERS;
  }
}

export const normalizeParticipantAvatar = (
  participant: ICallParticipant,
): ICallParticipant => ({
  ...participant,
  avatar: normalizeMediaUrl(participant.avatar) || participant.avatar,
});
