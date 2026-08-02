import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MessageAttachmentStrip } from "./message-input/attachment-strip";
import { MessageReplyPreview } from "./message-input/reply-preview";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({ you: "You", unknown: "Unknown sender", deletedMessage: "Deleted message" })[key] ?? key,
}));

describe("message composer parts", () => {
  it("shows upload states and handles file actions", async () => {
    const user = userEvent.setup();
    const onAddMoreFiles = vi.fn();
    const onClearAll = vi.fn();
    const onRemoveFile = vi.fn();
    render(
      <MessageAttachmentStrip
        pendingFiles={[
          { id: "ready", filename: "photo.png", preview: "blob:photo", status: "ready" },
          { id: "failed", filename: "resume.pdf", status: "error", error: "Too large" },
        ] as never}
        atFileLimit={false}
        inputDisabled={false}
        isUploadingAny={false}
        readyCount={1}
        errorCount={1}
        onAddMoreFiles={onAddMoreFiles}
        onClearAll={onClearAll}
        onRemoveFile={onRemoveFile}
      />,
    );
    expect(screen.getByText("1 file ready · 1 failed")).toBeInTheDocument();
    expect(screen.getByAltText("photo.png")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove resume.pdf" }));
    await user.click(screen.getByRole("button", { name: "Add more files" }));
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onRemoveFile).toHaveBeenCalledWith("failed");
    expect(onAddMoreFiles).toHaveBeenCalledOnce();
    expect(onClearAll).toHaveBeenCalledOnce();
  });

  it("shows uploading state and hides add when the file limit is reached", () => {
    render(
      <MessageAttachmentStrip
        pendingFiles={[{ id: "upload", filename: "file.pdf", status: "uploading" }] as never}
        atFileLimit
        inputDisabled
        isUploadingAny
        readyCount={0}
        errorCount={0}
        onAddMoreFiles={vi.fn()}
        onClearAll={vi.fn()}
        onRemoveFile={vi.fn()}
      />,
    );
    expect(screen.getByText("Uploading…")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add more files" })).not.toBeInTheDocument();
  });

  it("labels, truncates, and cancels replies", async () => {
    const onCancelReply = vi.fn();
    const user = userEvent.setup();
    render(
      <MessageReplyPreview
        replyTarget={{ isMe: true, isDeleted: false } as never}
        replyPreviewText={"a".repeat(110)}
        onCancelReply={onCancelReply}
      />,
    );
    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText(`${"a".repeat(100)}…`)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel reply" }));
    expect(onCancelReply).toHaveBeenCalledOnce();
  });

  it("uses deleted and unknown-sender fallbacks", () => {
    render(
      <MessageReplyPreview
        replyTarget={{ isMe: false, isDeleted: true, senderName: "" } as never}
        replyPreviewText="hidden"
        onCancelReply={vi.fn()}
      />,
    );
    expect(screen.getByText("Unknown sender")).toBeInTheDocument();
    expect(screen.getByText("Deleted message")).toBeInTheDocument();
  });
});
