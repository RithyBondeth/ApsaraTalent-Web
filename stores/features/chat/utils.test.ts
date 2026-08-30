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
  });

  it("drops only the malformed rows, keeping the rest of the list", () => {
    // Previously a single bad row emptied the whole array, and the chat page
    // rendered "No conversations yet" with nothing logged.
    expect(parseRawChatMessages([{ id: "valid" }, { id: 2 }])).toHaveLength(1);
  });

  it("accepts the nulls the API sends for a plain text message", () => {
    // attachment*, replyToId and isMe map to nullable columns, so every text
    // message arrives with them explicitly null rather than absent. Declaring
    // them `.optional()` without `.nullable()` rejected every message, which
    // blanked the conversation list for both participants.
    const textMessage = {
      id: "message-1",
      content: "hi",
      sentAt: "2026-08-14T15:43:43.254Z",
      messageType: "text",
      isRead: false,
      reactions: {},
      attachment: null,
      attachmentType: null,
      attachmentFilename: null,
      attachmentDuration: null,
      attachmentAmplitude: null,
      replyToId: null,
      isMe: null,
    };

    expect(parseRawChatMessages([textMessage])).toHaveLength(1);
    expect(parseRawChatMessage(textMessage)).toMatchObject({ content: "hi" });
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
