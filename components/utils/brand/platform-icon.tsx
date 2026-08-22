import {
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiTelegram,
  SiX,
} from "@icons-pack/react-simple-icons";
import { LucideEarth } from "lucide-react";
import { LinkedInIcon } from "./linkedin-icon";
import { TPlatform } from "@/utils/types/user/platform.type";

/* ---------------------------------------------------------------------------
 * The glyph for a social link's platform.
 *
 * This replaced `getSocialPlatformTypeIcon`, which drew five of these from
 * Lucide's brand set — Facebook, Instagram, Github, Linkedin and Twitter — all
 * of which Lucide has deprecated and will remove in v1.0, and which it advises
 * replacing with Simple Icons. It became a component rather than a helper in
 * `utils/functions` because LinkedIn now needs a local glyph, and `utils` has no
 * business importing from `components`.
 *
 * Twitter renders as X: Simple Icons retired the bird with the rebrand. Stored
 * "Twitter" links are untouched, only the mark changes. Website keeps a generic
 * Lucide globe, which is not a brand icon and is not deprecated.
 * ------------------------------------------------------------------------- */

const ICON_SIZE = 20;

// Lucide types `size` as string | number; Simple Icons and the in-house glyphs
// take a number. The union is the shape they all satisfy.
const ICONS: Record<
  TPlatform,
  React.ComponentType<{ size?: string | number; className?: string }>
> = {
  Facebook: SiFacebook,
  Instagram: SiInstagram,
  Github: SiGithub,
  Linkedin: LinkedInIcon,
  Telegram: SiTelegram,
  Twitter: SiX,
  Website: LucideEarth,
};

export function PlatformIcon({
  platform,
  className,
}: {
  platform: TPlatform;
  className?: string;
}) {
  const Icon = ICONS[platform];
  if (!Icon) return null;

  return <Icon size={ICON_SIZE} className={className} />;
}
