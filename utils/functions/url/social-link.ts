/* -------------------------------- Constants -------------------------------- */
const SOCIAL_PLATFORM_LABELS: Record<string, string> = {
  behance: "Behance",
  dribbble: "Dribbble",
  facebook: "Facebook",
  github: "GitHub",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  portfolio: "Portfolio",
  telegram: "Telegram",
  tiktok: "TikTok",
  twitter: "X",
  website: "Website",
  x: "X",
  youtube: "YouTube",
};

/* --------------------------------- Methods --------------------------------- */
/**
 * Converts a social field key into a clean, brand-aware display label.
 */
export const formatSocialPlatformLabel = (platform: string): string => {
  const cleanedPlatform = platform
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\s*(?:url|link)\s*$/i, "")
    .trim();
  const normalizedPlatform = cleanedPlatform.replace(/\s+/g, "").toLowerCase();

  if (SOCIAL_PLATFORM_LABELS[normalizedPlatform]) {
    return SOCIAL_PLATFORM_LABELS[normalizedPlatform];
  }

  return (
    cleanedPlatform
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") || "Website"
  );
};

/**
 * Produces a browser-safe external URL while accepting links entered without
 * an explicit protocol. Only HTTP and HTTPS destinations are allowed.
 */
export const normalizeSocialLinkUrl = (
  value?: string | null,
): string | undefined => {
  const trimmedValue = value?.trim();
  if (!trimmedValue) return undefined;

  let candidate = trimmedValue;

  if (candidate.startsWith("//")) {
    candidate = `https:${candidate}`;
  } else if (!/^https?:\/\//i.test(candidate)) {
    if (/^[a-z][a-z\d+.-]*:/i.test(candidate)) return undefined;
    candidate = `https://${candidate}`;
  }

  try {
    const parsedUrl = new URL(candidate);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return undefined;
    }

    return candidate;
  } catch {
    return undefined;
  }
};
