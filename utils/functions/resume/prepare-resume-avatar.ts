import { normalizeMediaUrl } from "@/utils/functions/media";

/* ---------------------------------- Utils --------------------------------- */
const MAX_SOURCE_AVATAR_BYTES = 5 * 1024 * 1024;
const MAX_INLINE_AVATAR_LENGTH = 1_500_000;
const AVATAR_OUTPUT_SIZE = 200;
const AVATAR_FETCH_TIMEOUT_MS = 8_000;
const ALLOWED_AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const INLINE_AVATAR_PATTERN =
  /^data:image\/(?:png|jpe?g|webp);base64,[a-z0-9+/]+={0,2}$/i;

type AvatarFetcher = (input: string, init: RequestInit) => Promise<Response>;
type AvatarEncoder = (blob: Blob) => Promise<string>;

interface IPrepareResumeAvatarOptions {
  fetcher?: AvatarFetcher;
  encoder?: AvatarEncoder;
  timeoutMs?: number;
}

/* --------------------------------- Methods --------------------------------- */
export function isSafeInlineResumeAvatar(value?: string): value is string {
  return Boolean(
    value &&
    value.length <= MAX_INLINE_AVATAR_LENGTH &&
    INLINE_AVATAR_PATTERN.test(value),
  );
}

function normalizeOwnerName(value?: string): string {
  return (value ?? "")
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** Prevent attaching the signed-in user's photo to a pasted resume for someone else. */
export function matchesResumeOwnerName(
  resumeName: string,
  ownerAliases: Array<string | undefined>,
): boolean {
  const normalizedResumeName = normalizeOwnerName(resumeName);
  if (!normalizedResumeName) return false;
  return ownerAliases.some(
    (alias) => normalizeOwnerName(alias) === normalizedResumeName,
  );
}

function encodeAvatarBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();

    const cleanup = () => URL.revokeObjectURL(objectUrl);
    image.onerror = () => {
      cleanup();
      reject(new Error("Unable to decode profile picture"));
    };
    image.onload = () => {
      try {
        const sourceWidth = image.naturalWidth || image.width;
        const sourceHeight = image.naturalHeight || image.height;
        if (!sourceWidth || !sourceHeight) {
          throw new Error("Profile picture has invalid dimensions");
        }

        const scale = Math.min(
          AVATAR_OUTPUT_SIZE / sourceWidth,
          AVATAR_OUTPUT_SIZE / sourceHeight,
          1,
        );
        const width = Math.max(1, Math.round(sourceWidth * scale));
        const height = Math.max(1, Math.round(sourceHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Unable to prepare profile picture");

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        if (!isSafeInlineResumeAvatar(dataUrl)) {
          throw new Error("Prepared profile picture is invalid");
        }
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      } finally {
        cleanup();
      }
    };
    image.src = objectUrl;
  });
}

/**
 * Converts the authenticated employee's existing avatar into a bounded data URL
 * in the browser. The PDF service can then render it without fetching a remote,
 * user-controlled URL.
 */
export async function prepareResumeAvatar(
  source?: string,
  options: IPrepareResumeAvatarOptions = {},
): Promise<string | undefined> {
  if (isSafeInlineResumeAvatar(source)) return source;

  const avatarUrl = normalizeMediaUrl(source);
  if (!avatarUrl || !/^https?:\/\//i.test(avatarUrl)) return undefined;

  const controller = new AbortController();
  const timeout = window.setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? AVATAR_FETCH_TIMEOUT_MS,
  );

  try {
    const response = await (options.fetcher ?? fetch)(avatarUrl, {
      credentials: "include",
      signal: controller.signal,
    });
    if (!response.ok) return undefined;

    const declaredSize = Number(response.headers.get("content-length") || 0);
    if (declaredSize > MAX_SOURCE_AVATAR_BYTES) return undefined;

    const blob = await response.blob();
    const contentType = (
      blob.type ||
      response.headers.get("content-type") ||
      ""
    )
      .split(";", 1)[0]
      .toLowerCase();
    if (
      !ALLOWED_AVATAR_TYPES.has(contentType) ||
      blob.size === 0 ||
      blob.size > MAX_SOURCE_AVATAR_BYTES
    ) {
      return undefined;
    }

    const dataUrl = await (options.encoder ?? encodeAvatarBlob)(blob);
    return isSafeInlineResumeAvatar(dataUrl) ? dataUrl : undefined;
  } catch {
    return undefined;
  } finally {
    window.clearTimeout(timeout);
  }
}
