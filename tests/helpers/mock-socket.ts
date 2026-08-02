import { vi } from "vitest";

export type MockSocketBehavior = (...args: unknown[]) => void;
export type MockSocketListener = (...args: unknown[]) => void;

export function createMockSocket(
  behaviors: Record<string, MockSocketBehavior> = {},
  connected = true,
) {
  const listeners = new Map<string, MockSocketListener>();

  const socket = {
    connected,
    disconnected: !connected,
    emit: vi.fn((event: string, ...args: unknown[]) => {
      behaviors[event]?.(...args);
      return socket;
    }),
    off: vi.fn(),
    on: vi.fn((event: string, listener: MockSocketListener) => {
      listeners.set(event, listener);
      return socket;
    }),
    timeout: vi.fn(() => socket),
    removeAllListeners: vi.fn(),
    disconnect: vi.fn(),
    listeners,
  };

  return socket;
}
