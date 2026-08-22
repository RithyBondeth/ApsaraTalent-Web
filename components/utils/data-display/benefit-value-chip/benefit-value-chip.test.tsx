import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { BenefitValueChip } from "./index";

/* Asserts the token family each kind maps to, not the hue itself — the same
   convention as the availability and interview-status tests. */
describe("BenefitValueChip", () => {
  it("keeps benefit and value on separate categorical hues", () => {
    const { container: benefit } = render(
      <BenefitValueChip kind="benefit" label="Unlimited PTO" />,
    );
    const { container: value } = render(
      <BenefitValueChip kind="value" label="Innovation" />,
    );

    const benefitClass = benefit.querySelector("span")!.className;
    const valueClass = value.querySelector("span")!.className;

    expect(benefitClass).toContain("category-magenta");
    expect(valueClass).toContain("category-lime");
    expect(benefitClass).not.toEqual(valueClass);
  });

  it("stays off the status ramp and off the availability hues", () => {
    // Benefits moved from indigo to magenta because AvailabilityBadge gives
    // part-time indigo, and the feed interleaves company and employee cards.
    for (const kind of ["benefit", "value"] as const) {
      const { container } = render(
        <BenefitValueChip kind={kind} label="Label" />,
      );
      const className = container.querySelector("span")!.className;
      expect(className).not.toMatch(/success|warning|destructive|info/);
      expect(className).not.toMatch(/category-(teal|indigo|violet)/);
    }
  });

  it("renders the remove control only when onRemove is supplied", async () => {
    const { rerender } = render(
      <BenefitValueChip kind="benefit" label="Unlimited PTO" />,
    );
    expect(screen.queryByRole("button")).toBeNull();

    const onRemove = vi.fn();
    rerender(
      <BenefitValueChip
        kind="benefit"
        label="Unlimited PTO"
        onRemove={onRemove}
        removeLabel="Remove Unlimited PTO"
      />,
    );

    // A real button, not an SVG with onClick — the control it replaced was not
    // reachable by keyboard.
    await userEvent.click(
      screen.getByRole("button", { name: "Remove Unlimited PTO" }),
    );
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
