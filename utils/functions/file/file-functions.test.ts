import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadBase64File } from "./download-base64-file";
import { extractCleanFilename } from "./extract-clean-filename";
import { formatFileSize } from "./format-file-size";

describe("file functions", () => {
  afterEach(() => vi.restoreAllMocks());

  it("formats byte sizes", () => {
    expect(formatFileSize()).toBe("");
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(2 * 1024)).toBe("2 KB");
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe("2.5 MB");
  });

  it("extracts storage suffixes only from PDF filenames", () => {
    expect(extractCleanFilename("https://cdn.test/my-resume-12345.pdf")).toBe(
      "my-resume.pdf",
    );
    expect(extractCleanFilename("https://cdn.test/photo-12345.png")).toBe(
      "photo-12345.png",
    );
    expect(extractCleanFilename("")).toBe("");
  });

  it("creates, clicks, and cleans up a download link", () => {
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const create = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:test");
    const revoke = vi.spyOn(URL, "revokeObjectURL");

    downloadBase64File(btoa("hello"), "text/plain", "hello.txt");

    expect(create).toHaveBeenCalledWith(expect.any(Blob));
    expect(click).toHaveBeenCalledOnce();
    expect(revoke).toHaveBeenCalledWith("blob:test");
    expect(document.querySelector('a[download="hello.txt"]')).toBeNull();
  });
});
