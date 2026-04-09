const API_ORIGIN_FALLBACK = "http://localhost:3000";

const LOCAL_STORAGE_URL_REGEX =
  /^https?:\/\/(?:localhost|127(?:\.\d{1,3}){3})(?::\d+)?\/storage\/(.+)$/i;

const ABSOLUTE_HTTP_URL_REGEX = /^https?:\/\//i;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === "[object Object]";

export const getApiOrigin = (): string => {
  const raw = process.env.NEXT_PUBLIC_API_URL || API_ORIGIN_FALLBACK;
  return raw.replace(/\/api(?:\/v\d+)?\/?$/i, "").replace(/\/+$/, "");
};

export const normalizeMediaUrl = (
  value?: string | null,
): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  // Keep non-http protocols untouched.
  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("mailto:")
  ) {
    return trimmed;
  }

  const apiOrigin = getApiOrigin();

  const localhostMatch = trimmed.match(LOCAL_STORAGE_URL_REGEX);
  if (localhostMatch) {
    return `${apiOrigin}/storage/${localhostMatch[1]}`;
  }

  if (trimmed.startsWith("/storage/")) {
    return `${apiOrigin}${trimmed}`;
  }

  if (trimmed.startsWith("storage/")) {
    return `${apiOrigin}/${trimmed}`;
  }

  if (ABSOLUTE_HTTP_URL_REGEX.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
};

export const normalizeMediaUrlsDeep = <T>(input: T): T => {
  if (Array.isArray(input)) {
    return input.map((item) => normalizeMediaUrlsDeep(item)) as T;
  }

  if (isPlainObject(input)) {
    const next: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      next[key] = normalizeMediaUrlsDeep(value);
    }
    return next as T;
  }

  if (typeof input === "string") {
    return (normalizeMediaUrl(input) ?? input) as T;
  }

  return input;
};
