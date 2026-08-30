import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const socketIoMocks = vi.hoisted(() => ({ io: vi.fn() }));
const mediaMocks = vi.hoisted(() => ({
  getApiOrigin: vi.fn(() => "https://api.example.com"),
}));

vi.mock("socket.io-client", () => ({ default: socketIoMocks.io }));
vi.mock("@/utils/functions/media", () => mediaMocks);

import {
  clearPendingDisconnect,
  createSocket,
  getSocket,
  scheduleDisconnect,
  setSocket,
} from "./socket-manager";

describe("chat socket manager", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    clearPendingDisconnect();
    setSocket(null);
  });

  afterEach(() => {
    clearPendingDisconnect();
    setSocket(null);
    vi.useRealTimers();
  });

  it("stores and clears the singleton socket", () => {
    const socket = { connected: true };
    setSocket(socket as never);
    expect(getSocket()).toBe(socket);
    setSocket(null);
    expect(getSocket()).toBeNull();
  });

  it("creates a credentialed chat socket with resilient transports", () => {
    const socket = { connected: false };
    socketIoMocks.io.mockReturnValueOnce(socket);

    expect(createSocket()).toBe(socket);
    expect(socketIoMocks.io).toHaveBeenCalledWith(
      "https://api.example.com/chat",
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
      },
    );
  });

  it("deduplicates delayed disconnects and permits a later schedule", () => {
    const first = vi.fn();
    const duplicate = vi.fn();
    const later = vi.fn();

    scheduleDisconnect(first);
    scheduleDisconnect(duplicate);
    vi.advanceTimersByTime(80);
    scheduleDisconnect(later);
    vi.advanceTimersByTime(80);

    expect(first).toHaveBeenCalledOnce();
    expect(duplicate).not.toHaveBeenCalled();
    expect(later).toHaveBeenCalledOnce();
  });

  it("cancels a scheduled disconnect", () => {
    const callback = vi.fn();
    scheduleDisconnect(callback);
    clearPendingDisconnect();
    vi.runAllTimers();
    expect(callback).not.toHaveBeenCalled();
  });
});
