import type { ChecklistItem } from '../types/checklist';

export interface GearWeightTotals {
  baseWeightGrams: number;
  consumableWeightGrams: number;
  wornWeightGrams: number;
  skinOutWeightGrams: number;
  categoryWeights: Record<string, number>;
}

export function calculateGearWeights(
  items: ChecklistItem[],
  mealPlannerFoodWeightGrams: number
): GearWeightTotals {
  let baseWeightGrams = 0;
  let consumableWeightGrams = mealPlannerFoodWeightGrams;
  let wornWeightGrams = 0;
  const categoryWeights: Record<string, number> = {};

  if (mealPlannerFoodWeightGrams > 0) {
    categoryWeights['food'] = mealPlannerFoodWeightGrams;
  }

  for (const item of items) {
    if (!item.isPacked) continue;

    const weight = (item.linkedGearWeightGrams || 0) * item.quantity;
    if (weight <= 0) continue;

    if (item.isWorn) {
      wornWeightGrams += weight;
    } else if (item.isConsumable) {
      consumableWeightGrams += weight;
    } else {
      baseWeightGrams += weight;
    }

    categoryWeights[item.category] = (categoryWeights[item.category] || 0) + weight;
  }

  const skinOutWeightGrams = baseWeightGrams + consumableWeightGrams + wornWeightGrams;

  return {
    baseWeightGrams,
    consumableWeightGrams,
    wornWeightGrams,
    skinOutWeightGrams,
    categoryWeights,
  };
}
