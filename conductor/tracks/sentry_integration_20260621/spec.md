# Specification - Sentry Integration

## Overview
This track introduces Sentry monitoring and error reporting to the Shvilis application, copying the setup from the Buddy_app project. Sentry will capture errors, track performance, record session replays for debugging, and provide a user feedback widget.

## Functional Requirements
1. **Sentry Initialization:**
   - Initialize Sentry at application startup (`src/main.tsx`).
   - Read the Sentry DSN from the environment variable `VITE_SENTRY_DSN`.
   - Setup session tracking using a unique session UUID stored in `sessionStorage` (sent as a tag `session_id`).
2. **Sentry Integrations:**
   - **Browser Tracing:** Performance monitoring.
   - **Session Replay:** Sample 100% of sessions for replays with text and media fully masked for privacy (`maskAllText: true`, `blockAllMedia: true`).
   - **User Feedback Dialog:** Configured with system theme and custom labels ("Report an Issue", "Submit Issue").
   - **Console Logging Integration:** Capture `log`, `warn`, and `error` console methods.
3. **Vite Plugin Integration:**
   - Integrate `@sentry/vite-plugin` in `vite.config.ts` to automatically build and upload source maps.
   - Read plugin configuration (`SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`) from build environment variables.
   - Enable sourcemaps in Vite build configuration.
4. **Error Boundary Setup:**
   - Wrap the main application component or layout in Sentry's `ErrorBoundary` to catch rendering crashes and display the Sentry feedback dialog.
5. **Environment Configuration:**
   - Add template entries for `VITE_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` in `.env.example`.

## Non-Functional Requirements
- **Build Impact:** Keep sourcemaps enabled during build but ensure they are secure and uploaded to Sentry rather than exposed in production.
- **Privacy:** Enforce strict session replay masking (`maskAllText: true`, `blockAllMedia: true`) to comply with user privacy regulations.

## Acceptance Criteria
- [ ] Application starts and runs successfully locally (`npm run dev`).
- [ ] Production build compiles with source maps and lints clean (`npm run lint && npm run build`).
- [ ] Sentry is initialized at startup and complains gracefully if `VITE_SENTRY_DSN` is missing, without crashing the application.
- [ ] Sentry packages (`@sentry/react`, `@sentry/vite-plugin`) are installed as dependencies.
- [ ] All unit and component tests continue to pass.

## Out of Scope
- React Router browser tracing (since Shvilis does not use React Router).
