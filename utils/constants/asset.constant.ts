// Per-page illustration sections used to live here — Feed, Notification,
// Matching, Message, Favorite, Search, Profile, Interview, Resume Builder and
// Legal. They emptied out as the page banners lost their hero SVGs and the
// empty states moved to Lucide glyphs, and are not coming back: a raster or SVG
// asset cannot take a colour token, so it cannot follow the theme the way an
// icon does. What is left is the artwork that genuinely has to be an image.

// ─── Socials ─────────────────────────────────────────────────────────────────
import facebookIcon from "@/assets/socials/facebook.webp";
import githubIcon from "@/assets/socials/github.png";
import googleIcon from "@/assets/socials/google.png";
import linkedInIcon from "@/assets/socials/linkedin.png";

// ─── Auth ─────────────────────────────────────────────────────────────────────
import signupSvg from "@/assets/auth/signup.svg";
import loginSvg from "@/assets/auth/login.svg";
import forgotPasswordSvg from "@/assets/auth/forgot-password.svg";
import resetPasswordSvg from "@/assets/auth/reset-password.svg";
import emailVerificationSvg from "@/assets/auth/email-verification.svg";
import phoneNumberSvg from "@/assets/auth/phone-number.svg";
import phoneOTPSvg from "@/assets/auth/phone-otp.svg";

// ─── Utils (shared across pages) ──────────────────────────────────────────────
// The brand mark ships as four rasters, not two: the artwork's wordmark is a
// fixed dark ink that all but vanishes on the dark theme's near-black page, so
// each lockup has a twin whose inks are lifted to the light foreground.
//
// The source artwork is gold. These are recoloured onto the palette: the gold
// was a metallic ramp — one hue carrying a 14%→98% lightness sweep, which is
// what makes it read as metal — so it was rebuilt on --primary keyed by each
// pixel's lightness rather than hue-rotated flat. Shadows land deep indigo,
// midtones on #1C78D2, and the speculars bleach toward white. The dark twin
// additionally lifts the ramp's shadow end, or the dancer flattens into the
// page. Regenerate from assets/utils/logo.png if the brand colour moves.
import logo from "@/assets/utils/logo-lockup.png";
import logoDark from "@/assets/utils/logo-lockup-dark.png";
import logoWithoutTitle from "@/assets/utils/logo-mark.png";
import logoWithoutTitleDark from "@/assets/utils/logo-mark-dark.png";

export {
  // Socials
  facebookIcon,
  githubIcon,
  googleIcon,
  linkedInIcon,
  // Auth
  signupSvg,
  loginSvg,
  forgotPasswordSvg,
  resetPasswordSvg,
  emailVerificationSvg,
  phoneNumberSvg,
  phoneOTPSvg,
  // Utils
  logo,
  logoDark,
  logoWithoutTitle,
  logoWithoutTitleDark,
};
