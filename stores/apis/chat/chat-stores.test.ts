import { beforeEach, describe, expect, it, vi } from "vitest";

import { useGetRecentChatsStore } from "./get-recent-chats.store";
import { useInitiateChatStore } from "./initiate-chat.store";

const axiosMocks = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

describe("chat API stores", () => {
  beforeEach(() => {
    Object.values(axiosMocks).forEach((mock) => mock.mockReset());
    useGetRecentChatsStore.setState({ loading: false, error: null });
    useInitiateChatStore.setState({ loading: false, error: null, data: null });
  });

  it("returns recent chats and normalizes malformed responses", async () => {
    const chats = [{ id: "chat-1" }];
    axiosMocks.get
      .mockResolvedValueOnce({ data: chats })
      .mockResolvedValueOnce({ data: { unexpected: true } });

    await expect(useGetRecentChatsStore.getState().fetchRecentChats()).resolves.toEqual(chats);
    await expect(useGetRecentChatsStore.getState().fetchRecentChats()).resolves.toEqual([]);
    expect(useGetRecentChatsStore.getState()).toMatchObject({ loading: false, error: null });
  });

  it("initiates a chat with the correct participants", async () => {
    const chat = { chatId: "chat-1", created: true };
    axiosMocks.post.mockResolvedValueOnce({ data: chat });

    const result = await useInitiateChatStore
      .getState()
      .initiateChat("sender-1", "receiver-1");

    expect(result).toBe(chat);
    expect(axiosMocks.post).toHaveBeenCalledWith(expect.any(String), {
      senderId: "sender-1",
      receiverId: "receiver-1",
    });
    expect(useInitiateChatStore.getState()).toMatchObject({
      data: chat,
      loading: false,
      error: null,
    });
  });

  it("exposes chat request failures", async () => {
    axiosMocks.get.mockRejectedValueOnce(new Error("chat unavailable"));
    await expect(useGetRecentChatsStore.getState().fetchRecentChats()).rejects.toThrow(
      "chat unavailable",
    );
    expect(useGetRecentChatsStore.getState()).toMatchObject({
      loading: false,
      error: "chat unavailable",
    });
  });
});
