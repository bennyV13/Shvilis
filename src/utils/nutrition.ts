import type { FoodItem } from '../types/food';
import type { PlannedMealItem, DailyMealPlan, NutritionTotals, MacroRatios } from '../types/meal';

export function calculateMealNutrients(items: PlannedMealItem[], foods: FoodItem[]): NutritionTotals {
  const totals: NutritionTotals = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    sodium: 0,
    weightGrams: 0,
  };

  for (const item of items) {
    totals.weightGrams += item.portionGrams;
    const food = foods.find((f) => f.id === item.foodId);
    if (food) {
      const factor = item.portionGrams / 100;
      totals.calories += food.caloriesPer100g * factor;
      totals.protein += food.proteinPer100g * factor;
      totals.fat += food.fatPer100g * factor;
      totals.carbs += food.carbsPer100g * factor;
      totals.sodium += food.sodiumPer100g * factor;
    }
  }

  return totals;
}

export function calculateDailyNutrients(plan: DailyMealPlan, foods: FoodItem[]): NutritionTotals {
  const categories = [plan.breakfast, plan.lunch, plan.dinner, plan.snacks];
  const totals: NutritionTotals = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    sodium: 0,
    weightGrams: 0,
  };

  for (const category of categories) {
    const catTotals = calculateMealNutrients(category, foods);
    totals.calories += catTotals.calories;
    totals.protein += catTotals.protein;
    totals.fat += catTotals.fat;
    totals.carbs += catTotals.carbs;
    totals.sodium += catTotals.sodium;
    totals.weightGrams += catTotals.weightGrams;
  }

  return totals;
}

export function calculateTripNutrients(plans: DailyMealPlan[], foods: FoodItem[]): NutritionTotals {
  const totals: NutritionTotals = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    sodium: 0,
    weightGrams: 0,
  };

  for (const day of plans) {
    const dayTotals = calculateDailyNutrients(day, foods);
    totals.calories += dayTotals.calories;
    totals.protein += dayTotals.protein;
    totals.fat += dayTotals.fat;
    totals.carbs += dayTotals.carbs;
    totals.sodium += dayTotals.sodium;
    totals.weightGrams += dayTotals.weightGrams;
  }

  return totals;
}

export function calculateCaloricDensity(calories: number, weightGrams: number): number {
  return calories > 0 && weightGrams > 0 ? calories / weightGrams : 0;
}

export function calculateMacroRatios(protein: number, fat: number, carbs: number): MacroRatios {
  const pCal = protein * 4;
  const fCal = fat * 9;
  const cCal = carbs * 4;
  const totalCal = pCal + fCal + cCal;

  if (totalCal <= 0) {
    return { proteinPercent: 0, fatPercent: 0, carbsPercent: 0 };
  }

  return {
    proteinPercent: (pCal / totalCal) * 100,
    fatPercent: (fCal / totalCal) * 100,
    carbsPercent: (cCal / totalCal) * 100,
  };
}
