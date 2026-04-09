import io from "socket.io-client";
import { SocketInstance } from "./types";
import { getApiOrigin } from "@/utils/functions/media";
import { getCookie } from "cookies-next";

// ── Module-level Socket Singleton ────────────────────────
let _socket: SocketInstance | null = null;
let _pendingDisconnect: ReturnType<typeof setTimeout> | null = null;

// ── Get Socket ───────────────────────────────────────────
export const getSocket = () => _socket;

// ── Set Socket ───────────────────────────────────────────
export const setSocket = (socket: SocketInstance | null) => {
  _socket = socket;
};

// ── Clear Pending Disconnect ──────────────────────────────
export const clearPendingDisconnect = () => {
  if (_pendingDisconnect !== null) {
    clearTimeout(_pendingDisconnect);
    _pendingDisconnect = null;
  }
};

// ── Schedule Disconnect ────────────────────────────────────
export const scheduleDisconnect = (callback: () => void) => {
  if (_pendingDisconnect !== null) return;
  _pendingDisconnect = setTimeout(() => {
    _pendingDisconnect = null;
    callback();
  }, 80);
};

// ── Normalize Any URL Into Origin ──────────────────────────────
const toOrigin = (rawUrl: string): string => {
  const raw = rawUrl.trim();
  if (!raw) return "";

  try {
    return new URL(raw).origin;
  } catch {
    // Fallback for malformed env values:
    // remove trailing slash and optional API prefix suffix.
    return raw
      .replace(/\/+$/, "")
      .replace(/\/api(?:\/v\d+)?\/?$/i, "");
  }
};

// ── Resolve Socket Origin (from API URL) ────────────────────────
const resolveSocketOrigin = (): string => {
  const apiOrigin = toOrigin(process.env.NEXT_PUBLIC_API_URL || "");
  if (apiOrigin) return apiOrigin;

  // Fallback to existing helper then strip optional API prefix if present.
  return getApiOrigin().replace(/\/api(?:\/v\d+)?\/?$/i, "");
};

// ── Create Socket ───────────────────────────────────────────
export const createSocket = () => {
  const socketUrl = resolveSocketOrigin();
  const socketToken = getCookie("auth-token");

  const socket: SocketInstance = io(`${socketUrl}/chat`, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    auth: socketToken ? { token: String(socketToken) } : undefined,
  });

  return socket;
};
