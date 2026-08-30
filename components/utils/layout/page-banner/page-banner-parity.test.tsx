import { cleanup, render } from "@testing-library/react";
import { LucideUsers } from "lucide-react";
import { afterEach, describe, expect, it } from "vitest";

import { PageBanner } from "./index";
import { PageBannerSkeleton } from "./skeleton";

afterEach(cleanup);

/* ---------------------------------------------------------------------------
 * `FeedBannerSkeleton` drifted for a whole release: the banner was rebuilt as
 * a single-column, left-accented card and its placeholder stayed a 280px
 * two-column hero with a dark artwork panel. Six pages loaded with a shape
 * they were never going to show.
 *
 * Nothing in the type system connects a component to its skeleton, so this
 * test is the connection. It compares the two roots class by class.
 * ------------------------------------------------------------------------- */

const root = (markup: React.ReactElement) => {
  const { container } = render(markup);
  const section = container.querySelector("section");
  if (!section) throw new Error("expected a <section> root");
  return new Set(section.className.split(/\s+/).filter(Boolean));
};

const banner = (stats?: number) =>
  root(
    <PageBanner
      eyebrow="All talent"
      title="Find top talent from anywhere and grow your team"
      subtitle="Build your dream team effortlessly, no matter where you are."
      stats={
        stats
          ? Array.from({ length: stats }, (_, index) => ({
              icon: LucideUsers,
              label: `stat ${index}`,
              value: "12",
            }))
          : undefined
      }
    />,
  );

describe("page banner / skeleton parity", () => {
  it.each([0, 1, 3])(
    "wears the same surface as its skeleton with %i stats",
    (stats) => {
      expect([...banner(stats)].sort()).toEqual(
        [...root(<PageBannerSkeleton stats={stats} />)].sort(),
      );
    },
  );

  it("does not reintroduce the retired hero panel", () => {
    const { container } = render(<PageBannerSkeleton stats={3} />);
    const markup = container.innerHTML;

    // The old skeleton's tells: a fixed hero height and an inverted right-hand
    // panel standing in for artwork that no longer exists.
    expect(markup).not.toMatch(/min-h-\[\d+px\]/);
    expect(markup).not.toContain("bg-foreground");
  });

  it("keeps every placeholder square", () => {
    const { container } = render(<PageBannerSkeleton stats={3} />);
    const rounded = Array.from(
      container.querySelectorAll<HTMLElement>(".animate-shimmer"),
    ).flatMap((element) =>
      element.className
        .split(/\s+/)
        .filter(
          (name) => name.startsWith("rounded") && name !== "rounded-none",
        ),
    );

    expect(rounded).toEqual([]);
  });
});
