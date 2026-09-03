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

### Icon imports
`lucide-react` exports every icon three ways — `Home`, `HomeIcon` and
`LucideHome`. Use the **`Lucide*` alias**. The codebase had drifted across all
three (455 / 237 / 4) with 31 files mixing conventions inside one import block;
the prefix also keeps icons picked out in the import lists here that run past
thirty symbols. `no-restricted-syntax` in `eslint.config.mjs` fails the build on
the other two spellings.

Brand marks are the exception and do not come from Lucide at all: it has no
Google icon and has **deprecated its brand set for removal in v1.0**. Those live
in `components/utils/brand` — `LoginMethodIcon` for auth providers,
`PlatformIcon` for social links — backed by Simple Icons, with in-house glyphs
for LinkedIn (dropped from Simple Icons after a trademark request). All render
in `currentColor`; the full-colour raster logos stay on the OAuth buttons in
`(auth)/login`, where Google's branding terms apply.

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
- The UI is square: `rounded-none` everywhere, `rounded-full` only for avatars,
  dots and pills. `--radius` is `0` so the shadcn primitives agree.

### Elevation
Elevation is a hard offset shadow with no blur, and it is a **four-step token
ladder** — never an arbitrary value:

- `shadow-hard-xs` — inline controls, chips
- `shadow-hard-sm` — a surface nested inside an already-raised one
- `shadow-hard` — the default: cards, panels, list items
- `shadow-hard-lg` — floats over the page: dialogs, sheets, popovers
- `shadow-hard-primary` / `-primary-xs` — a filled-cobalt surface (the active
  nav item, a selected setting card) casting its own hue instead of grime

They resolve from `--elevation-*` in `globals.css`, which raises the alpha in
dark mode — a near-white shadow at the light-mode 5.5% is invisible on a
6%-lightness page. `npm run check:elevation` ratchets hand-written
`shadow-[…]` values; the six that remain are deliberate *glows* (the button's
coloured hover bloom, the scroll-to-top pill, the landing device panel), which
describe light rather than height.

### Accent edges
**Ink is structure. Cobalt is interaction.** A surface gets an ink edge because
it is a surface; it gets a cobalt one only when the blue is carrying
information.

Two widths, and they are not interchangeable:

- **`border-*-[5px]`** — a *surface* accent, and now **only ever semantic**.
  A card, panel or dialog does not get one for being a card, panel or dialog;
  it gets a plain `border border-border` hairline and its `shadow-hard`.
- **`border-*-[4px]`** — an *inline* accent: a passage of content inside a
  surface. Callouts, quote blocks, chat rows. **Semantic only, same as the
  5px** — 12 decorative ink ones were flattened alongside the surface slabs
  (message bubbles, the typing indicator, dashboard rows, three form callouts
  and the chat skeletons that mirrored them).

A message bubble is the clearest case of why. The sender's bubble is a solid
`bg-primary` fill and the recipient's is `bg-card` — the fill already tells you
whose message it is, so the ink bar on the recipient was restating it in a
second visual language. The chat input is the counter-example and kept its 4px:
its resting edge is now `border-border` and it turns `primary` on focus, so the
width is there to make the focus state legible rather than to decorate.

The 5px slab used to be the default dress for every surface — 67 of them,
against 3 that meant anything. Twenty stacked down a feed page stopped reading
as emphasis and became texture, and they drowned the handful of edges that
carry information: the reason a page banner has one is that it is the *only*
one on the page. All 67 are now hairlines. The survivors are listed below,
plus three dynamic ones (skill-gap severity, the dropzone, the dev
design-system header) whose colour is computed rather than fixed.

If you are adding a surface accent, the question is not "does this look
important" — it is "does the colour of this edge tell the reader something the
rest of the card does not". If it doesn't, it's a hairline.

Cobalt is reserved for these, and nothing else:

| | |
|---|---|
| `PageBanner` | page identity — the one cobalt edge per page |
| `PageState` | blue empty vs red error; the colour *is* the state |
| active chat row, focused message input | selected / focus state |
| AI-suggestion callouts | paired with `bg-primary/5` — marks generated content |
| interview / resume-upload state | success and error surfaces |

`.auth-scope` and `.landing-scope` used to redefine the neutrals to a warm
paper-cream, so their ink read as brown rather than charcoal. That split is
gone: both scopes now inherit the base palette and declare only
`--auth-paper`/`--auth-ink`, the brand panel's opposing pair. The warmth was
not worth what it cost — `check:contrast` parsed only `:root` and `.dark`, so
~15 tokens per scope were ungated, and `--input` had collapsed onto the
hairline `--border`, leaving the login and signup fields at 1.25:1 against the
page where WCAG 1.4.11 asks 3:1. The gate now parses the scope blocks too
(`SCOPES` in `scripts/check-contrast.mjs`); add a scope there the moment you
add one to `globals.css`, or it inherits the same blind spot.

