/**
 * Env validator for the Next.js app. There is no runtime schema (Next just
 * reads process.env), so this script is the source of truth for "which vars
 * must exist". It models Next.js's own file-merge order for a given mode and
 * checks the MERGED result — because vars are split across files on purpose
 * (shared values in .env, per-env API URL in .env.<mode>).
 *
 *   node scripts/check-env.mjs              # checks development + production
 *   node scripts/check-env.mjs production   # one mode only
 *
 * IMPORTANT: in real production the site is built on Netlify, which injects its
 * OWN env vars — these local files are NOT used there. A green "production"
 * result here means a local `next build && next start` is wired correctly; it
 * does NOT prove Netlify's dashboard vars are set. Keep the two in sync by hand.
 *
 * Exits non-zero when a REQUIRED var is missing in any checked mode.
 */
import fs from "node:fs";
import path from "node:path";

// Required: the app is broken without these.
const REQUIRED = [
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

// Recommended: absence degrades gracefully (Sentry disables itself), so warn
// rather than fail. NEXT_PUBLIC_SENTRY_DSN + SENTRY_DSN turn reporting on;
// the ORG/PROJECT/AUTH_TOKEN trio enables source-map upload at build time.
const RECOMMENDED = [
  "NEXT_PUBLIC_SENTRY_DSN",
  "SENTRY_DSN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
  "SENTRY_AUTH_TOKEN",
];

// Next.js load order (later overrides earlier); .env.local is skipped in test.
// https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
function filesFor(mode) {
  const list = [".env", `.env.${mode}`];
  if (mode !== "test") list.push(".env.local");
  return list;
}

function parse(file) {
  const abs = path.resolve(process.cwd(), file);
  if (!fs.existsSync(abs)) return null;
  const out = {};
  for (const raw of fs.readFileSync(abs, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    out[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return out;
}

function merge(mode) {
  const merged = {};
  const source = {};
  for (const file of filesFor(mode)) {
    const parsed = parse(file);
    if (!parsed) continue;
    for (const [k, v] of Object.entries(parsed)) {
      if (v === "") continue; // present-but-blank counts as unset
      merged[k] = v;
      source[k] = file;
    }
  }
  return { merged, source };
}

const modes = process.argv.slice(2);
if (modes.length === 0) modes.push("development", "production");

let failed = false;

for (const mode of modes) {
  console.log(`\n── ${mode} (${filesFor(mode).join(" → ")}) ──`);
  const { merged, source } = merge(mode);

  const missingRequired = REQUIRED.filter((k) => !merged[k]);
  const missingRecommended = RECOMMENDED.filter((k) => !merged[k]);

  for (const k of REQUIRED) {
    if (merged[k]) console.log(`  ✓ ${k}  (${source[k]})`);
    else console.error(`  ✗ ${k}  MISSING (required)`);
  }
  for (const k of RECOMMENDED) {
    if (merged[k]) console.log(`  ✓ ${k}  (${source[k]})`);
    else console.warn(`  ⚠ ${k}  not set (Sentry feature disabled)`);
  }

  if (missingRequired.length) {
    failed = true;
    console.error(
      `  → ${mode}: ${missingRequired.length} required var(s) missing`,
    );
  } else {
    const sentry = merged.NEXT_PUBLIC_SENTRY_DSN
      ? "Sentry ON"
      : "Sentry off";
    console.log(
      `  → ${mode}: OK${missingRecommended.length ? ` (${missingRecommended.length} recommended unset)` : ""}  [${sentry}]`,
    );
  }
}

process.exit(failed ? 1 : 0);
