import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { RecentMatchesList } from ".";

const timeAgo = vi.hoisted(() => vi.fn(() => "just now"));
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("@/utils/functions/date", () => ({ timeAgo }));
vi.mock("@/components/ui/cached-avatar", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

test("recent matches display the real gateway matchedAt field with nullable avatars", () => {
  const matchedAt = "2026-10-08T00:00:00.000Z";
  render(
    <RecentMatchesList
      isEmployee
      matches={[{ id: "peer", name: "Local Company", avatar: null, matchedAt }]}
    />,
  );
  expect(screen.getByText("Local Company")).toBeInTheDocument();
  expect(timeAgo).toHaveBeenCalledWith(matchedAt, expect.any(Function));
  expect(screen.getByText("just now")).toBeInTheDocument();
});