The reason for the split: `--primary` is also every button fill, every link and
the focus ring. A decorative cobalt rule competes with the actual affordances
for the same attention — on the settings page, a blue bar over the "About" card
was louder than the "View →" links inside it, which were the only clickable
things there. Five cards on that page each wore one, so the accent had stopped
distinguishing any surface and become a texture. 26 decorative accents moved to
ink; 10 semantic ones kept the blue.

### Stacking order
There is a ladder. Stay on it rather than inventing a number:

| | |
|---|---|
| `z-10`–`z-40` | content that overlaps within a card or section |
| `z-50` | both page headers, sheets, dialog surface and overlay |
| `z-[60]` | `ScrollProgressBar` — above the headers, below anything modal |
| `z-[100]` | skip link, the incoming-call modal |
| `z-[110]` | the dialog close button |

The scroll bar sat at `z-[9999]` for a while, which painted a stripe across the
top of an open dialog's scrim. A number that large is a sign someone was
fighting a stacking context rather than reading the ladder.

### Scroll progress
One component — `ScrollProgressBar` (`components/utils/layout`) — for the
landing, legal and signed-in pages alike. It writes `transform` straight to the
node inside a rAF; scrolling a long page otherwise re-renders it sixty times a
second. Under reduced motion it drops the easing but **still reports progress**:
progress is information, not decoration. The GSAP version this replaced left
the bar at `scale-x-0` forever for those readers, so they saw nothing at all.

