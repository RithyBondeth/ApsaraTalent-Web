/**
 * Guard against colour applied through an inline `style` prop.
 *
 * `check:tokens` scans class names and `check:contrast` parses globals.css, so
 * a colour written as `style={{ color }}` is invisible to both. That gap is not
 * theoretical: MatchScoreBadge, ScoreRing and MatchRateRadial all painted their
 * numbers from raw hex constants (SCORE_COLOR, RATE_COLOR) this way. Every one
 * failed WCAG AA as text on a light card — #22c55e at 2.28:1, #f59e0b at 2.15:1,
 * #ef4444 at 3.76:1, #10b981 at 2.54:1 — and being fixed hex, none could shift
 * for dark mode. Both ratchets reported "holding" the entire time.
 *
 *   node scripts/check-inline-colors.mjs           # fail if any new hit appears
 *   node scripts/check-inline-colors.mjs --list    # show them
 *
 * The resume builder is exempt: its themes are user-chosen colours rendered to
 * PDF and canvas, outside the app's theming, so hex is the right unit there.
 *
 * Use instead: a token class (`text-success-accent`), or for a library that
 * insists on a colour string, `hsl(var(--token))` — recharts takes that happily.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIRS = ["app", "components", "hooks", "lib"];
const SKIP_DIRS = new Set(["node_modules", ".next", ".next-e2e", "coverage"]);
const EXEMPT = /resume|canvas-template/i;
const EXTS = new Set([".tsx"]);

// A colour-bearing key inside a style={{ … }} object.
const PATTERN =
  /style=\{\{[^}]*\b(color|backgroundColor|borderColor|outlineColor|fill|stroke)\s*:/g;

function* walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTS.has(path.extname(entry.name))) yield full;
  }
}

function scan() {
  const hits = [];
  for (const dir of SCAN_DIRS) {
    for (const file of walk(path.join(ROOT, dir))) {
      const rel = path.relative(ROOT, file);
      if (EXEMPT.test(rel)) continue;
      fs.readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          for (const match of line.matchAll(PATTERN)) {
            hits.push({ file: rel, line: i + 1, snippet: match[0].trim() });
          }
        });
    }
  }
  return hits;
}

const hits = scan();

if (process.argv.includes("--list")) {
  for (const h of hits) console.log(`${h.file}:${h.line}  ${h.snippet}`);
  console.log(`\n${hits.length} inline colour style(s).`);
} else if (hits.length > 0) {
  console.error(
    `Inline colour styles found (${hits.length}) — these bypass both design gates:\n` +
      hits.map((h) => `  ${h.file}:${h.line}  ${h.snippet}`).join("\n") +
      `\n\nUse a token class, or hsl(var(--token)) for a library that needs a string.`,
  );
  process.exit(1);
} else {
  console.log("No inline colour styles outside the resume builder.");
}
