import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NotificationMessageCard from ".";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/utils/functions/date", () => ({
  timeAgo: () => "2 hours ago",
}));

const props = {
  id: "notification-1",
  seen: false,
  timestamp: "2026-08-24T00:00:00.000Z",
  role: "employee" as const,
  preview: "Hello sir",
};

describe("NotificationMessageCard", () => {
  it("shows the sender's initials when they have no avatar", () => {
    // The reported bug: an avatar frame with nothing in it. Radix falls back to
    // initials whenever the image is absent, so a blank frame meant the name
    // behind the initials was empty — not that the image had failed.
    render(
      <NotificationMessageCard
        {...props}
        user={{
          id: "u1",
          name: "Sok Dara",
          position: null,
          industry: null,
        }}
      />,
    );

    expect(screen.getByText("SD")).toBeInTheDocument();
    expect(screen.getAllByText("Sok Dara").length).toBeGreaterThan(0);
  });

  it("renders the description as a sentence, not starting at the dash", () => {
    render(
      <NotificationMessageCard
        {...props}
        user={{
          id: "u1",
          name: "Sok Dara",
          position: null,
          industry: null,
        }}
      />,
    );

    // Previously read "— Hello sir", because the name interpolated ahead of the
    // dash was an empty string. The name legitimately appears twice on the card
    // (description and label), so this pins the description paragraph itself.
    const description = screen.getByText(
      (_, element) =>
        element?.tagName === "P" &&
        element.textContent === "Sok Dara — Hello sir",
    );

    expect(description).toBeInTheDocument();
  });
});
