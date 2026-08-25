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
// Supplied artwork, trimmed to its alpha box and re-encoded — the files arrived
// with transparent padding (34% of the mark's width was empty) and weighed
// 1.8 MB between them; they are 610 KB now.
//
// The two lockups are cropped to the SAME rectangle, the union of their two
// alpha boxes, so they share one aspect ratio and the dancer does not shift
// when the theme flips. Cropped to their own boxes they were 1.7483 and 1.7052,
// and LogoComponent carries a single ratio per variant.
//
// Only the lockup needs a twin: its wordmark is near-black ink that all but
// vanishes on the dark page, so the dark file letters it in white. The mark is
// the dancer alone — blue and white throughout — and reads on either theme, so
// it ships once.
import logo from "@/assets/utils/logo-for-lightmode.png";
import logoDark from "@/assets/utils/logo-for-darkmode.png";
import logoWithoutTitle from "@/assets/utils/logo-without-text.png";

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
};
