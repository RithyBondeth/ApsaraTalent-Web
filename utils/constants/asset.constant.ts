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
// Approved AT artwork rendered from logo-at-*.svg by generate-brand-assets.mjs.
// Both transparent lockups have identical dimensions; the dark wordmark is
// white. Each monogram matches its theme's primary token and the mobile app.
import logo from "@/assets/utils/logo-for-lightmode.png";
import logoDark from "@/assets/utils/logo-for-darkmode.png";
import logoWithoutTitle from "@/assets/utils/logo-without-text.png";
import logoWithoutTitleDark from "@/assets/utils/logo-without-text-darkmode.png";

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
