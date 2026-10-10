# Apsara Talent Web

The Next.js frontend for Apsara Talent, a Cambodia-focused platform connecting professionals and companies through profiles, matching, messaging, interviews, and AI-assisted resume tools.

## Requirements

- Node.js 20.9 or newer
- npm 10 or newer
- A running Apsara Talent API

## Setup

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The development server runs at [http://localhost:4000](http://localhost:4000).

## Checks

```bash
npm run check:env
npm run lint
npm test
npm run build
npm run test:e2e
```

`test:e2e` builds and starts the standalone production server unless `E2E_SKIP_BUILD=1` is set.

## Main directories

- `app` — Next.js routes, layouts, and route-level UI
- `components` — shared and feature components
- `hooks` — reusable client hooks
- `stores` — Zustand state and API integrations
- `utils` — types, validation, constants, and utilities
- `language` — English and Khmer translations
- `assets` — source-controlled images imported by the application
- `public` — files that must be served directly from the site root

## Environment

Copy `.env.example` to `.env.local` and provide the required API, Firebase, and monitoring values. Do not commit local environment files or credentials.

## Deployment

The repository supports Vercel and a standalone Docker image. Production builds use Next.js standalone output.

The deployment workflow checks the versioned gateway and all eight readiness dependencies before building and promoting. It deploys with `--skip-domain`, verifies the immutable production build (using `VERCEL_AUTOMATION_BYPASS_SECRET` if protected), then promotes that same build and checks the public domain. A failed post-promotion check triggers rollback. `npm run test:release` tests the API gate; `NEXT_PUBLIC_API_URL=... node scripts/verify-api.mjs` probes an origin without deploying.

## Verified mobile links

Set these public association values in the Vercel production environment:

- `ANDROID_APP_ID`: the existing registered Android application ID.
- `ANDROID_APP_LINK_SHA256`: comma-separated SHA-256 fingerprints from Play Console's **app signing certificate**, or the signing certificate for a directly distributed build. The upload certificate alone does not verify a Play-installed app.
- `IOS_BUNDLE_ID`: the existing registered iOS bundle ID.
- `IOS_APP_ID_PREFIX`: the Apple application identifier prefix (usually the team ID; check the provisioning profile).

The public `/.well-known/assetlinks.json` and `/.well-known/apple-app-site-association` routes return JSON without redirects. Until valid identities are configured they return an uncached 503, preventing publication of placeholder associations. iOS links are restricted to `/jobs/*`, `/unsubscribe`, and `/reset-password`.

## Real browser/native acceptance

Start the sibling workspace's disposable API stack with `LOCAL_WEB_PORT=14000 node local-test/start.mjs`. Then, with an iOS simulator or Android emulator running:

```sh
ACCEPTANCE_DEVICE=<device-id> npm run test:acceptance:local
```

The runner creates one temporary draft, signs in through the browser and native UI, edits it in each client, verifies revision-conflict protection and design preservation, and deletes its fixture. It only accepts loopback origins and running simulators/emulators. Results, browser/native screenshots, and the native log are saved under `test-results/cross-platform/`; set `ACCEPTANCE_OUTPUT_DIR` to keep separate platform runs. This requires the sibling mobile checkout and Flutter on PATH. Set `ANDROID_HOME` or `ACCEPTANCE_ADB` if SDK tools are elsewhere. The disposable test app remains installed to collect screenshots. The test is separate from mocked Playwright journeys and does not test external providers or push delivery.
