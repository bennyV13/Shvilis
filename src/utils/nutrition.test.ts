import { describe, it, expect } from 'vitest';
import type { FoodItem } from '../types/food';
import type { PlannedMealItem, DailyMealPlan } from '../types/meal';
import {
  calculateMealNutrients,
  calculateDailyNutrients,
  calculateTripNutrients,
  calculateCaloricDensity,
  calculateMacroRatios
} from './nutrition';

const testFoods: FoodItem[] = [
  {
    id: 'oatmeal',
    name: 'Oatmeal',
    caloriesPer100g: 380,
    proteinPer100g: 10,
    fatPer100g: 5,
    carbsPer100g: 70,
    sodiumPer100g: 2,
    isCustom: false,
  },
  {
    id: 'peanut-butter',
    name: 'Peanut Butter',
    caloriesPer100g: 600,
    proteinPer100g: 20,
    fatPer100g: 50,
    carbsPer100g: 20,
    sodiumPer100g: 300,
    isCustom: false,
  },
];

describe('nutrition calculations', () => {
  it('should correctly sum nutrients for a list of meal items', () => {
    const items: PlannedMealItem[] = [
      { id: '1', foodId: 'oatmeal', portionGrams: 50 }, // 190 kcal, 5g protein, 2.5g fat, 35g carbs, 1mg sodium
      { id: '2', foodId: 'peanut-butter', portionGrams: 20 }, // 120 kcal, 4g protein, 10g fat, 4g carbs, 60mg sodium
    ];

    const totals = calculateMealNutrients(items, testFoods);
    expect(totals.calories).toBeCloseTo(310);
    expect(totals.protein).toBeCloseTo(9);
    expect(totals.fat).toBeCloseTo(12.5);
    expect(totals.carbs).toBeCloseTo(39);
    expect(totals.sodium).toBeCloseTo(61);
    expect(totals.weightGrams).toBe(70);
  });

  it('should handle missing foods gracefully by returning zero nutrients for that item', () => {
    const items: PlannedMealItem[] = [
      { id: '1', foodId: 'oatmeal', portionGrams: 50 },
      { id: '2', foodId: 'non-existent', portionGrams: 20 },
    ];

    const totals = calculateMealNutrients(items, testFoods);
    expect(totals.calories).toBeCloseTo(190);
    expect(totals.weightGrams).toBe(70); // Weight still includes portion size
  });

  it('should correctly sum daily nutrients across categories', () => {
    const plan: DailyMealPlan = {
      dayIndex: 0,
      breakfast: [{ id: '1', foodId: 'oatmeal', portionGrams: 100 }], // 380 kcal
      lunch: [],
      dinner: [{ id: '2', foodId: 'peanut-butter', portionGrams: 50 }], // 300 kcal
      snacks: [],
    };

    const totals = calculateDailyNutrients(plan, testFoods);
    expect(totals.calories).toBeCloseTo(680);
    expect(totals.weightGrams).toBe(150);
  });

  it('should correctly sum trip nutrients across multiple days', () => {
    const plans: DailyMealPlan[] = [
      {
        dayIndex: 0,
        breakfast: [{ id: '1', foodId: 'oatmeal', portionGrams: 100 }], // 380 kcal
        lunch: [],
        dinner: [],
        snacks: [],
      },
      {
        dayIndex: 1,
        breakfast: [],
        lunch: [],
        dinner: [{ id: '2', foodId: 'peanut-butter', portionGrams: 100 }], // 600 kcal
        snacks: [],
      },
    ];

    const totals = calculateTripNutrients(plans, testFoods);
    expect(totals.calories).toBeCloseTo(980);
    expect(totals.weightGrams).toBe(200);
  });

  it('should calculate caloric density correctly', () => {
    expect(calculateCaloricDensity(400, 100)).toBeCloseTo(4.0);
    expect(calculateCaloricDensity(0, 100)).toBe(0);
    expect(calculateCaloricDensity(400, 0)).toBe(0);
  });

  it('should calculate macro ratios based on calories from protein, fat, and carbs', () => {
    // protein: 10g (40 kcal), fat: 10g (90 kcal), carbs: 20g (80 kcal) -> Total: 210 kcal
    const ratios = calculateMacroRatios(10, 10, 20);
    expect(ratios.proteinPercent).toBeCloseTo((40 / 210) * 100);
    expect(ratios.fatPercent).toBeCloseTo((90 / 210) * 100);
    expect(ratios.carbsPercent).toBeCloseTo((80 / 210) * 100);
  });

  it('should handle zero macros safely', () => {
    const ratios = calculateMacroRatios(0, 0, 0);
    expect(ratios.proteinPercent).toBe(0);
    expect(ratios.fatPercent).toBe(0);
    expect(ratios.carbsPercent).toBe(0);
  });
});
