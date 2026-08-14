/**
 * Generate TypeScript types from the API's OpenAPI spec.
 *
 * The API and the web live in separate repositories, so nothing structurally
 * kept `utils/interfaces/**` in step with `libs/contracts`. They drifted: the
 * API sent `company: {}` for employees while the web's IUser declared
 * `ICompany | null`, and `profileCompleted` was in every response without being
 * declared anywhere. Generating from the spec removes the whole class.
 *
 * Usage:
 *   npm run api:types           # regenerate (needs the API running)
 *   npm run api:types:check     # fail if the committed file is out of date
 *
 * The API must be running locally, or API_SPEC_URL must point at an instance
 * with Swagger enabled. The generated file is committed so builds and CI never
 * need a live API — only the check does.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";

const run = promisify(execFile);

const SPEC_URL = process.env.API_SPEC_URL ?? "http://localhost:3000/docs-json";
const OUTPUT = path.join("utils", "interfaces", "generated", "api.ts");
const checkOnly = process.argv.includes("--check");

async function main() {
  const previous = await fs.readFile(OUTPUT, "utf8").catch(() => null);

  if (checkOnly && previous === null) {
    console.error(`${OUTPUT} does not exist. Run: npm run api:types`);
    process.exit(1);
  }

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });

  try {
    await run("npx", ["openapi-typescript", SPEC_URL, "-o", OUTPUT]);
  } catch (error) {
    console.error(`Could not read the OpenAPI spec at ${SPEC_URL}`);
    console.error(
      "Is the API running? (cd ../ApsaraTalent-Api && ./scripts/dev/run.sh)",
    );
    console.error(error.stderr || error.message);
    process.exit(1);
  }

  if (!checkOnly) {
    console.log(`Generated ${OUTPUT} from ${SPEC_URL}`);
    return;
  }

  const current = await fs.readFile(OUTPUT, "utf8");
  if (current === previous) {
    console.log("API types are up to date.");
    return;
  }

  // Restore the committed file so a failed check leaves no working-tree change.
  await fs.writeFile(OUTPUT, previous);
  console.error(
    `${OUTPUT} is out of date — the API contract changed.\n` +
      "Run `npm run api:types` and commit the result.",
  );
  process.exit(1);
}

main();
