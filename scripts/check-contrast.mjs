/**
 * Contrast gate for the design tokens in app/globals.css.
 *
 * The token values in globals.css were not picked by eye — each one was solved
 * against the surface it actually sits on. This script re-derives those checks
 * from the CSS itself, so a well-meaning tweak to a hue or lightness can't
 * quietly push body copy or an error message below WCAG AA.
 *
 *   node scripts/check-contrast.mjs           # both themes
 *   node scripts/check-contrast.mjs --verbose # print every pair, not just fails
 *
 * Thresholds follow WCAG 2.1: 4.5:1 for normal text (1.4.3), 3:1 for the
 * boundary of a UI component (1.4.11). Pairs marked `note` are advisory — they
 * describe intent (a "subtle" surface is supposed to stay close to the page)
 * and print but never fail the build.
 *
 * Exits non-zero when a required pair drops below its threshold.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CSS = path.join(ROOT, "app", "globals.css");
const VERBOSE = process.argv.includes("--verbose");

/* --------------------------------- Colour --------------------------------- */

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
}

function relativeLuminance([r, g, b]) {
  const [rr, gg, bb] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
}

function contrast(a, b) {
  const la = relativeLuminance(hslToRgb(...a));
  const lb = relativeLuminance(hslToRgb(...b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/* ------------------------------- Token parse ------------------------------- */

/**
 * Scoped palettes that re-declare a subset of the base tokens for one area of
 * the app (`.auth-scope`, `.landing-scope`). They inherit every token they do
 * not name, so each one is checked as base-theme-plus-overrides rather than on
 * its own — a scope that overrides --background but not --muted-foreground has
 * still changed that pair's contrast.
 *
 * These went unchecked for a long time, and the gap is what let --input in both
 * scopes collapse onto the hairline --border and sit at 1.25:1 against the page
 * while `:root` was correctly holding 3:1. Add a scope here the moment you add
 * one to globals.css.
 */
// `landing` was here until the landing panels stopped opposing the page theme.
// It no longer declares a palette of its own — it reads --landing-panel-bg/ink,
// which are aliases of --muted/--foreground — so the base light and dark checks
// already cover it. `auth` still overrides --auth-paper/--auth-ink and stays.
const SCOPES = ["auth"];

const declarations = (body) => {
  const out = {};
  const decl = /--([\w-]+)\s*:\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*;/g;
  let m;
  while ((m = decl.exec(body)) !== null) {
    out[m[1]] = [Number(m[2]), Number(m[3]), Number(m[4])];
  }
  return out;
};

/**
 * Pulls the `:root { … }` and `.dark { … }` custom-property blocks out of
 * globals.css, plus the light and dark block of every scope in SCOPES. Only
 * `H S% L%` triplets are collected — anything else in there (fonts, --radius)
 * isn't a colour and is skipped.
 */
function parseTokens(css) {
  const themes = { light: {}, dark: {} };
  const blocks = [
    ["light", /:root\s*\{([\s\S]*?)\n\s*\}/],
    ["dark", /\.dark\s*\{([\s\S]*?)\n\s*\}/],
  ];

  for (const [theme, re] of blocks) {
    const body = css.match(re)?.[1];
    if (!body)
      throw new Error(`Could not find the ${theme} token block in globals.css`);
    Object.assign(themes[theme], declarations(body));
  }

  for (const scope of SCOPES) {
    for (const [theme, re] of [
      ["light", new RegExp(`^\\.${scope}-scope\\s*\\{([\\s\\S]*?)^\\}`, "m")],
      [
        "dark",
        new RegExp(`^\\.dark \\.${scope}-scope\\s*\\{([\\s\\S]*?)^\\}`, "m"),
      ],
    ]) {
      const body = css.match(re)?.[1];
      if (!body)
        throw new Error(
          `Could not find the ${theme} block for .${scope}-scope in globals.css`,
        );
      themes[`${scope} ${theme}`] = {
        ...themes[theme],
        ...declarations(body),
      };
    }
  }
  return themes;
}

/* --------------------------------- Rules ---------------------------------- */

const TEXT = 4.5; // WCAG 1.4.3 — normal-size text
const UI = 3.0; // WCAG 1.4.11 — UI component boundary

/** [foreground, background, threshold, description] */
const PAIRS = [
  ["foreground", "background", TEXT, "body text on page"],
  ["card-foreground", "card", TEXT, "body text on card"],
  ["popover-foreground", "popover", TEXT, "text in popover"],
  ["muted-foreground", "background", TEXT, "muted text on page"],
  ["muted-foreground", "card", TEXT, "muted text on card"],
  ["primary-foreground", "primary", TEXT, "label on primary button"],
  ["primary", "background", TEXT, "primary as link text on page"],
  ["primary", "card", TEXT, "primary as link text on card"],
  ["secondary-foreground", "secondary", TEXT, "label on secondary"],
  ["accent-foreground", "accent", TEXT, "label on accent"],
  // In light mode this is the *only* thing telling a card from the page, the
  // background→card lightness step having gone when the page turned white. It
  // is a hairline, not a component boundary, so it is nowhere near the 3:1 of
  // 1.4.11 — but it must not be allowed to fade into the paper either.
  ["border", "background", 1.3, "card edge against the page"],
  ["input", "background", UI, "input border on page"],
  ["input", "card", UI, "input border on card"],
  ["ring", "background", UI, "focus ring on page"],
  ["ring", "card", UI, "focus ring on card"],
  ["sidebar-foreground", "sidebar-background", TEXT, "sidebar text"],
  ["sidebar-accent-foreground", "sidebar-accent", TEXT, "sidebar active item"],
  // Scope-only: the auth/landing brand panel, which opposes the page theme.
  // Skipped in the base themes, which don't declare the pair.
  ["auth-ink", "auth-paper", TEXT, "text on the brand panel"],
];

// Every status family carries the same five roles, so the checks are identical.
for (const s of ["success", "warning", "info", "destructive"]) {
  PAIRS.push(
    [`${s}-foreground`, s, TEXT, `${s}: label on solid fill`],
    [`${s}-accent`, "background", TEXT, `${s}: text on page`],
    [`${s}-accent`, "card", TEXT, `${s}: text on card`],
    [`${s}-accent`, `${s}-subtle`, TEXT, `${s}: text on subtle surface`],
    [
      `${s}-border`,
      `${s}-subtle`,
      1.3,
      `${s}: border against subtle surface`,
      "note",
    ],
  );
}

// destructive is the one status token used directly as text (`text-destructive`,
// 60+ call sites), so it has to clear AA on its own — not only as a fill.
PAIRS.push(
  ["destructive", "background", TEXT, "text-destructive on page"],
  ["destructive", "card", TEXT, "text-destructive on card"],
);

// Categorical hues carry three roles rather than five: a solid for dots, an
// accent for the label, and a subtle surface behind it.
for (const c of ["brown", "orange", "purple", "pink", "gray", "blue"]) {
  PAIRS.push(
    [`category-${c}-accent`, "background", TEXT, `category ${c}: text on page`],
    [`category-${c}-accent`, "card", TEXT, `category ${c}: text on card`],
    [
      `category-${c}-accent`,
      `category-${c}-subtle`,
      TEXT,
      `category ${c}: text on its chip`,
    ],
  );
}

/* ------------------------------ Surface ladder ----------------------------- */

/**
 * Surfaces have to stay distinguishable from the one they sit on. Dark mode in
 * particular has no usable drop shadow, so if two surfaces share a lightness
 * the boundary between them simply disappears — which is how a muted chip
 * inside a popover once became invisible. 1.10 is roughly the point where a
 * flat edge stops reading as an edge.
 *
 * Light mode has no ladder at all any more: the page, the card and the popover
 * are all pure white, so nothing there separates by lightness. What separates
 * them is the --border hairline and the hard offset shadow, and the border is
 * checked as a normal pair below (`card edge against the page`) so the light
 * theme is not simply left ungated.
 */
const LADDER = {
  light: [],
  dark: [
    ["background", "card"],
    ["card", "popover"],
    ["popover", "muted"],
  ],
};
const SEPARATION = 1.07;

/* --------------------------------- Report --------------------------------- */

function main() {
  const themes = parseTokens(fs.readFileSync(CSS, "utf8"));
  const failures = [];
  let checked = 0;

  for (const theme of Object.keys(themes)) {
    const tokens = themes[theme];
    // "auth light" and "landing light" step through the same surface ladder as
    // plain "light" — the scope name is only a prefix.
    const base = theme.split(" ").pop();
    const lines = [];

    for (const [fg, bg, threshold, label, kind] of PAIRS) {
      if (!tokens[fg] || !tokens[bg]) {
        lines.push(`  skip  ${label} — missing --${!tokens[fg] ? fg : bg}`);
        continue;
      }
      checked++;
      const ratio = contrast(tokens[fg], tokens[bg]);
      const ok = ratio >= threshold;
      const advisory = kind === "note";
      if (!ok && !advisory) failures.push({ theme, label, ratio, threshold });
      if (!ok || VERBOSE) {
        const tag = ok ? "ok  " : advisory ? "note" : "FAIL";
        lines.push(
          `  ${tag}  ${ratio.toFixed(2).padStart(6)}:1  (needs ${threshold})  ${label}`,
        );
      }
    }

    for (const [a, b] of LADDER[base]) {
      if (!tokens[a] || !tokens[b]) continue;
      checked++;
      const ratio = contrast(tokens[a], tokens[b]);
      const ok = ratio >= SEPARATION;
      if (!ok) {
        failures.push({
          theme,
          label: `${a} vs ${b}`,
          ratio,
          threshold: SEPARATION,
        });
      }
      if (!ok || VERBOSE) {
        lines.push(
          `  ${ok ? "ok  " : "FAIL"}  ${ratio.toFixed(2).padStart(6)}:1  (needs ${SEPARATION})  surface step: ${a} → ${b}`,
        );
      }
    }

    if (lines.length) {
      console.log(`\n${theme.toUpperCase()}`);
      console.log(lines.join("\n"));
    }
  }

  console.log("");
  if (failures.length) {
    console.error(
      `Contrast check failed: ${failures.length} of ${checked} pairs below threshold.\n` +
        `Adjust the token in app/globals.css — usually its lightness — until it clears.`,
    );
    process.exit(1);
  }
  console.log(`Contrast check passed: ${checked} token pairs meet WCAG AA.`);
}

main();
