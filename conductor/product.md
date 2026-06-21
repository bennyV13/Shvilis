# Initial Concept

A web application

---

# Product Guide - Shvilis

## Product Vision
Shvilis (Hebrew for "Trails" or "Paths") is a premium web application designed to be the ultimate smart packing and preparation assistant for outdoor adventures. It helps hikers, backpackers, and group trip coordinators plan, optimize, and organize their gear, food, and supplies. It integrates gear weight tracking with a comprehensive nutrition and meal planner to ensure hikers have both the physical preparation and nutritional fuel required for their journeys.

## Target Audience
- **Day Hikers:** Need simple checklists to ensure essentials (water, navigation, first aid) are not forgotten.
- **Backpackers & Thru-Hikers:** Focused on minimizing pack weight, tracking base weight vs. consumable weight, and planning high-calorie meal systems.
- **Group Trip Leads:** Organizing multi-person trips, needing to distribute group gear (tents, stoves, filters) and track who is carrying what.

## Key Features
1. **Intelligent Checklist Generator:** Dynamically generates a tailored packing list by analyzing expected weather conditions, trip duration, trail terrain, and target group size.
2. **Gear Weight Optimizer:** Tracks item-by-item weight to calculate total base weight, skin-out weight, and consumable weight, complete with visual breakdown charts (e.g., shelter, sleep system, kitchen, clothing).
3. **Nutritional & Meal Planner:**
   - **Meal Scheduler:** Plan daily meals (Breakfast, Lunch, Dinner, Snacks) for the duration of the trip.
   - **Calorie & Macro Calculator:** Automatically calculates total calories, proteins, fats, carbs, and sodium based on meal portions.
   - **Nutrient Database:** A built-in registry of common trail foods with nutrient profiles per 100g (e.g., oatmeal, nuts, dried fruits, dehydrated meals, bars).
   - **Custom Food Manager:** Let users add their own custom foods and input their nutritional values per 100g.
   - **Weight-to-Calorie Efficiency:** Calculates calorie density (kcal/gram) to help thru-hikers optimize food weight.
4. **Shared Group Packing:** Allows group organizers to assign shared equipment (stoves, water filters, group first-aid kits) to specific members, avoiding duplicates and balancing the load.
5. **Interactive Preparation Checklist:** Includes pre-trip status checklists (e.g., downloading offline maps, checking trail permits, informing emergency contacts, weather checks).

## Design Objectives
- **Modern Hiking Aesthetic:** Sleek, high-contrast dark theme with mountain-inspired greens and earth tones. Clean, readable data tables for weight management, and progress indicators for packing state.
- **Offline & Cloud Sync:** A responsive, lightweight view that runs offline-first with localStorage, and automatically syncs to a secure Supabase backend when logged in to persist trip profiles, gear checklists, and meal plans across devices.