### Page banners
- Every signed-in page's banner is `PageBanner`
  (`components/utils/layout/page-banner`): an eyebrow, headline, subtitle, and up
  to three optional `stats` (a page's already-loaded counts). Legal and landing
  sub-pages use `StaticPageShell`, which now renders that same `PageBanner`
  inside its hero band — it is the banner everywhere, signed in or out.
  `StaticPageArtworkSlot` is gone: the shell's hero used to be a two-column
  split whose right half held a decorative artwork box, the page number as
  "06 / 06", the title twice over, and four of the sidebar's contents links —
  no information that wasn't already on screen, for 45% of the banner and 110%
  of the fold at 375px. The space now carries document metadata (last updated,
  section count, reading time), the same trade the hero illustrations made.
- **No banner illustrations.** They were removed on purpose — the SVGs ran
  146–320 KB, preloaded with `priority`, took ~68% of the mobile fold, and used
  no `currentColor` so they couldn't follow the theme. Don't reintroduce a hero
  image; give the space to real data via `stats` instead.
- Withhold `stats` until the data has loaded (pass `undefined`, not zeroes) so a
  placeholder "0" doesn't flash and reflow.
- The loading shape is `PageBannerSkeleton`, beside `PageBanner`. It carries the
  *same* wrapper classes as the real banner, and `page-banner-parity.test.tsx`
  fails if the two ever diverge. Pass `stats={n}` only for pages that hand the
  banner its counts on first paint — a skeleton that draws a stats column the
  banner won't have is the reflow the placeholder exists to prevent.
- This replaced `FeedBannerSkeleton`, which had been left behind by the hero
  removal: it still drew a 280px two-column grid with a dark `bg-foreground`
  artwork panel, so six pages loaded with a shape they were never going to
  show. Nothing in the type system ties a component to its skeleton, so when
  you change a page's layout, change its skeleton in the same commit.

### Dialogs
`DialogContent` owns the surface — square corners, the 5px ink top edge,
`shadow-hard-lg`, the square close button. Call sites had been restating all
of it and disagreeing while they did (five swapped the accent to
`border-t-foreground`, four fell back to `shadow-2xl`/`shadow-lg`, five undid
the round close button with `[&>button]:rounded-none`).

Only two shapes exist, as variants rather than class strings:

- `variant="default"` — padded body: a title, some copy, a footer
- `variant="flush"` — the dialog draws its own header/body/footer bands

plus `size` (`sm`/`md`/`lg`/`xl`/`full`) and `hideClose`. Widths, heights and
scroll containers still go through `className`; the *surface* does not. `Sheet`
is the same surface on a slide-in, and shares the scrim and elevation.

### Colour
All colour lives in CSS custom properties in `app/globals.css` and is exposed
through `tailwind.config.ts`.

The palette is a port of Notion's. Neutral-first and near-monochrome: a pure
white page, warm-grey ink (`#37352F`), quiet surfaces (`#F7F6F3`, `#F1F1EF`),
and colour only where something is interactive or a label differs in kind.
`--primary` is Notion's action blue. Dark mode is their `#191919` page with the
`#202020` / `#2F2F2F` / `#373737` surface steps, which clear the ladder below
as they ship.

Two places deviate from Notion's literal values, both because this repo gates
contrast and Notion does not: their action blue is 3.88:1 on white (so a white
button label sits under AA) and several of their text colours land at 4.26–4.49.
Every such token is nudged in lightness — **hue and saturation untouched**, so
it still reads as the Notion colour — by the smallest step that clears the
threshold. `--primary` is `#1C78D2` rather than `#2383E2` for exactly this
reason; don't "correct" it back.

The page, cards and popovers are all `0 0% 100%` in light mode, so a card is
delineated by its `--border` hairline and its hard offset shadow rather than by
a lightness step. `check:contrast` gates that border pair (`card edge against
the page`, 1.3) in place of the light-mode surface ladder, which is now empty.

Shape is not part of this: the square corners, the hard offset shadow ladder
and `--radius: 0` are the app's own and were left alone.

**Never write a raw palette class** — `bg-green-100`,
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
- **Categorical** — `category-{brown,orange,purple,pink,gray,blue}` with
  `-accent` and `-subtle`, for labels that differ in *kind*: notification type,
  company benefits (pink) and values (gray), employee availability
  (brown/orange/purple via `AvailabilityBadge`). Never borrow a status colour
  for these — spending amber on "freelance" is what stops a real warning from
  standing out.

  These are six of Notion's nine block colours, and they are named after them.
  The other three — green, yellow and red — are spoken for by `success`,
  `warning` and `destructive`, which is why the categorical set has no green
  and no red: a category must never be mistakable for a state. The slots were
  previously named violet/magenta/teal/orange/indigo/lime, hues picked to sit
  apart on the wheel rather than to come from anywhere.

  **A label is neutral until its colour carries information.** Skill tags,
  career scopes, languages, availability and open-position titles all go through
  `Tag`, which is neutral, full stop. `Tag` used to pick a categorical hue by
  hashing the label's character codes, so "Python" was indigo and "React" orange
  for no readable reason — and it collided with the hues that *do* mean
  something (a skill hashing to indigo was the same fill and text as a benefit
  chip). Every reading surface had already opted out via a `neutral` flag before
  the hash was retired; don't reintroduce colour-by-hash. `BenefitValueChip`
  (`components/utils/data-display/benefit-value-chip`) is the one categorical
  chip, the same way `StatusPill` is the one status pill.

Every token resolves per theme on its own, so **token classes never take a
`dark:` variant**. Seeing one is a sign someone reintroduced a second palette.

Tailwind only compiles class names it can see spelled out, so build lookup maps
with literal strings — `` `bg-${status}-subtle` `` silently compiles to nothing.
`StatusPill` (`components/utils/data-display/status-pill`) already covers the
common status-badge case.

- **Scrim** — `scrim`, the veil behind a modal. Deliberately not derived from
  `--foreground`: that token inverts per theme, so `bg-foreground/80` would put
  a *white* wash over the page in dark mode. Use `bg-scrim/80`, never
  `bg-black/80`.

- `npm run check:design` gates four things: `check:contrast` re-derives every
  token pair's WCAG ratio from `globals.css` — including the scoped palettes —
  and fails if one drops below threshold; `check:tokens` is a ratchet on raw
  palette classes; `check:elevation` is a ratchet on hand-written shadows; and
  `check:inline-colors` fails on any `style={{ color: … }}` outside the resume
  builder. Both ratchets may go down but never up (`--list` to see what's left,
  `--update` after migrating a file).
- **Colour goes in a class, never an inline style.** The first three gates all
  read class names or `globals.css`, so a `style={{ color }}` is invisible to
  every one of them — which is how the match-score badge, the score ring and the
  dashboard radial all shipped raw hex that failed AA as text in light mode
  (2.15–3.76:1) and could not follow the theme, while both ratchets reported
  "holding". When a library insists on a colour string, pass
  `hsl(var(--token))`; recharts accepts it.
- `app/design-system` renders every token and primitive in both themes. Dev
  only — it `notFound()`s in production.

### Public pages and SEO
`/jobs/[jobId]` is the app's only indexable content route, and the reason the
SEO surface exists at all. It is outside every route group so nothing in
`middleware.ts` matches it — anything not listed as an auth, protected or
landing route is public by default.

- `app/sitemap.ts` and `app/robots.ts` are Next file conventions. The sitemap
  lists only pages a signed-out visitor can reach; submitting authenticated
  routes trains search engines to distrust it. Both read `siteUrl()`
  (`utils/functions/seo`), which needs `NEXT_PUBLIC_SITE_URL` in production or
  it falls back to localhost.
- `metadataBase` in `app/layout.tsx` is what makes `alternates.canonical` and
  the OG URLs absolute. Without it Next emits relative ones, which crawlers and
  link unfurlers both ignore.
- The `JobPosting` JSON-LD (`utils/functions/seo/job-posting-json-ld.ts`) is
  what puts a posting into Google Jobs — the visible markup is not read for
  that. It is emitted from the server component so it is in the initial HTML.
  Employment types are mapped to schema.org's controlled vocabulary and an
  unmappable one is **omitted**, because a value outside that set invalidates
  the whole posting.
- Job descriptions render with `whitespace-pre-line`, never a markdown
  renderer. They are plain text a company typed, served to anonymous visitors.

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