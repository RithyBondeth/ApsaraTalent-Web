import { afterEach, describe, expect, it, vi } from "vitest";
import { androidAssociation, appleAssociation } from "./mobile-app-links";
import { GET as androidGet } from "@/app/.well-known/assetlinks.json/route";
import { GET as appleGet } from "@/app/.well-known/apple-app-site-association/route";

const sha = Array(32).fill("AB").join(":");
afterEach(() => vi.unstubAllEnvs());

describe("verified mobile associations", () => {
  it("uses production signing fingerprints and deduplicates rotated certificates", () => {
    expect(
      androidAssociation({
        ANDROID_APP_ID: "social.apsara.talent",
        ANDROID_APP_LINK_SHA256: `${sha.toLowerCase()}, ${sha}`,
      })[0].target,
    ).toEqual({
      namespace: "android_app",
      package_name: "social.apsara.talent",
      sha256_cert_fingerprints: [sha],
    });
  });
  it("restricts universal links to supported public routes", () => {
    expect(
      appleAssociation({
        IOS_BUNDLE_ID: "social.apsara.talent",
        IOS_APP_ID_PREFIX: "AB12345678",
      }).applinks.details[0],
    ).toEqual({
      appIDs: ["AB12345678.social.apsara.talent"],
      components: [
        { "/": "/jobs/*" },
        { "/": "/unsubscribe" },
        { "/": "/reset-password" },
      ],
    });
  });
  it("refuses missing identities, example apps, and malformed signing fingerprints", () => {
    expect(() => androidAssociation({})).toThrow();
    expect(() =>
      androidAssociation({
        ANDROID_APP_ID: "com.example.apsaratalent_mobile",
        ANDROID_APP_LINK_SHA256: sha,
      }),
    ).toThrow();
    expect(() =>
      androidAssociation({
        ANDROID_APP_ID: "social.apsara.talent",
        ANDROID_APP_LINK_SHA256: "AB:CD",
      }),
    ).toThrow();
    expect(() =>
      appleAssociation({ IOS_BUNDLE_ID: "social.apsara.talent" }),
    ).toThrow();
  });
  it("serves JSON directly without authentication and never caches incomplete configuration", async () => {
    vi.stubEnv("ANDROID_APP_ID", "social.apsara.talent");
    vi.stubEnv("ANDROID_APP_LINK_SHA256", sha);
    const android = await androidGet();
    expect(android.status).toBe(200);
    expect(android.headers.get("content-type")).toContain("application/json");
    expect(await android.json()).toEqual(androidAssociation());
    vi.stubEnv("IOS_BUNDLE_ID", "");
    const apple = await appleGet();
    expect(apple.status).toBe(503);
    expect(apple.headers.get("cache-control")).toBe("no-store");
  });
});
