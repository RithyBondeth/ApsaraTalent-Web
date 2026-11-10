import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import AccountDrafts from "./index";
import {
  accountDrafts,
  saveDraftRecovery,
  loadDraftRecoveries,
} from "@/utils/functions/resume/account-drafts";
const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("@/utils/functions/resume/account-drafts", async (original) => {
  const real =
    await original<typeof import("@/utils/functions/resume/account-drafts")>();
  return {
    ...real,
    accountDrafts: {
      list: vi.fn(),
      read: vi.fn(),
      save: vi.fn(),
      remove: vi.fn(),
    },
  };
});
const draft = {
  id: "00000000-0000-4000-8000-000000000001",
  name: "Engineer resume",
  revision: 1,
  createdAt: "2026-10-07T00:00:00Z",
  updatedAt: "2026-10-07T00:00:00Z",
  content: {
    personalInfo: { fullName: "Candidate", email: "me@example.com" },
    skills: ["Dart"],
    experience: [],
    template: "modern" as const,
  },
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(accountDrafts.list).mockResolvedValue([draft]);
  vi.mocked(accountDrafts.read).mockResolvedValue(draft);
  vi.mocked(accountDrafts.save).mockImplementation(
    async (identity, content) => ({
      ...draft,
      ...identity,
      revision: 2,
      content,
    }),
  );
});
it("opens and renames saved drafts, then confirms deletion", async () => {
  const user = userEvent.setup();
  render(<AccountDrafts owner="owner" />);
  await user.click(await screen.findByRole("button", { name: "openDraft" }));
  expect(push).toHaveBeenCalledWith("/resume-builder/edit");
  await user.click(screen.getByRole("button", { name: "renameDraft" }));
  const name = screen.getByRole("textbox", { name: "resumeName" });
  await user.clear(name);
  await user.type(name, "Designer");
  await user.click(screen.getByRole("button", { name: "saveDraftName" }));
  await waitFor(() =>
    expect(accountDrafts.save).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Designer", revision: 1 }),
      draft.content,
    ),
  );
  await user.click(screen.getByRole("button", { name: "deleteDraft" }));
  expect(accountDrafts.remove).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "deleteDraft" }));
  await waitFor(() =>
    expect(accountDrafts.remove).toHaveBeenCalledWith(draft.id),
  );
});
it("duplicates with a new creation id and retains unsynced edits separately per account", async () => {
  const user = userEvent.setup();
  saveDraftRecovery("other", { ...draft, dirty: true }, draft.content);
  render(<AccountDrafts owner="owner" />);
  await user.click(
    await screen.findByRole("button", { name: "duplicateDraft" }),
  );
  await waitFor(() => expect(accountDrafts.save).toHaveBeenCalled());
  expect(vi.mocked(accountDrafts.save).mock.calls[0][0].id).not.toBe(draft.id);
  expect(vi.mocked(accountDrafts.save).mock.calls[0][0].revision).toBeNull();
  expect(loadDraftRecoveries("owner")).toHaveLength(0);
  expect(loadDraftRecoveries("other")).toHaveLength(1);
});
