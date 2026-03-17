# Gemini Code Guide: ApsaraTalent Web

This document provides a comprehensive overview of the ApsaraTalent web application codebase, intended to be used as a guide for AI-assisted development.

## 1. Project Overview

ApsaraTalent is a professional networking platform for employees and employers, built as a modern web application.

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom theme.
- **UI Components**: A combination of custom components and primitives from [shadcn/ui](https://ui.shadcn.com/), using [Radix UI](https://www.radix-ui.com/) and [Lucide React](https://lucide.dev/guide/packages/lucide-react) for icons.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for global state.
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for schema validation.
- **API Communication**: [Axios](https://axios-http.com/) for making HTTP requests to the backend API.
- **Backend Integration**: The app authenticates against a backend service and uses [Firebase](https://firebase.google.com/) and [Socket.IO](https://socket.io/) for real-time features.
- **Linting & Formatting**: [ESLint](https://eslint.org/) is used for code quality, following `next/core-web-vitals` standards.

## 2. Project Structure

The project follows a feature-oriented structure, organized within the Next.js App Router.

-   **`app/`**: The core of the application, using Next.js App Router conventions.
    -   **`(auth)/`**: Contains all authentication-related pages (login, signup, etc.). This is a route group, so `(auth)` is not part of the URL path.
    -   **`(main)/`**: Contains the main application pages for authenticated users (feed, profile, etc.). This is also a route group.
    -   **`layout.tsx`**: The root layout, which sets up the global font (`Ubuntu`), the `ThemeProvider` for light/dark mode, and the `Toaster` for notifications.
-   **`components/`**: Contains all React components.
    -   **`ui/`**: Core UI components provided by `shadcn/ui` (e.g., `Button`, `Card`, `Input`).
    -   **Other subdirectories**: Components are organized by feature (e.g., `profile/`, `feed/`, `message/`).
-   **`lib/`**: Utility functions and libraries.
    -   **`axios.ts`**: Exports a pre-configured Axios instance with `withCredentials: true`. **All API calls should use this instance.**
    -   **`utils.ts`**: General utility functions, particularly for `shadcn/ui`.
-   **`hooks/`**: Custom React hooks for shared logic.
-   **`stores/`**: Global state management stores using Zustand.
-   **`utils/`**: Contains core utilities, including Firebase setup and authentication functions.
-   **`public/`**: Static assets like images and SVGs.
-   **`middleware.ts`**: Handles routing logic, protecting routes, and managing authentication redirects.

## 3. Running the Project

-   **Install Dependencies**:
    ```bash
    npm install
    ```
-   **Run Development Server**: The project uses Turbopack for faster development.
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:4000`.

-   **Build for Production**:
    ```bash
    npm run build
    ```

-   **Run Production Server**:
    ```bash
    npm run start
    ```

-   **Linting**:
    ```bash
    npm run lint
    ```

## 4. Development Conventions

-   **Path Aliases**: The project uses path aliases for cleaner imports. Always use them where appropriate.
    -   `@/*` points to the project root (`./*`).
    -   `@/components` -> `./components`
    -   `@/lib` -> `./lib`
    -   `@/hooks` -> `./hooks`
-   **Styling**:
    -   Use **Tailwind CSS** utility classes for all styling.
    -   The theme is defined in `tailwind.config.ts` and uses CSS variables for colors, borders, etc.
    -   The app supports both **light and dark modes** via `next-themes`.
-   **State Management**: For global state, use the Zustand stores defined in the `stores/` directory. For local component state, use `useState` or `useReducer`.
-   **API Requests**: Use the configured Axios instance from `lib/axios.ts` for all API calls. This ensures that authentication cookies are sent automatically with each request.
-   **Environment Variables**: Create a `.env.local` file for any necessary environment variables.

## 5. Authentication

-   Authentication is **cookie-based**. A JWT is stored in an `auth-token` HTTP-only cookie.
-   The `middleware.ts` file intercepts requests to manage access:
    -   It redirects unauthenticated users from protected routes (like `/feed` or `/profile`) to the `/login` page.
    -   It redirects already authenticated users from auth routes (like `/login`) to the `/feed`.
    -   It includes **role-based logic**. Users with a role of `"none"` in their JWT are considered to be in an onboarding state and will be redirected to `/signup/option` if they try to access protected routes.

By following these guidelines, we can ensure consistency and leverage the full power of the existing architecture for future development.
