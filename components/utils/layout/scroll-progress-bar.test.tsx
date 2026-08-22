import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ScrollProgressBar } from "./scroll-progress-bar";

vi.mock("next/navigation", () => ({ usePathname: () => "/feed" }));

/** Drive the media query the component reads. */
let reducedMotion = false;
vi.mock("@/hooks/utils/use-media-query", () => ({
  useMediaQuery: () => reducedMotion,
}));

const setScroll = (scrollY: number, docHeight: number, viewport = 800) => {
  Object.defineProperty(window, "scrollY", { value: scrollY, writable: true });
  Object.defineProperty(window, "innerHeight", {
    value: viewport,
    writable: true,
  });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: docHeight,
    writable: true,
    configurable: true,
  });
};

const bar = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(".will-change-transform");

beforeEach(() => {
  reducedMotion = false;
  // rAF in jsdom would defer past the assertion; run the callback inline.
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("scroll progress bar", () => {
  it("reports how far down the page the reader is", () => {
    setScroll(0, 1800);
    const { container } = render(<ScrollProgressBar />);
    expect(bar(container)).toHaveStyle({ transform: "scaleX(0)" });

    // 500 of a 1000px scrollable range.
    setScroll(500, 1800);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(bar(container)).toHaveStyle({ transform: "scaleX(0.5)" });
  });

  it("still reports progress for reduced-motion readers", () => {
    // The GSAP implementation this replaced left the bar at scale-x-0 forever
    // under reduced motion, so those readers got no indicator at all. Progress
    // is information; only the easing is motion.
    reducedMotion = true;
    setScroll(750, 1800);
    const { container } = render(<ScrollProgressBar />);

    expect(bar(container)).toHaveStyle({
      transform: "scaleX(0.75)",
      transition: "none",
    });
  });

  it("sits above the page headers but below anything modal", () => {
    setScroll(0, 1800);
    const { container } = render(<ScrollProgressBar />);
    const root = container.firstElementChild as HTMLElement;

    // Both headers are z-50; dialogs and the call modal start at z-[100].
    expect(root.className).toContain("z-[60]");
    expect(root.className).toContain("pointer-events-none");
  });

  it("does not divide by zero on a page shorter than the viewport", () => {
    setScroll(0, 600, 800);
    const { container } = render(<ScrollProgressBar />);

    expect(bar(container)).toHaveStyle({ transform: "scaleX(0)" });
  });
});
