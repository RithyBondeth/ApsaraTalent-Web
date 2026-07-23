# Testing structure

Unit tests stay next to the source they protect. Small related stores may share
a category-level suite, while complex stores, hooks, and components should have
their own test file.

```text
app/, components/, hooks/, stores/, utils/
  feature.ts
  feature.test.ts

tests/
  helpers/       Reusable test-only factories and mocks
  fixtures/      Stable sample API and domain data
  integration/   Tests spanning multiple application modules
  e2e/           Authenticated browser journeys
  setup/         Shared Vitest environment setup
```

Use `*.test.ts` and `*.test.tsx` consistently. Shared setup should only provide
browser primitives such as storage, media queries, and observers. API responses,
socket behavior, and feature-specific mocks belong in the suite that uses them.

Commands:

- `npm test` runs the complete Vitest suite once.
- `npm run test:watch` runs Vitest in watch mode.
- `npm run test:ci` runs the suite with enforced coverage floors.
- `npm run test:coverage` produces text, HTML, and LCOV coverage reports for
  executable domain logic plus the critical components with interaction tests.
- `npm run test:e2e` builds and validates the standalone production runtime,
  including public pages, anonymous redirects, authenticated pages, onboarding,
  security headers, logout cookies, static assets, browser form journeys,
  successful mocked product flows, error recovery, responsive layouts,
  accessibility checks, performance budgets, visual regression, and the 404
  response. Desktop journeys run in Chromium, Firefox, and WebKit; the mobile
  matrix uses an emulated Pixel viewport.
- `npm run test:e2e:smoke` runs the fast HTTP-level standalone checks only.
- `npm run test:e2e:browser` runs Playwright and builds first unless
  `PLAYWRIGHT_SKIP_BUILD=1` is set.
- `npm run test:e2e:browser:ui` opens Playwright's interactive runner.

Reviewed visual baselines live beside the browser suite in
`tests/e2e/visual.spec.ts-snapshots`. Update them intentionally with
`npm run test:e2e:browser -- --update-snapshots` after reviewing a design
change.

Install the browser runtimes once on a new machine with
`npx playwright install chromium firefox webkit`. CI installs all three browser
engines and their Linux system dependencies automatically.
