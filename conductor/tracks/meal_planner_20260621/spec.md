# Specification - Core Trail Food Database & Meal Planner

## Overview
This feature implements the core nutrition planning engine for **Shvilis**. It enables users to select from a predefined database of trail foods, add custom foods, build a daily meal schedule for their trip, and calculate total calories, macronutrients (proteins, fats, carbs), and sodium based on portion sizes. It also provides a weight-to-calorie efficiency score (kcal/gram) to help backpackers optimize their food weight.

## Key Features
1. **Predefined Trail Food Registry:** A library of standard hiking foods with nutritional properties per 100 grams.
2. **Custom Food Creator:** A form for users to add custom foods with their respective nutrient profiles.
3. **Trip Meal Scheduler:** A layout where users can group food portions into daily schedules under Breakfast, Lunch, Dinner, and Snacks.
4. **Live Nutritive Calculations:** Dynamic calculation of total daily/trip calories, macronutrients, and weight.
5. **Calorie Density Indicator:** Highlighting high-efficiency foods (e.g., >4 kcal/g) and low-efficiency ones to help minimize pack weight.

## Data Structures

### Food Item Definition
```typescript
interface FoodItem {
  id: string; // UUID or short slug
  name: string;
  caloriesPer100g: number; // kcal
  proteinPer100g: number; // grams
  fatPer100g: number; // grams
  carbsPer100g: number; // grams
  sodiumPer100g: number; // mg
  isCustom?: boolean; // True if created by the user
}
```

### Meal Plan Structure
```typescript
interface PlannedMealItem {
  id: string; // Unique instance ID
  foodId: string;
  portionGrams: number;
}

interface DailyMealPlan {
  dayIndex: number; // e.g., Day 1, Day 2
  breakfast: PlannedMealItem[];
  lunch: PlannedMealItem[];
  dinner: PlannedMealItem[];
  snacks: PlannedMealItem[];
}
```

## User Experience (UX) Flow
1. **Explore Library:** User opens the "Meal Planner" tab, showing a list of days in their trip.
2. **Manage Custom Foods:** User can click "Add Custom Food" and input name, calories, protein, fat, carbs, and sodium per 100g.
3. **Plan meals:** For any given day, the user can click "Add Item" in a meal category (e.g., Breakfast), select a food from the registry, and enter the portion weight (in grams).
4. **Live Summaries:** The screen displays a running tally of:
   - Total Trip Food Weight (kg)
   - Total Calories (kcal) & Caloric Density (kcal/g)
   - Daily breakdown of macronutrient ratios (percentages and grams) and sodium content.
