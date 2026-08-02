import { describe, expect, it } from "vitest";
import {
  formatSocialPlatformLabel,
  normalizeSocialLinkUrl,
} from "./social-link";

describe("formatSocialPlatformLabel", () => {
  it("uses the correct capitalization for known social brands", () => {
    expect(formatSocialPlatformLabel("linkedinUrl")).toBe("LinkedIn");
    expect(formatSocialPlatformLabel("github_link")).toBe("GitHub");
  });

  it("formats custom platform names without exposing implementation suffixes", () => {
    expect(formatSocialPlatformLabel("personal_blog_url")).toBe(
      "Personal Blog",
    );
  });
});

describe("normalizeSocialLinkUrl", () => {
  it("keeps a complete social URL and all of its parameters", () => {
    const url = "https://web.facebook.com/?_rdc=1&_rdr#";
    expect(normalizeSocialLinkUrl(url)).toBe(url);
  });

  it("adds HTTPS when a user enters a link without a protocol", () => {
    expect(normalizeSocialLinkUrl("linkedin.com/in/bondeth")).toBe(
      "https://linkedin.com/in/bondeth",
    );
  });

  it("rejects unsafe and malformed link destinations", () => {
    expect(normalizeSocialLinkUrl("javascript:alert(1)")).toBeUndefined();
    expect(normalizeSocialLinkUrl("not a valid url")).toBeUndefined();
  });
});
