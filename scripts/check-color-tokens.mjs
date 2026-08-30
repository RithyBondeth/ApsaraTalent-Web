/**
 * Ratchet on raw Tailwind palette colours in component markup.
 *
 * The design tokens in app/globals.css only help if components actually reach
 * for them. A class like `bg-green-100 dark:bg-green-900/30` bypasses the whole
 * system: it hardcodes a hue, needs a hand-written dark twin, and drifts from
 * the next file that means the same thing (which is how "success" ended up
 * green in one place and emerald in another).
 *
 *   node scripts/check-color-tokens.mjs           # fail if the count grew
 *   node scripts/check-color-tokens.mjs --list    # show every remaining hit
 *   node scripts/check-color-tokens.mjs --update  # re-baseline after migrating
 *
 * BASELINE is the count at the time of the token migration. It may go down,
 * never up. When you migrate a file, run with --update and commit the change.
 *
 * Use instead:
 *   status  → success | warning | info | destructive, each with
 *             -foreground / -accent / -subtle / -border
 *   category→ category-{violet,magenta,teal,orange,indigo,lime}, each with
 *             -accent / -subtle
 *   neutral → background, card, popover, muted, border, input, primary
 *
 * See app/design-system (dev only) for all of them rendered side by side.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE_FILE = path.join(ROOT, "scripts", "color-token-baseline.json");

const SCAN_DIRS = ["app", "components", "utils", "hooks", "lib"];
const SKIP_DIRS = new Set(["node_modules", ".next", ".next-e2e", "coverage"]);
const EXTS = new Set([".ts", ".tsx"]);

const HUES =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const PREFIXES =
  "bg|text|border|ring|from|to|via|fill|stroke|shadow|decoration|outline|divide|accent|caret|placeholder";
const PATTERN = new RegExp(
  `\\b(?:${PREFIXES})-(?:${HUES})-(?:50|100|200|300|400|500|600|700|800|900|950)\\b`,
  "g",
);

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
      const lines = fs.readFileSync(file, "utf8").split("\n");
      lines.forEach((line, i) => {
        for (const match of line.matchAll(PATTERN)) {
          hits.push({ file: rel, line: i + 1, cls: match[0] });
        }
      });
    }
  }
  return hits;
}

function main() {
  const hits = scan();
  const count = hits.length;

  if (process.argv.includes("--list")) {
    const byFile = new Map();
    for (const h of hits) {
      if (!byFile.has(h.file)) byFile.set(h.file, []);
      byFile.get(h.file).push(h);
    }
    for (const [file, list] of [...byFile].sort(
      (a, b) => b[1].length - a[1].length,
    )) {
      console.log(`\n${file}  (${list.length})`);
      for (const h of list) console.log(`  ${h.line}: ${h.cls}`);
    }
    console.log(`\n${count} total across ${byFile.size} files.`);
    return;
  }

  if (process.argv.includes("--update")) {
    fs.writeFileSync(
      BASELINE_FILE,
      `${JSON.stringify({ baseline: count }, null, 2)}\n`,
    );
    console.log(`Baseline updated to ${count}.`);
    return;
  }

  const { baseline } = JSON.parse(fs.readFileSync(BASELINE_FILE, "utf8"));

  if (count > baseline) {
    console.error(
      `Raw palette colours went up: ${count} (baseline ${baseline}).\n\n` +
        `New markup should use design tokens rather than hues like bg-green-100.\n` +
        `  status:   success | warning | info | destructive  (+ -accent/-subtle/-border)\n` +
        `  category: category-purple | -magenta | -teal | -orange | -indigo | -lime\n\n` +
        `Run with --list to see every hit, or --update if you genuinely need to\n` +
        `raise the baseline. See app/design-system for the tokens rendered.`,
    );
    process.exit(1);
  }

  if (count < baseline) {
    console.log(
      `Raw palette colours down to ${count} (baseline ${baseline}).\n` +
        `Run "node scripts/check-color-tokens.mjs --update" to lock in the gain.`,
    );
    return;
  }

  console.log(
    `Raw palette colours holding at ${count} (baseline ${baseline}).`,
  );
}

main();
