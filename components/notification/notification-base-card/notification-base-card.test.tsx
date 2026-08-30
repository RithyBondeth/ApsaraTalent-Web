import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import NotificationBaseCard from ".";

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) => {
    if (namespace === "notification" && key === "deleteNotification") {
      return "Delete notification";
    }
    return key;
  },
}));

vi.mock("@/utils/functions/date", () => ({
  timeAgo: () => "just now",
}));

describe("NotificationBaseCard", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens the notification when its card is selected", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <NotificationBaseCard
        id="notification-1"
        seen={false}
        timestamp="2026-07-26T00:00:00.000Z"
        title="Interview confirmed"
        description="Tomorrow at 10 AM"
        icon={<span>icon</span>}
        iconBgColor="bg-muted"
        iconColor="text-foreground"
        onClick={onClick}
      />,
    );

    await user.click(screen.getByText("Interview confirmed"));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByText("just now")).toBeInTheDocument();
  });

  it("delays deletion for animation and does not open the card", async () => {
    vi.useFakeTimers();
    const onClick = vi.fn();
    const onDelete = vi.fn();
    render(
      <NotificationBaseCard
        id="notification-2"
        seen
        timestamp="2026-07-26T00:00:00.000Z"
        title="New match"
        description="A company matched with you"
        icon={<span>icon</span>}
        iconBgColor="bg-muted"
        iconColor="text-foreground"
        onClick={onClick}
        onDelete={onDelete}
      />,
    );

    screen.getByRole("button", { name: "Delete notification" }).click();
    expect(onClick).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(400));
    expect(onDelete).toHaveBeenCalledWith("notification-2");
  });
});
