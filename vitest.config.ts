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
      include: [
        "app/**/validation.ts",
        "app/**/validate.ts",
        "app/**/route.ts",
        "components/auth/auth-back-button/index.tsx",
        "components/auth/logout-confirmation-dialog/index.tsx",
        "components/message/message-input/attachment-strip/index.tsx",
        "components/message/message-input/reply-preview/index.tsx",
        "components/moderation/user-moderation-menu/index.tsx",
        "components/profile/profile-completion-card/index.tsx",
        "components/search/search-bar/index.tsx",
        "components/search/search-error-card/index.tsx",
        "components/setting/appearance-section/theme-card/index.tsx",
        "components/employee/employee-signup-form/smart-resume-upload/index.tsx",
        "components/utils/onboarding/onboarding-flow.tsx",
        "components/ui/button.tsx",
        "components/ui/input.tsx",
        "components/utils/data-display/availability-badge.tsx",
        "components/utils/dialogs/remove-alert-dialog.tsx",
        "hooks/**/*.ts",
        "lib/**/*.ts",
        "middleware.ts",
        "stores/**/*.ts",
        "utils/**/*.ts",
      ],
      exclude: [
        "**/*.{test,spec}.{ts,tsx}",
        "**/*.d.ts",
        "**/index.ts",
        "utils/constants/**",
        "utils/interfaces/**",
        "utils/types/**",
      ],
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      thresholds: {
        statements: 82,
        branches: 60,
        functions: 85,
        lines: 84,
      },
    },
  },
});
