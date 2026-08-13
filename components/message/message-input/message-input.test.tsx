import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ChatInput from ".";

const recorderMocks = vi.hoisted(() => ({
  startRecording: vi.fn(),
  stopRecording: vi.fn(),
  cancelRecording: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (
    key: string,
    values?: Record<string, string | number>,
  ) => {
    if (key === "enterMessage") return "Enter a message";
    if (key === "loadingChat") return "Loading chat";
    if (key === "attachFiles") return "Attach files";
    if (key === "maxFilesReached") return `Maximum ${values?.max} files reached`;
    if (key === "uploadFailed") return "Upload failed";
    if (key === "you") return "You";
    return key;
  },
}));

vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="emoji-picker" />,
}));

vi.mock("@/hooks/chat/use-voice-recorder", () => ({
  useVoiceRecorder: () => ({
    recordingState: "idle",
    durationSeconds: 0,
    ...recorderMocks,
  }),
}));

vi.mock("@/stores/themes/theme-store", () => ({
  useThemeStore: () => ({ theme: "light", systemTheme: "light" }),
}));

describe("ChatInput", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    recorderMocks.startRecording.mockReset();
    recorderMocks.stopRecording.mockReset();
    recorderMocks.cancelRecording.mockReset();
    vi.stubGlobal("fetch", vi.fn());
    vi.stubGlobal(
      "requestAnimationFrame",
      (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    );
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:preview");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends trimmed text with Enter and resets typing state", async () => {
    const user = userEvent.setup();
    const onSendMessage = vi.fn(() => true);
    const onTyping = vi.fn();
    render(
      <ChatInput
        onSendMessage={onSendMessage}
        onTyping={onTyping}
      />,
    );

    const input = screen.getByPlaceholderText("Enter a message");
    await user.type(input, "  Hello team!  {Enter}");

    expect(onSendMessage).toHaveBeenCalledWith("Hello team!", null, []);
    expect(onTyping).toHaveBeenCalledWith(true);
    expect(onTyping).toHaveBeenLastCalledWith(false);
    expect(input).toHaveValue("");
  });

  it("keeps the draft when the chat store rejects a send", async () => {
    const user = userEvent.setup();
    const onSendMessage = vi.fn(() => false);
    render(<ChatInput onSendMessage={onSendMessage} />);

    const input = screen.getByPlaceholderText("Enter a message");
    await user.type(input, "Retry me");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(onSendMessage).toHaveBeenCalledWith("Retry me", null, []);
    expect(input).toHaveValue("Retry me");
  });

  it("uploads an attachment and includes it in the outgoing message", async () => {
    const user = userEvent.setup();
    const onSendMessage = vi.fn(() => true);
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          url: "https://cdn.example.com/resume.pdf",
          type: "document",
          filename: "resume.pdf",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    render(<ChatInput onSendMessage={onSendMessage} />);

    await user.upload(
      screen.getByLabelText("Attach files", { selector: "input" }),
      new File(["resume"], "resume.pdf", { type: "application/pdf" }),
    );
    await screen.findByText("1 file ready");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/chat/upload"),
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      }),
    );
    expect(onSendMessage).toHaveBeenCalledWith("", null, [
      {
        url: "https://cdn.example.com/resume.pdf",
        type: "document",
        filename: "resume.pdf",
      },
    ]);
    expect(screen.queryByText("resume.pdf")).not.toBeInTheDocument();
  });

  it("shows a server upload failure and lets the user clear it", async () => {
    const user = userEvent.setup();
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Storage unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }),
    );
    render(<ChatInput onSendMessage={vi.fn(() => true)} />);

    await user.upload(
      screen.getByLabelText("Attach files", { selector: "input" }),
      new File(["image"], "photo.png", { type: "image/png" }),
    );

    expect(await screen.findByTitle("Storage unavailable")).toBeInTheDocument();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview");
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(screen.queryByTitle("Storage unavailable")).not.toBeInTheDocument();
  });

  it("rejects an oversized file before making a network request", async () => {
    const user = userEvent.setup();
    const oversized = new File(["x"], "huge.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(oversized, "size", { value: 11 * 1024 * 1024 });
    render(<ChatInput onSendMessage={vi.fn(() => true)} />);

    await user.upload(
      screen.getByLabelText("Attach files", { selector: "input" }),
      oversized,
    );

    expect(
      await screen.findByTitle("huge.pdf: exceeds 10 MB"),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Remove huge.pdf" }));
    await waitFor(() =>
      expect(
        screen.queryByTitle("huge.pdf: exceeds 10 MB"),
      ).not.toBeInTheDocument(),
    );
  });
});
