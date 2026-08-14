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
- Theme variables are managed through CSS custom properties
- Color palette includes dynamic badge colors and comprehensive theme support

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