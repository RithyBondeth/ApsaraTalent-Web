import io from "socket.io-client";
import { SocketInstance } from "./types";
import { getApiOrigin } from "@/utils/functions/normalize-media-url";
import { getCookie } from "cookies-next";

// ── Module-level socket singleton ───────────────────────────────────────────
let _socket: SocketInstance | null = null;
let _pendingDisconnect: ReturnType<typeof setTimeout> | null = null;

export const getSocket = () => _socket;
export const setSocket = (socket: SocketInstance | null) => {
  _socket = socket;
};

export const clearPendingDisconnect = () => {
  if (_pendingDisconnect !== null) {
    clearTimeout(_pendingDisconnect);
    _pendingDisconnect = null;
  }
};

export const scheduleDisconnect = (callback: () => void) => {
  if (_pendingDisconnect !== null) return;
  _pendingDisconnect = setTimeout(() => {
    _pendingDisconnect = null;
    callback();
  }, 80);
};

export const createSocket = () => {
  const socketUrl = getApiOrigin();
  const socketToken = getCookie("auth-token");

  const socket: SocketInstance = io(`${socketUrl}/chat`, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    auth: socketToken ? { token: String(socketToken) } : undefined,
  } as any);

  return socket;
};
