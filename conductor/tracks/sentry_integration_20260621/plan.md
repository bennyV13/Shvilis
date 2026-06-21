# Implementation Plan - Sentry Integration

## Phase 1: Installation and Env Configuration [checkpoint: 2b6a0a1]
- [x] Task: Install `@sentry/react` and `@sentry/vite-plugin` dependencies (5ba5bf4)
- [x] Task: Configure project environment variables template (`.env.example`) with Sentry variables (5ba5bf4)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Installation and Env Configuration' (Protocol in workflow.md) (2b6a0a1)

## Phase 2: Sentry Client Initialization [checkpoint: 965e027]
- [x] Task: Write failing unit tests for Sentry client initialization utility (`src/instrument.test.ts`) (dc9b317)
- [x] Task: Implement Sentry client initialization in `src/instrument.ts` and import it at the top of `src/main.tsx` (dc9b317)
- [x] Task: Verify unit tests pass and code coverage meets requirements (>80%) (dc9b317)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Sentry Client Initialization' (Protocol in workflow.md) (965e027)

## Phase 3: Error Boundary & Integration [checkpoint: ]
- [ ] Task: Write failing tests verifying the presence of Sentry's ErrorBoundary in the React component tree
- [ ] Task: Wrap the main application component in Sentry's ErrorBoundary inside `src/App.tsx`
- [ ] Task: Verify that all tests pass and meet coverage requirements
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Error Boundary & Integration' (Protocol in workflow.md)

## Phase 4: Vite Plugin Configuration & QA Check [checkpoint: ]
- [ ] Task: Add `@sentry/vite-plugin` integration and enable sourcemaps in `vite.config.ts`
- [ ] Task: Verify production build passes and runs correctly locally (`npm run build`)
- [ ] Task: Conduct a final QA check (linting, TypeScript types, and formatting checks)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Vite Plugin Configuration & QA Check' (Protocol in workflow.md)
