# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (runs on port 4000 with Turbopack)
- **Build**: `npm run build`
- **Production**: `npm start`
- **Linting**: `npm run lint`
- **Formatting**: `npm run format` (write) / `npm run format:check` (CI gate)
- **Type checking**: `npm run typecheck`
- **Unit tests**: `npm test` / `npm run test:coverage`
- **E2E tests**: `npm run test:e2e`

## Project Overview

Apsara Talent is a Next.js 15 talent platform application connecting companies and employees with matching, messaging, and resume building features. The application uses TypeScript, Tailwind CSS, and Zustand for state management.

## Architecture

### Framework & Stack
- **Frontend**: Next.js 15 App Router with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence (localStorage/sessionStorage)
- **UI Components**: Radix UI with custom shadcn/ui components
- **Real-time**: Socket.io for messaging, Firebase Firestore for chat
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Custom JWT with cookie-based sessions

### Directory Structure

```
app/
├── (auth)/          # Authentication routes (login, signup, forgot-password)
├── (main)/          # Protected main application routes
    ├── feed/        # User feed and profile views
    ├── matching/    # Company-employee matching system
    ├── message/     # Real-time messaging
    ├── profile/     # User profile management
    ├── search/      # Search functionality
    └── resume-builder/ # AI-powered resume generation

components/
├── ui/              # Reusable shadcn/ui components
├── company/         # Company-specific components
├── employee/        # Employee-specific components
├── utils/           # Shared presentational components (typography, themes,
│                    # dialogs, layout) — note this holds components, not the
│                    # pure helpers that live in the root `utils/`
└── [feature]/       # Feature-specific component groups

stores/
├── apis/            # API store modules organized by feature
├── contexts/        # Global state contexts
├── features/        # Client-side feature state (chat, call)
├── shared/          # Persistence keys, storage, shared error mapping
├── languages/       # Language store
└── themes/          # Theme management

utils/
├── auth/            # Cookie/session helpers
├── constants/       # API URLs and application constants
├── functions/       # Pure helper functions, grouped by domain
├── interfaces/      # TypeScript interfaces
└── types/           # TypeScript type definitions

lib/                 # Third-party client setup (axios, firebase, cn)
hooks/               # React hooks, grouped by domain
language/            # next-intl message catalogues (en, km)
assets/              # SVG/image assets imported by components
tests/               # E2E specs, shared helpers, vitest setup
scripts/             # Node maintenance and verification scripts
```

### Authentication System
- JWT-based authentication with refresh tokens
- Dual storage strategy: localStorage (remember me) + sessionStorage
- Cookie-based session management for middleware
- Protected routes enforced via Next.js middleware
- Social login integration (Google, Facebook, LinkedIn, GitHub)

### State Management Patterns
- Zustand stores organized by feature and API endpoints
- Persistence layer with storage selection based on user preference
- Centralized error handling and loading states
- Separate stores for authentication, user data, and business logic

### UI Component System
- shadcn/ui components as base layer
- Custom typography components with consistent styling
- Theme system with dark/light mode support
- Responsive design with custom breakpoints for mobile-first approach
- Component-specific skeleton loaders

### API Integration
- Axios-based HTTP client with centralized configuration
- Store-based API state management
- Consistent error handling across all API calls
- Organized API URLs by feature domain

### Real-time Features
- Socket.io integration for live messaging
- Firebase Firestore for chat persistence
- Real-time notifications and updates

## Development Guidelines

### File Naming Conventions
- Directories and files are kebab-case
- A component lives in its own directory as `index.tsx`, with its prop types in
  a sibling `props.ts` (always plural, always `.ts` — props files carry no JSX)
- Route-level Zod schemas are always `validation.ts`, never `validate.ts`
- Constants files end in `.constant.ts`, interfaces in `.interface.ts`, types in
  `.type.ts`, Zustand API stores in `.store.ts`
- Unit tests sit next to their subject and are named after it
  (`search-bar.test.tsx`), never `index.test.tsx` — the filename is what shows
  up in test output, so it has to identify the subject on its own

### Utility Imports
- Every subdirectory of `utils/functions/` has a barrel beside it
  (`utils/functions/date/` ↔ `utils/functions/date.ts`)
- Import helpers through the barrel (`@/utils/functions/date`), not the deep
  module path. Add new modules to the barrel when you create them.
- Interfaces and types are the exception: import those from their concrete
  file (`@/utils/interfaces/user/company.interface`)

### Formatting
- Prettier owns all formatting; ESLint defers to it via `eslint-config-prettier`
- `npm run format:check` gates CI, so run `npm run format` before pushing
- `prettier-plugin-tailwindcss` sorts Tailwind classes. It also *trims* string
  literals, so never rely on a leading/trailing space inside one to separate
  classes — `` `base${x ? " extra" : ""}` `` silently becomes `baseextra`.
  Use `cn("base", x && "extra")` for conditional classes.

### Component Organization
- Components are organized by feature domain (company, employee, matching, etc.)
- Each component directory includes index.tsx, props.ts, and skeleton.tsx when applicable
- UI components follow shadcn/ui patterns and conventions

