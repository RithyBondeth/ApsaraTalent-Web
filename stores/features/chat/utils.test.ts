import { describe, expect, it } from "vitest";
import {
  parseChatHistory,
  parseRawChatMessage,
  parseRawChatMessages,
} from "./utils";

describe("chat socket payload validation", () => {
  it("accepts a valid message payload", () => {
    expect(
      parseRawChatMessage({
        id: "message-1",
        senderId: "user-1",
        receiverId: "user-2",
        content: "Hello",
        sentAt: "2026-07-13T00:00:00.000Z",
      }),
    ).toMatchObject({ id: "message-1", content: "Hello" });
  });

  it("rejects malformed messages instead of passing them to the UI", () => {
    expect(parseRawChatMessage({ id: 1, content: "Hello" })).toBeNull();
    expect(parseRawChatMessages([{ id: "valid" }, { id: 2 }])).toEqual([]);
  });

  it("validates both supported history response shapes", () => {
    expect(parseChatHistory([{ id: "message-1" }])).toHaveLength(1);
    expect(
      parseChatHistory({
        messages: [{ id: "message-2" }],
        partnerId: "user-2",
        partnerProfile: { id: "user-2", name: "Example" },
      }),
    ).toMatchObject({ partnerId: "user-2" });
  });
});
