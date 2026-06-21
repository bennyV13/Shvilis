# Specification - Gear Weight Optimizer

## Overview
The Gear Weight Optimizer calculates and visualizes pack weights. It breaks down gear weights by category and calculates core backpacking metrics: Base Weight, Consumable Weight, Worn Weight, and Skin-Out Weight. It integrates directly with the Checklist (inline weight edits) and the Meal Planner (pulls total food weight).

## Functional Requirements
1. **Weight Category Breakdown:**
   - Supports standard categories: Essentials, Shelter, Sleep System, Kitchen, Clothing, Navigation, Safety, Group, and any Custom Categories.
   - Categorizes weight into Base, Consumable, and Worn.
2. **Key Metric Calculations:**
   - **Base Weight:** Sum of packed, non-consumable items in the backpack.
   - **Consumable Weight:** Food, water, and fuel weight (automatically includes total food weight from Meal Planner, plus any items marked as consumable).
   - **Worn Weight:** Items marked as "Worn" (carried on body rather than in the pack).
   - **Total Skin-Out Weight:** Base Weight + Consumable Weight + Worn Weight.
3. **Checklist Integration:**
   - Add a "Worn" toggle checkbox next to checklist items. If marked worn, the item's weight is excluded from Base Weight and added to Worn Weight.
   - Add a "Consumable" toggle checkbox/indicator next to checklist items, or classify them by category (e.g. food/fuel).
4. **Visual Chart & Dashboard:**
   - Render horizontal breakdown progress bars showing the weight of each category.
   - Display a modern dark card displaying the 4 key metrics (Base, Consumable, Worn, Skin-Out) with high-contrast text and unit indicators (kg/g).
   - Display a breakdown bar for Base vs. Consumable vs. Worn weight.

## Acceptance Criteria
- Correctly calculates and displays Base, Consumable, Worn, and Skin-Out weights.
- Updates all calculations immediately when item weights, quantities, packed states, or "worn" states change.
- Visual progress bars correctly reflect category weight proportions.
- Integrates total food weight from the Meal Planner as consumable weight.
- Component unit and integration tests achieve >80% coverage.

## Out of Scope
- A standalone "Gear Locker" database (relies on inline checklist item weights).
- Complex chart libraries (implemented using CSS/Tailwind progress bars for light weight and stability).
