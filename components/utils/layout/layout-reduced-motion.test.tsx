import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ApsaraLoadingSpinner from "@/components/utils/feedback/apsara-loading-spinner";
import { FadeIn } from "./fade-in";
import { ScrollProgressBar } from "./scroll-progress-bar";
import { ScrollToTop } from "./scroll-to-top";

vi.mock("next/navigation", () => ({
  usePathname: () => "/feed",
}));

function mockReducedMotion(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    matches: query === "(prefers-reduced-motion: reduce)" && matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("reduced-motion layout utilities", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReducedMotion(true);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("shows delayed replacement content immediately", () => {
    render(
      <FadeIn delay={1_000} duration={500}>
        <span>Loaded content</span>
      </FadeIn>,
    );

    const wrapper = screen.getByText("Loaded content").parentElement;
    expect(wrapper).toHaveStyle({ opacity: "1", transitionDuration: "0ms" });
  });

  it("uses an instant scroll-to-top action", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<ScrollToTop />);

    fireEvent.click(screen.getByRole("button", { name: "Scroll to top" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });

  it("removes interpolation from the scroll progress bar", () => {
    const { container } = render(<ScrollProgressBar />);
    const progressBar = container.querySelector<HTMLElement>(
      ".will-change-transform",
    );

    expect(progressBar).toHaveStyle({ transition: "none" });
  });

  it("keeps the custom loading mark static", () => {
    render(<ApsaraLoadingSpinner />);
    act(() => vi.runOnlyPendingTimers());

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText(/Loading\.\.\. \d+%/)).not.toBeInTheDocument();
  });
});
