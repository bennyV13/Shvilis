export interface PlannedMealItem {
  id: string;
  foodId: string;
  portionGrams: number;
}

export interface DailyMealPlan {
  dayIndex: number;
  breakfast: PlannedMealItem[];
  lunch: PlannedMealItem[];
  dinner: PlannedMealItem[];
  snacks: PlannedMealItem[];
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sodium: number;
  weightGrams: number;
}

export interface MacroRatios {
  proteinPercent: number;
  fatPercent: number;
  carbsPercent: number;
}
