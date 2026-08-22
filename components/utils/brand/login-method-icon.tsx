import { SiFacebook, SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import { LinkedInIcon } from "./linkedin-icon";

/* ---------------------------------------------------------------------------
 * The provider glyph for one row of the profile's authentication list.
 *
 * These four used to be full-colour raster logos rendered through next/image at
 * 30px with `rounded-full`, sitting directly above Email and Phone OTP drawn as
 * Lucide outlines in currentColor — one list, two icon languages — and directly
 * below a Social Information section drawing the very same Facebook and Github
 * marks a third way. The logos could not follow the theme either.
 *
 * They come from Simple Icons rather than Lucide because Lucide has no Google
 * mark at all, and has deprecated the brand icons it does ship for removal in
 * v1.0. LinkedIn is the one gap in Simple Icons, so it has its own glyph.
 *
 * The four are filled brand marks; Email and Phone OTP beside them stay Lucide
 * outlines. That split is deliberate — a provider's logo and a generic
 * credential mechanism are different kinds of thing — and every one of them now
 * paints in currentColor.
 * ------------------------------------------------------------------------- */

const ICON_SIZE = 20;

const ICONS = {
  Google: SiGoogle,
  Facebook: SiFacebook,
  LinkedIn: LinkedInIcon,
  Github: SiGithub,
} as const;

export type TLoginMethod = keyof typeof ICONS;

export function LoginMethodIcon({ method }: { method: TLoginMethod }) {
  const Icon = ICONS[method];

  return <Icon size={ICON_SIZE} aria-hidden className="shrink-0" />;
}
