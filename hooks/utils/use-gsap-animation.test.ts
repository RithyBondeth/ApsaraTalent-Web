import { createElement } from "react";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const gsapMocks = vi.hoisted(() => {
  const tween = {
    totalTime: vi.fn(),
    duration: vi.fn(() => 24),
    timeScale: vi.fn(),
    kill: vi.fn(),
  };
  const timeline = { fromTo: vi.fn(), to: vi.fn() };
  const mediaContexts: Array<{
    add: ReturnType<typeof vi.fn>;
    revert: ReturnType<typeof vi.fn>;
  }> = [];
  const matchMedia = vi.fn(() => {
    const context = {
      add: vi.fn((_query: string, callback: () => unknown) => callback()),
      revert: vi.fn(),
    };
    mediaContexts.push(context);
    return context;
  });
  return {
    registerPlugin: vi.fn(),
    matchMedia,
    mediaContexts,
    fromTo: vi.fn(() => tween),
    to: vi.fn(() => tween),
    set: vi.fn(),
    quickTo: vi.fn(() => vi.fn()),
    timeline: vi.fn(() => timeline),
    timelineResult: timeline,
    tween,
    utils: {
      toArray: (values: ArrayLike<Element>) => Array.from(values),
      random: vi.fn((min: number) => min),
      clamp: vi.fn((min: number, max: number, value: number) =>
        Math.min(max, Math.max(min, value)),
      ),
    },
    scrollCreate: vi.fn(() => ({ kill: vi.fn(), getVelocity: () => 100 })),
  };
});

vi.mock("gsap", () => ({
  default: {
    registerPlugin: gsapMocks.registerPlugin,
    matchMedia: gsapMocks.matchMedia,
    fromTo: gsapMocks.fromTo,
    to: gsapMocks.to,
    set: gsapMocks.set,
    quickTo: gsapMocks.quickTo,
    timeline: gsapMocks.timeline,
    utils: gsapMocks.utils,
  },
}));
vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { create: gsapMocks.scrollCreate },
}));
vi.mock("gsap/DrawSVGPlugin", () => ({ DrawSVGPlugin: {} }));
vi.mock("gsap/MotionPathPlugin", () => ({ MotionPathPlugin: {} }));

import {
  useGsapHeroAnimation,
  useGsapMarquee,
  useGsapScrollAnimation,
} from "./use-gsap-animation";

function ScrollHarness() {
  const ref = useGsapScrollAnimation<HTMLDivElement>();
  return createElement(
    "div",
    { ref },
    createElement("h2", { "data-gsap": "split-words" }, "Talent platform"),
    createElement("div", { "data-gsap": "fade-up" }, "Content"),
    createElement("button", { "data-magnetic": "0.2" }, "Apply"),
    createElement("article", { "data-tilt-card": true }, "Card"),
  );
}

function HeroHarness() {
  const ref = useGsapHeroAnimation<HTMLElement>();
  return createElement(
    "section",
    { ref },
    createElement("h1", { "data-hero": "heading" }, "Find work"),
    createElement("div", { "data-hero": "description" }, "Description"),
    createElement("span", { "data-hero-particle": true }),
    createElement("div", { "data-hero-layer": "1.5" }),
  );
}

function MarqueeHarness() {
  const ref = useGsapMarquee<HTMLDivElement>();
  return createElement("div", { ref }, "Companies");
}

describe("GSAP animation hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    gsapMocks.mediaContexts.length = 0;
  });

  it("initializes scoped scroll animations and reverts them on cleanup", () => {
    const view = render(createElement(ScrollHarness));

    expect(gsapMocks.matchMedia).toHaveBeenCalled();
    expect(gsapMocks.fromTo).toHaveBeenCalled();
    expect(gsapMocks.quickTo).toHaveBeenCalled();
    expect(
      view.container.querySelectorAll(".gsap-unit").length,
    ).toBeGreaterThan(0);

    const contexts = [...gsapMocks.mediaContexts];
    view.unmount();
    expect(
      contexts.every((context) => context.revert.mock.calls.length === 1),
    ).toBe(true);
  });

  it("initializes hero and marquee animations", () => {
    const hero = render(createElement(HeroHarness));
    const marquee = render(createElement(MarqueeHarness));

    expect(gsapMocks.timeline).toHaveBeenCalled();
    expect(gsapMocks.tween.totalTime).toHaveBeenCalled();
    expect(gsapMocks.scrollCreate).toHaveBeenCalled();

    hero.unmount();
    marquee.unmount();
  });
});
