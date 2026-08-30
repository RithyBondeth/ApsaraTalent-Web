/**
 * Ratchet on hand-written elevation in component markup.
 *
 * The UI casts a hard offset shadow with no blur. That was written out at
 * every call site as an arbitrary Tailwind value, and 34 distinct ones had
 * accumulated — offsets from 1px to 9px, alphas from 0.035 to 0.18 — so two
 * cards side by side sat at visibly different heights for no reason anyone
 * had decided. Four steps now live in app/globals.css as --elevation-*.
 *
 *   node scripts/check-elevation.mjs           # fail if the count grew
 *   node scripts/check-elevation.mjs --list    # show every remaining hit
 *   node scripts/check-elevation.mjs --update  # re-baseline after migrating
 *
 * Use instead:
 *   shadow-hard-xs   inline controls, chips
 *   shadow-hard-sm   a surface nested inside an already-raised one
 *   shadow-hard      the default — cards, panels, list items
 *   shadow-hard-lg   floats over the page — dialogs, popovers
 *   shadow-hard-primary(-xs)  a filled-cobalt surface casting its own hue
 *
 * The remaining hits are deliberate soft glows that are NOT elevation: the
 * button's coloured hover bloom, the scroll-to-top pill, the landing hero's
 * device panel. Those describe light, not height, so they keep their own
 * values — but the count may not grow.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASELINE_FILE = path.join(ROOT, "scripts", "elevation-baseline.json");

const SCAN_DIRS = ["app", "components"];
const SKIP_DIRS = new Set(["node_modules", ".next", ".next-e2e", "coverage"]);
const EXTS = new Set([".ts", ".tsx"]);

// Any arbitrary box-shadow written into markup, whatever its shape.
const PATTERN = /\bshadow-\[[^\]]+\]/g;

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
      fs.readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
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
      `Hand-written shadows went up: ${count} (baseline ${baseline}).\n\n` +
        `Elevation is four steps, not an arbitrary value per call site:\n` +
        `  shadow-hard-xs | shadow-hard-sm | shadow-hard | shadow-hard-lg\n` +
        `  shadow-hard-primary(-xs) for a filled-cobalt surface\n\n` +
        `Run with --list to see every hit, or --update if the new value is a\n` +
        `deliberate glow rather than elevation. See app/design-system.`,
    );
    process.exit(1);
  }

  if (count < baseline) {
    console.log(
      `Hand-written shadows down to ${count} (baseline ${baseline}).\n` +
        `Run "node scripts/check-elevation.mjs --update" to lock in the gain.`,
    );
    return;
  }

  console.log(
    `Hand-written shadows holding at ${count} (baseline ${baseline}).`,
  );
}

main();