### State Management
- Use feature-specific Zustand stores in `stores/apis/[feature]/`
- Implement loading and error states consistently
- Follow the established persistence patterns for authentication

### Styling
- Use Tailwind CSS with the established design system
- Custom breakpoints are defined for responsive design

**Radius is by role, not global.** `--radius` is `0.5rem`, so the shadcn ladder
resolves to `lg` 8px / `md` 6px / `sm` 4px.

- **Structural cells are square.** Anything that is a cell of the ruled sheet —
  a card in a `.pixel-ruled` grid, a band, a record strip, a mosaic tile — takes
  `rounded-none`. A cell of a grid has no corner of its own.
- **Interactive controls take `rounded-md`** (6px): buttons, inputs, selects,
  tabs. **Floating overlays take `rounded-xl`** (12px): dialog, popover,
  dropdown, sheet, command, toast. Status pills take `rounded` (4px).
- `rounded-full` stays reserved for avatars and bare status dots.

This was measured off mistral.ai per element role, not assumed. Counting raw
elements suggests "square everything" — but that count is dominated by layout
divs. By role their buttons are 6px, pills 6–8px and floating panels 12–16px.
An earlier pass here read the aggregate and squared the whole UI, then had to
be undone; don't redo that.

**Elevation is flat.** Their pages carry 2–3 shadowed elements out of several
thousand. Separation is a 1px hairline. The only shadow in the system is
`.pixel-overlay-shadow` — a four-layer ambient at 2% alpha, for floating
overlays only. There is no hard offset shadow and nothing moves on press.

**Weight tops out at 500.** Display face 500, body 400, mono 400–500. Hierarchy
comes from size, colour and typeface, never from bold.

### Page banners
- Every signed-in page's banner is `PageBanner`
  (`components/utils/layout/page-banner`): an eyebrow, headline, subtitle, and up
  to three optional `stats` (a page's already-loaded counts). Legal/landing pages
  use `StaticPageShell` with a themeable `StaticPageArtworkSlot`, never a raster.
- **No banner illustrations.** They were removed on purpose — the SVGs ran
  146–320 KB, preloaded with `priority`, took ~68% of the mobile fold, and used
  no `currentColor` so they couldn't follow the theme. Don't reintroduce a hero
  image; give the space to real data via `stats` instead.
- Withhold `stats` until the data has loaded (pass `undefined`, not zeroes) so a
  placeholder "0" doesn't flash and reflow.

### Colour
All colour lives in CSS custom properties in `app/globals.css` and is exposed
through `tailwind.config.ts`. **Never write a raw palette class** — `bg-green-100`,
`text-amber-700`, `dark:bg-red-900/30`. They hardcode a hue, need a hand-written
`dark:` twin, and drift between files.

Three groups of tokens:

- **Neutral** — `background`, `card`, `popover`, `muted`, `border`, `input`,
  `primary`, `secondary`, `accent`. `--border` is decorative; `--input` bounds
  interactive controls and is deliberately darker to hold 3:1 (WCAG 1.4.11).
  Don't collapse them back into one value.
- **Status** — `success`, `warning`, `info`, `destructive`, for severity.
  Five roles each: the bare token is the solid fill, plus `-foreground` (on that
  fill), `-accent` (text on page/card/subtle), `-subtle` (tinted surface) and
  `-border`. Example: `bg-success-subtle text-success-accent border-success-border`.
- **Categorical** — `category-{violet,magenta,teal,orange,indigo,lime}` with
  `-accent` and `-subtle`, for labels that differ in *kind*: notification type,
  employment type, skill tags. Never borrow a status colour for these — spending
  amber on "freelance" is what stops a real warning from standing out.

Every token resolves per theme on its own, so **token classes never take a
`dark:` variant**. Seeing one is a sign someone reintroduced a second palette.

Tailwind only compiles class names it can see spelled out, so build lookup maps
with literal strings — `` `bg-${status}-subtle` `` silently compiles to nothing.
`StatusPill` (`components/utils/data-display/status-pill`) already covers the
common status-badge case.

- `npm run check:design` gates both halves: `check:contrast` re-derives every
  token pair's WCAG ratio from `globals.css` and fails if one drops below
  threshold; `check:tokens` is a ratchet on raw palette classes that may go down
  but never up (`--list` to see what's left, `--update` after migrating a file).
- `app/design-system` renders every token and primitive in both themes. Dev
  only — it `notFound()`s in production.

### API Development
- API URLs are centralized in `utils/constants/apis/`
- Store methods should handle loading, error, and success states
- Follow the established patterns for async operations

### Route Protection
- Protected routes are defined in middleware.ts
- Authentication state is managed through multiple storage mechanisms
- Route access is controlled based on user authentication status

## Key Dependencies

- **Next.js 15**: App Router, TypeScript, Image optimization
- **Zustand**: State management with persistence
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **React Hook Form + Zod**: Form handling and validation
- **Axios**: HTTP client
- **Firebase**: Real-time database for chat
- **Socket.io**: Real-time communication
- **Lucide React**: Icon system