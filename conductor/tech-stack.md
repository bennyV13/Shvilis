# Tech Stack - Shvilis

## Core Technologies
- **Frontend Framework:** React 19
- **Build Tooling & Dev Server:** Vite
- **Programming Language:** TypeScript (configured with standard typechecking and modern ESLint rules)

## Styling & UI Components
- **CSS Utility Framework:** Tailwind CSS (v3)
- **UI Primitives:** Radix UI components (Primitives for dialogs, popovers, select dropdowns, etc.)
- **Icons:** Lucide React

## State Management & API Integration
- **Data Fetching & Caching:** TanStack React Query (v5)
- **Form Management:** React Hook Form + sonner (toast notifications)

## Backend & Database Services
- **Backend-as-a-Service:** Supabase
  - **Database:** PostgreSQL (with Row-Level Security policies enabled)
  - **Authentication:** Supabase Auth (Sign-in, Sign-up, JWT-based session management)
  - **Storage:** Supabase Storage (for uploading custom gear/food images if needed)

## Quality Assurance & Testing
- **Unit & Component Testing:** Vitest + React Testing Library + jsdom
- **End-to-End Testing:** Playwright
- **Linting & Code Quality:** ESLint + TypeScript ESLint

## Deployment & Monitoring
- **Hosting Platform:** Vercel
- **Error Tracking:** Sentry (Vite Plugin integration)

## Deviations & Notes
- **2026-06-21:** Upgraded React to v19 to match the default Vite TS template scaffolding.

