import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PageState } from ".";

describe("PageState", () => {
  it("announces errors and runs the recovery action", () => {
    const onRetry = vi.fn();

    render(
      <PageState
        variant="error"
        title="Could not load"
        description="Check your connection."
        action={{ label: "Try again", onClick: onRetry }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Could not load");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("renders an empty state with a navigation action", () => {
    render(
      <PageState
        variant="empty"
        title="Nothing here yet"
        action={{ label: "Explore", href: "/feed" }}
      />,
    );

    expect(screen.getByRole("region", { name: "Nothing here yet" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore" })).toHaveAttribute(
      "href",
      "/feed",
    );
  });
});
