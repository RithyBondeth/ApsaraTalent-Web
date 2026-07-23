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
  security headers, logout cookies, static assets, and the 404 response.
