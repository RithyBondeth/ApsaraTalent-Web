import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LucideBookmark } from "lucide-react";
import { PageState } from ".";

/**
 * The glyph is decorative, so it carries `aria-hidden` and has no accessible
 * name to query by. These assertions go through the rendered SVG's own class,
 * which lucide stamps with the icon name.
 */
const glyphClass = (container: HTMLElement) =>
  container.querySelector("svg")?.getAttribute("class") ?? "";

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

    expect(
      screen.getByRole("region", { name: "Nothing here yet" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore" })).toHaveAttribute(
      "href",
      "/feed",
    );
  });

  it("renders the icon the call site asked for", () => {
    const { container } = render(
      <PageState
        variant="empty"
        title="Nothing saved yet"
        icon={LucideBookmark}
      />,
    );

    expect(glyphClass(container)).toContain("lucide-bookmark");
  });

  it("falls back to the shared inbox when no icon is given", () => {
    const { container } = render(
      <PageState variant="empty" title="Nothing here yet" />,
    );

    expect(glyphClass(container)).toContain("lucide-inbox");
  });

  it("keeps the warning triangle on errors even when an icon is passed", () => {
    const { container } = render(
      <PageState
        variant="error"
        title="Could not load"
        icon={LucideBookmark}
      />,
    );

    expect(glyphClass(container)).toContain("lucide-triangle-alert");
    expect(glyphClass(container)).not.toContain("lucide-bookmark");
  });
});
