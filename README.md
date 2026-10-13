<div align="center">

# Apsara Talent — Web

**The web app for Apsara Talent, a recruitment platform that connects professionals and companies through profiles, matching, messaging, interviews, and AI-assisted resume tools.**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

</div>

---

## Overview

Apsara Talent Web is the Next.js frontend for Apsara Talent, a Cambodia-focused hiring platform. Employees and companies create rich profiles, discover each other through a feed and search, match, chat in real time, schedule interviews, and build resumes with AI help. It is fully localized in English and Khmer.

## Features

- **Onboarding:** email, phone-number and OTP login, email verification, password reset, and multi-step sign-up for employees and companies.
- **Discovery:** profile feed, employee and company search, favorites, and matching.
- **Real-time messaging** over Socket.IO, with emoji support.
- **Interviews and dashboard** for tracking hiring activity, with charts.
- **AI resume builder** with editable drafts and templates.
- **Profiles and settings** for employees and companies, including image cropping and drag-and-drop ordering.
- **Notifications,** including Firebase web push.
- **Admin console** for users, reports, and audit.
- **Public pages:** product, learn, safety, support, privacy, and terms.
- **Quality tooling:** Vitest, Playwright end-to-end and accessibility tests, a design-token checker, Sentry, and Knip.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router), React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS, Radix UI |
| State management | Zustand |
| Forms and validation | React Hook Form, Zod |
| Internationalization | next-intl (English and Khmer) |
| Real-time and push | Socket.IO client, Firebase Cloud Messaging |
| Charts and animation | Recharts, GSAP |
| Monitoring | Sentry |
| Testing | Vitest, Testing Library, Playwright, axe-core |
| Deployment | Vercel and Docker (standalone output) |

## Getting Started

### Prerequisites

- Node.js 20.9 or newer, npm 10 or newer
- A running [Apsara Talent API](https://github.com/RithyBondeth/ApsaraTalent-Api)

### Installation

```bash
git clone https://github.com/RithyBondeth/ApsaraTalent-Web.git
cd ApsaraTalent-Web
npm ci
cp .env.example .env
npm run dev
```

Open [http://localhost:4000](http://localhost:4000).

### Environment Variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | API gateway base URL |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web config and the web-push VAPID key |
| `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN` | Error monitoring |

Run `npm run check:env` to validate your configuration. See [`.env.example`](.env.example) for every variable.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check the project |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run end-to-end tests against a production build |

## Project Structure

```text
ApsaraTalent-Web/
├── app/
│   ├── (auth)/       # login, signup, forgot and reset password
│   ├── (main)/       # dashboard, feed, search, matching, message, interview,
│   │                 # resume-builder, profile, favorite, notification, setting
│   ├── (admin)/      # Admin console
│   ├── (landing)/    # product, learn, safety, support
│   └── (legal)/      # privacy, terms
├── components/       # Shared and feature components
├── hooks/            # Reusable client hooks
├── stores/           # Zustand state and API integrations
├── language/         # English and Khmer translations
└── utils/            # Types, validation, constants, utilities
```

## Related Repositories

- [ApsaraTalent-Api](https://github.com/RithyBondeth/ApsaraTalent-Api): the NestJS microservices backend
- [ApsaraTalent-Mobile](https://github.com/RithyBondeth/ApsaraTalent-Mobile): the Flutter mobile app

## Author

**Rithy Bondeth** — Full Stack Developer & AI Engineer

[![Portfolio](https://img.shields.io/badge/Portfolio-0A0A0A?style=for-the-badge&logo=vercel&logoColor=white)](https://bondeth.dev)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RithyBondeth)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rithy-bondeth-484073282/)

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
