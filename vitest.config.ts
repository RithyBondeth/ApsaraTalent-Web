import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "tests/e2e/**",
      "node_modules/**",
      ".next/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
    ],
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    clearMocks: true,
    coverage: {
      provider: "v8",
      // Whole directories, not a hand-maintained allowlist.
      //
      // This used to name ~25 individual component files. The thresholds below
      // looked strict, but they were computed over only the files someone had
      // remembered to add — 23 of 239 in components/, 2 of 101 in app/. A new
      // untested component could not lower coverage, because it was never in
      // the denominator. The gate could not fail for the reason gates exist.
      //
      // Measuring everything makes the number lower and true. Treat the
      // thresholds as a ratchet: raise them as coverage improves, never lower
      // them to make a build pass.
      include: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "hooks/**/*.ts",
        "lib/**/*.ts",
        "middleware.ts",
        "stores/**/*.ts",
        "utils/**/*.ts",
      ],
      exclude: [
        "**/*.{test,spec}.{ts,tsx}",
        "**/*.d.ts",
        "utils/constants/**",
        "utils/interfaces/**",
        "utils/types/**",
      ],
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      // A RATCHET, not a target. These are the real numbers measured across the
      // whole app on 2026-08-30, rounded down.
      //
      // They look like a collapse from the previous 82/60/85/84. Nothing got
      // worse and no test was deleted — those figures were computed over ~25
      // hand-listed files, so they described a curated sample rather than the
      // application. Measured over everything, coverage is what is written here.
      //
      //   statements 37.52%  (4449/11857)
      //   branches   26.56%  (2519/9483)
      //   functions  34.86%  (1155/3313)
      //   lines      38.40%  (4171/10861)
      //
      // Raise these as coverage improves. Never lower one to make a build pass:
      // that is precisely how the old numbers stopped meaning anything.
      thresholds: {
        statements: 37,
        branches: 26,
        functions: 34,
        lines: 38,
      },
    },
  },
});
