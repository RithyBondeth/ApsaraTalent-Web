import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  blockUser: vi.fn(),
  unblockUser: vi.fn(),
  reportUser: vi.fn(),
  getBlockStatus: vi.fn(),
  routerPush: vi.fn(),
  toastLoading: vi.fn(() => "toast-1"),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  state: {
    blocking: false,
    reporting: false,
    statusByTarget: {} as Record<string, { blockedByMe: boolean }>,
  },
}));

vi.mock("@/stores/apis/moderation/moderation.store", () => ({
  useModerationStore: (selector?: (state: typeof mocks.state) => unknown) => {
    const state = {
      ...mocks.state,
      blockUser: mocks.blockUser,
      unblockUser: mocks.unblockUser,
      reportUser: mocks.reportUser,
      getBlockStatus: mocks.getBlockStatus,
    };
    return selector ? selector(state) : state;
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.routerPush }),
}));
vi.mock("sonner", () => ({
  toast: {
    loading: mocks.toastLoading,
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    const labels: Record<string, string> = {
      moreOptions: "More options",
      block: "Block",
      unblock: "Unblock",
      report: "Report",
      reportDialogTitle: `Report ${values?.name ?? "user"}`,
      reportDialogDescription: "Tell us what happened",
      reportDetailsPlaceholder: "Extra details",
      submitReport: "Submit report",
      submittingReport: "Submitting",
      cancel: "Cancel",
      reasonSpam: "Spam",
      reasonHarassment: "Harassment",
      reasonInappropriate: "Inappropriate",
      reasonFakeProfile: "Fake profile",
      reasonScam: "Scam",
      reasonOther: "Other",
    };
    return labels[key] ?? key;
  },
}));

import UserModerationMenu from "./index";

describe("UserModerationMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state.blocking = false;
    mocks.state.reporting = false;
    mocks.state.statusByTarget = {};
    mocks.blockUser.mockResolvedValue(true);
    mocks.unblockUser.mockResolvedValue(true);
    mocks.reportUser.mockResolvedValue(true);
  });

  it("loads status, blocks a user, and returns to the feed", async () => {
    const user = userEvent.setup();
    render(<UserModerationMenu targetId="user-2" targetName="Sophea" />);
    expect(mocks.getBlockStatus).toHaveBeenCalledWith("user-2");

    await user.click(screen.getByRole("button", { name: "More options" }));
    await user.click(screen.getByRole("menuitem", { name: "Block" }));
    await waitFor(() => expect(mocks.blockUser).toHaveBeenCalledWith("user-2"));
    expect(mocks.toastSuccess).toHaveBeenCalledWith(
      "userBlocked",
      expect.objectContaining({ id: "toast-1" }),
    );
    expect(mocks.routerPush).toHaveBeenCalledWith("/feed");
  });

  it("submits a trimmed report and resets the dialog", async () => {
    const user = userEvent.setup();
    render(<UserModerationMenu targetId="user-2" targetName="Sophea" />);

    await user.click(screen.getByRole("button", { name: "More options" }));
    await user.click(screen.getByRole("menuitem", { name: "Report" }));
    expect(screen.getByRole("dialog", { name: "Report Sophea" })).toBeVisible();
    await user.click(screen.getByText("Harassment"));
    await user.type(
      screen.getByPlaceholderText("Extra details"),
      "  repeated abuse  ",
    );
    await user.click(screen.getByRole("button", { name: "Submit report" }));

    await waitFor(() =>
      expect(mocks.reportUser).toHaveBeenCalledWith({
        reportedId: "user-2",
        reason: "harassment",
        details: "repeated abuse",
      }),
    );
    expect(mocks.toastSuccess).toHaveBeenCalledWith("reportSubmitted");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("unblocks an existing blocked user and reports failures", async () => {
    const user = userEvent.setup();
    mocks.state.statusByTarget = { "user-2": { blockedByMe: true } };
    mocks.unblockUser.mockResolvedValueOnce(false);
    render(<UserModerationMenu targetId="user-2" targetName="Sophea" />);

    await user.click(screen.getByRole("button", { name: "More options" }));
    await user.click(screen.getByRole("menuitem", { name: "Unblock" }));
    await waitFor(() =>
      expect(mocks.unblockUser).toHaveBeenCalledWith("user-2"),
    );
    expect(mocks.toastError).toHaveBeenCalledWith("actionFailed", {
      id: "toast-1",
    });
    expect(mocks.routerPush).not.toHaveBeenCalled();
  });
});
