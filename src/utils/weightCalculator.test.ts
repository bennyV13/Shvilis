import { describe, it, expect } from 'vitest';
import { calculateGearWeights } from './weightCalculator';
import type { ChecklistItem } from '../types/checklist';

describe('weightCalculator', () => {
  it('should return zeros when items list is empty and food weight is zero', () => {
    const result = calculateGearWeights([], 0);
    expect(result.baseWeightGrams).toBe(0);
    expect(result.consumableWeightGrams).toBe(0);
    expect(result.wornWeightGrams).toBe(0);
    expect(result.skinOutWeightGrams).toBe(0);
  });

  it('should calculate weights correctly for packed items', () => {
    const items: ChecklistItem[] = [
      // Packed base weight items
      { id: '1', name: 'Tent', category: 'shelter', quantity: 1, isRequiredByRules: true, isPacked: true, linkedGearWeightGrams: 2000 },
      { id: '2', name: 'Stove', category: 'kitchen', quantity: 1, isRequiredByRules: true, isPacked: true, linkedGearWeightGrams: 500 },
      // Unpacked item (should be ignored)
      { id: '3', name: 'Sleeping Bag', category: 'sleep', quantity: 1, isRequiredByRules: true, isPacked: false, linkedGearWeightGrams: 1000 },
      // Packed Worn item (should go to worn weight)
      { id: '4', name: 'Hiking Boots', category: 'clothing', quantity: 1, isRequiredByRules: true, isPacked: true, isWorn: true, linkedGearWeightGrams: 1200 },
      // Packed Consumable item (should go to consumable weight)
      { id: '5', name: 'Fuel Canister', category: 'kitchen', quantity: 2, isRequiredByRules: true, isPacked: true, isConsumable: true, linkedGearWeightGrams: 300 },
    ];

    const result = calculateGearWeights(items, 1500); // 1500g food weight from Meal Planner

    // Base Weight = Tent (2000g * 1) + Stove (500g * 1) = 2500g
    expect(result.baseWeightGrams).toBe(2500);

    // Worn Weight = Hiking Boots (1200g * 1) = 1200g
    expect(result.wornWeightGrams).toBe(1200);

    // Consumables = Fuel (300g * 2) + Food (1500g) = 2100g
    expect(result.consumableWeightGrams).toBe(2100);

    // Skin-Out = Base (2500g) + Worn (1200g) + Consumables (2100g) = 5800g
    expect(result.skinOutWeightGrams).toBe(5800);

    // Category weights breakdown
    expect(result.categoryWeights['shelter']).toBe(2000);
    expect(result.categoryWeights['kitchen']).toBe(1100); // Stove (500) + Fuel (600)
    expect(result.categoryWeights['clothing']).toBe(1200); // Boots (1200)
    expect(result.categoryWeights['food']).toBe(1500); // Meal planner food
  });
});
