import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoginMethodIcon, type TLoginMethod } from "./login-method-icon";
import { PlatformIcon } from "./platform-icon";
import { loginMethodConstant } from "@/utils/constants/ui.constant";
import type { TPlatform } from "@/utils/types/user/platform.type";

const METHODS: TLoginMethod[] = ["Google", "Facebook", "LinkedIn", "Github"];
const PLATFORMS: TPlatform[] = [
  "Facebook",
  "Instagram",
  "Telegram",
  "Linkedin",
  "Github",
  "Website",
  "Twitter",
];

const svgOf = (ui: React.ReactElement) =>
  render(ui).container.querySelector("svg");

describe("brand icons", () => {
  it("draws every auth provider as an inline svg, not a raster logo", () => {
    for (const method of METHODS) {
      const svg = svgOf(<LoginMethodIcon method={method} />);
      expect(svg).not.toBeNull();
      // These were <img> tags of full-colour PNG/WebP logos that could not
      // follow the theme and did not match the icons beside them.
      expect(svg!.getAttribute("fill")).toBe("currentColor");
    }
  });

  it("draws every social platform, inheriting the text colour", () => {
    for (const platform of PLATFORMS) {
      const svg = svgOf(<PlatformIcon platform={platform} />);
      expect(svg).not.toBeNull();
      const paint = `${svg!.getAttribute("fill") ?? ""} ${svg!.getAttribute("stroke") ?? ""}`;
      expect(paint).toContain("currentColor");
      // No brand hex: Simple Icons falls back to its own colour when passed
      // color="default", and Lucide's deprecated brand set is gone entirely.
      expect(paint).not.toMatch(/#[0-9a-f]{3,6}/i);
    }
  });

  it("renders each set at one size, so rows line up", () => {
    for (const list of [
      METHODS.map((m) => <LoginMethodIcon key={m} method={m} />),
      PLATFORMS.map((p) => <PlatformIcon key={p} platform={p} />),
    ]) {
      const sizes = list.map((ui) => {
        const svg = svgOf(ui)!;
        return `${svg.getAttribute("width")}x${svg.getAttribute("height")}`;
      });
      expect(new Set(sizes).size).toBe(1);
      expect(sizes[0]).toBe("20x20");
    }
  });

  it("covers every provider the profile actually lists", () => {
    // Guards the constant and the icon map against drifting apart.
    for (const { label } of loginMethodConstant) {
      expect(svgOf(<LoginMethodIcon method={label} />)).not.toBeNull();
    }
  });
});
