import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChatMessages } from "./index";
import { IMessage } from "@/utils/interfaces/chat/chat.interface";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("../message-bubble", () => ({
  default: () => null,
}));

vi.mock("../message-time-divider", () => ({
  default: () => null,
}));

vi.mock("../typing-indicator", () => ({
  ChatTypingIndicator: () => null,
}));

const firstMessage: IMessage = {
  id: "message-1",
  senderId: "user-1",
  content: "Hello",
  timestamp: "2026-07-28T12:00:00.000Z",
};

const secondMessage: IMessage = {
  ...firstMessage,
  id: "message-2",
  content: "New message",
};

describe("chat reduced motion", () => {
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    scrollIntoView.mockReset();
  });

  it("jumps to new messages without smooth scrolling", () => {
    const activeChat = {
      id: "chat-1",
      name: "Apsara",
      avatar: "",
      preview: "",
      time: "",
    };
    const view = render(
      <ChatMessages messages={[firstMessage]} activeChat={activeChat} />,
    );
    act(() => vi.runOnlyPendingTimers());
    scrollIntoView.mockClear();

    view.rerender(
      <ChatMessages
        messages={[firstMessage, secondMessage]}
        activeChat={activeChat}
      />,
    );

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "instant" });
  });
});
