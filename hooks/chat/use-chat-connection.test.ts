import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const userMocks = vi.hoisted(() => ({ current: null as unknown }));
const chatMocks = vi.hoisted(() => ({ connect: vi.fn(), disconnect: vi.fn() }));

vi.mock("@/stores/apis/users/get-current-user.store", () => ({
  useGetCurrentUserStore: (selector: (state: { user: unknown }) => unknown) =>
    selector({ user: userMocks.current }),
}));
vi.mock("@/stores/features/chat/chat.store", () => ({
  useChatStore: { getState: () => chatMocks },
}));

import { useChatConnection } from "./use-chat-connection";

describe("useChatConnection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    userMocks.current = null;
  });

  it("does nothing without an authenticated user", () => {
    renderHook(() => useChatConnection());
    expect(chatMocks.connect).not.toHaveBeenCalled();
  });

  it("connects the authenticated user and disconnects on cleanup", () => {
    const user = { id: "user-1", role: "employee" };
    userMocks.current = user;
    const { unmount } = renderHook(() => useChatConnection());

    expect(chatMocks.connect).toHaveBeenCalledWith(user);
    unmount();
    expect(chatMocks.disconnect).toHaveBeenCalledOnce();
  });
});
