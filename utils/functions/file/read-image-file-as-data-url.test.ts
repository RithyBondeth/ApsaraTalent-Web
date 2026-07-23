import { describe, expect, it } from "vitest";
import {
  isSupportedProfileImage,
  readImageFileAsDataUrl,
} from "./read-image-file-as-data-url";

describe("profile image preparation", () => {
  it("accepts the image formats supported by the cropper", () => {
    expect(isSupportedProfileImage(new File([], "avatar.jpg", { type: "image/jpeg" }))).toBe(true);
    expect(isSupportedProfileImage(new File([], "avatar.png", { type: "image/png" }))).toBe(true);
    expect(isSupportedProfileImage(new File([], "avatar.webp", { type: "image/webp" }))).toBe(true);
  });

  it("rejects formats that the browser cropper may not decode", () => {
    expect(isSupportedProfileImage(new File([], "avatar.heic", { type: "image/heic" }))).toBe(false);
    expect(isSupportedProfileImage(new File([], "avatar.svg", { type: "image/svg+xml" }))).toBe(false);
  });

  it("creates a durable data URL for the crop dialog", async () => {
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });

    await expect(readImageFileAsDataUrl(file)).resolves.toMatch(
      /^data:image\/png;base64,/,
    );
  });
});
