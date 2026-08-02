import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LogoutConfirmationDialog } from "./logout-confirmation-dialog";
import RemoveAlertDialog from "@/components/utils/dialogs/remove-alert-dialog";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    const labels: Record<string, string> = {
      "items.resume": "resume",
      removeDescription: `This removes the ${values?.type ?? "item"}`,
      removeTitle: `Remove ${values?.type ?? "item"}?`,
      cancel: "Cancel",
      remove: "Remove",
    };
    return labels[key] ?? key;
  },
}));

describe("confirmation dialogs", () => {
  it("confirms logout once, locks controls while pending, and unlocks afterward", async () => {
    let resolveLogout: (() => void) | undefined;
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveLogout = resolve;
        }),
    );
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(
      <LogoutConfirmationDialog
        open
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
        title="Sign out?"
        description="You will need to sign in again."
        cancelLabel="Stay"
        confirmLabel="Sign out"
      />,
    );

    const confirm = screen.getByRole("button", { name: "Sign out" });
    const cancel = screen.getByRole("button", { name: "Stay" });
    await user.click(confirm);
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(confirm).toBeDisabled();
    expect(cancel).toBeDisabled();
    await user.click(confirm);
    expect(onConfirm).toHaveBeenCalledOnce();

    await act(async () => resolveLogout?.());
    expect(confirm).not.toBeDisabled();
    await user.click(cancel);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("resets pending state when closed", async () => {
    const onConfirm = vi.fn(() => new Promise<void>(() => undefined));
    const { rerender } = render(
      <LogoutConfirmationDialog
        open
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        title="Sign out?"
        description="Description"
        cancelLabel="Stay"
        confirmLabel="Sign out"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Sign out" }));
    rerender(
      <LogoutConfirmationDialog
        open={false}
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        title="Sign out?"
        description="Description"
        cancelLabel="Stay"
        confirmLabel="Sign out"
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("routes remove and cancel choices", async () => {
    const onYesClick = vi.fn();
    const onNoClick = vi.fn();
    const setOpenDialog = vi.fn();
    const user = userEvent.setup();
    render(
      <RemoveAlertDialog
        type="resume"
        openDialog
        setOpenDialog={setOpenDialog}
        onNoClick={onNoClick}
        onYesClick={onYesClick}
      />,
    );
    expect(screen.getByText("Remove resume?")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(onNoClick).toHaveBeenCalledOnce();
    expect(onYesClick).toHaveBeenCalledOnce();
  });
});
