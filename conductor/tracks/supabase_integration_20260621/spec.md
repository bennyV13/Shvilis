# Specification - Supabase Users and Vercel Deployment

## Overview
Connect the Shvilis application to Supabase for secure user authentication and PostgreSQL database storage. This allows users to create accounts, sign in, and persist their Trip Profiles, Gear Checklists, and Meal Plans online. The application will be prepared for Vercel deployment using the Vercel CLI.

## Functional Requirements
1. **User Authentication:**
   - Sign Up, Sign In, and Sign Out interfaces styled to match the dark hiking theme.
   - Maintain authentication session state.
2. **Supabase Database & Schemas:**
   - SQL schema scripts for PostgreSQL tables:
     - `profiles`: User information.
     - `trip_profiles`: Saved weather, duration, terrain, and group size.
     - `checklist_items`: Combined list of custom items and rule-generated item states (isPacked, isWorn, isConsumable, quantity, assignedToMemberId, linkedGearWeightGrams).
     - `custom_categories`: User's custom checklist categories.
     - `meal_plans`: Calendar meal plans linked to food IDs.
     - `custom_foods`: User's custom food registry.
   - Enable Row-Level Security (RLS) on all tables to ensure users can only read and write their own data.
3. **Data Access Layer:**
   - Initialize Supabase client and Auth context.
   - Fetch data directly from Supabase tables on application mount if logged in.
   - Save updates directly to Supabase tables on change if logged in (falling back to localStorage if offline/guest).
4. **Vercel Deployment:**
   - Create `vercel.json` config.
   - Configure environment variables for Vercel deployment.
   - Prepare deployment scripts/procedures using Vercel CLI.

## Acceptance Criteria
- User sign-up, login, and logout flow operates correctly.
- Registered users have their data loaded from and saved to Supabase (verified with tests and mock client).
- RLS policies restrict database access exclusively to the authenticated owner.
- ESLint and tests pass with high coverage (>80% for new code).
- Successful mock deployment configuration prepared for Vercel CLI.

## Out of Scope
- Complex offline queueing (uses online-first approach, with localStorage as guest/offline fallback).
- Multi-factor authentication (MFA).
